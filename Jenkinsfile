pipeline {
    agent any

    options {
        timeout(time: 40, unit: 'MINUTES')
        timestamps()
        skipStagesAfterUnstable()
    }

    environment {
        SONAR_TOKEN       = credentials('sonarqube-token')
        DOCKER_IMAGE_USER = 'ibraahiimm'
        FRONTEND_IMAGE    = 'ibraahiimm/portfolio-frontend'
        BACKEND_IMAGE     = 'ibraahiimm/portfolio-backend'
        K8S_NAMESPACE     = 'portfolio'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Recuperation du code...'
                checkout scm
            }
        }

        stage('Build Images Docker') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            bat "docker build -t ${FRONTEND_IMAGE}:latest -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ."
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            bat "docker build -t ${BACKEND_IMAGE}:latest -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                        }
                    }
                }
            }
        }

        stage('Push & Analyse') {
            parallel {

                stage('Push Docker Hub') {
                    steps {
                        withCredentials([usernamePassword(
                            credentialsId: 'dockerhub-credentials',
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )]) {
                            bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                            bat "docker push ${FRONTEND_IMAGE}:latest"
                            bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                            bat "docker push ${BACKEND_IMAGE}:latest"
                            bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                            bat 'docker logout'
                        }
                    }
                }

                stage('SonarQube Analysis') {
                    steps {
                        echo 'Analyse SonarQube...'
                        withSonarQubeEnv('sonarqube-server') {
                            script {
                                def scannerHome = tool 'SonarScanner'
                                bat """
                                    "${scannerHome}\\bin\\sonar-scanner.bat" ^
                                    -Dsonar.projectKey=portfolio ^
                                    -Dsonar.sources=. ^
                                    -Dsonar.token=%SONAR_TOKEN% ^
                                    -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/.git/** ^
                                    -Dsonar.scm.disabled=true
                                """
                            }
                        }
                        timeout(time: 15, unit: 'MINUTES') {
                            waitForQualityGate abortPipeline: false
                        }
                    }
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                echo 'Deploiement sur Kubernetes...'

                // Namespace
                bat 'kubectl apply -f K8s\\namespace.yml'

                // Secrets MongoDB
                bat 'kubectl apply -f K8s\\mongodb\\secret.yml'

                // MongoDB
                bat 'kubectl apply -f K8s\\mongodb\\deployment.yml'
                bat 'kubectl apply -f K8s\\mongodb\\service.yml'
                // Attendre MongoDB
                bat 'kubectl rollout status deployment/mongodb -n %K8S_NAMESPACE% --timeout=120s'

                // Backend
                bat 'kubectl apply -f K8s\\backend\\deployment.yml'
                bat 'kubectl apply -f K8s\\backend\\service.yml'

                // Mettre a jour image backend avec le bon BUILD_NUMBER
                bat "kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${BUILD_NUMBER} -n %K8S_NAMESPACE%"
                bat 'kubectl rollout status deployment/backend -n %K8S_NAMESPACE% --timeout=120s'

                // Frontend
                bat 'kubectl apply -f K8s\\frontend\\deployment.yml'
                bat 'kubectl apply -f K8s\\frontend\\service.yml'

                // Mettre a jour image frontend avec le bon BUILD_NUMBER
                bat "kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} -n %K8S_NAMESPACE%"
                bat 'kubectl rollout status deployment/frontend -n %K8S_NAMESPACE% --timeout=120s'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verification du deploiement Kubernetes...'

                // Attendre que tout soit pret (15 secondes)
                bat 'ping localhost -n 16 > nul'

                // Voir l etat des pods
                bat 'kubectl get pods -n %K8S_NAMESPACE%'

                // Voir les services
                bat 'kubectl get services -n %K8S_NAMESPACE%'

                // Voir les deployments
                bat 'kubectl get deployments -n %K8S_NAMESPACE%'
            }
        }
    }

    post {
        always {
            echo 'Fin du pipeline.'
        }
        success {
            echo 'Pipeline reussi.'
            mail(
                to: 'ibrahim.ibn.hi@gmail.com',
                subject: "SUCCESS: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Le pipeline a reussi.\n\nLogs: ${BUILD_URL}"
            )
        }
        failure {
            echo 'Pipeline echoue.'
            mail(
                to: 'ibrahim.ibn.hi@gmail.com',
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Le pipeline a echoue.\n\nLogs: ${BUILD_URL}"
            )
        }
    }
}