pipeline {
    agent any

    options {
        timeout(time: 40, unit: 'MINUTES')
        timestamps()
        skipStagesAfterUnstable()
    }

    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
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
                            bat "docker build -t ibraahiimm/portfolio-frontend:latest -t ibraahiimm/portfolio-frontend:${BUILD_NUMBER} ."
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            bat "docker build -t ibraahiimm/portfolio-backend:latest -t ibraahiimm/portfolio-backend:${BUILD_NUMBER} ."
                        }
                    }
                }
            }
        }
                stage('Deploy Kubernetes') {
            steps {
                echo 'Deploiement sur Kubernetes...'

                // Namespace
                bat "kubectl apply -f k8s\\namespace.yml"

                // Secrets MongoDB
                bat "kubectl apply -f k8s\\secret.yml"

                // MongoDB
                bat "kubectl apply -f k8s\\mongodb-deployment.yml"
                bat "kubectl apply -f k8s\\mongodb-service.yml"

                // Attendre MongoDB
                bat "kubectl rollout status deployment/mongodb -n %K8S_NAMESPACE% --timeout=120s"

                // Backend
                bat "kubectl apply -f k8s\\backend-deployment.yml"
                bat "kubectl apply -f k8s\\backend-service.yml"

                // Mettre à jour image backend
                bat "kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${BUILD_NUMBER} -n %K8S_NAMESPACE%"
                bat "kubectl rollout status deployment/backend -n %K8S_NAMESPACE% --timeout=120s"

                // Frontend
                bat "kubectl apply -f k8s\\frontend-deployment.yml"
                bat "kubectl apply -f k8s\\frontend-service.yml"

                // Mettre à jour image frontend
                bat "kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} -n %K8S_NAMESPACE%"
                bat "kubectl rollout status deployment/frontend -n %K8S_NAMESPACE% --timeout=120s"
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verification du deploiement Kubernetes...'

                // Attendre que tout soit prêt
                bat 'ping localhost -n 16 > nul'

                // Voir les pods
                bat "kubectl get pods -n %K8S_NAMESPACE%"

                // Voir les services
                bat "kubectl get services -n %K8S_NAMESPACE%"

                // Voir les deployments
                bat "kubectl get deployments -n %K8S_NAMESPACE%"
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
                            bat "docker push ibraahiimm/portfolio-frontend:latest"
                            bat "docker push ibraahiimm/portfolio-frontend:${BUILD_NUMBER}"
                            bat "docker push ibraahiimm/portfolio-backend:latest"
                            bat "docker push ibraahiimm/portfolio-backend:${BUILD_NUMBER}"
                            bat 'docker logout'
                        }
                    }
                }

                // ✅ STAGE CORRIGÉ
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

        stage('Deploy') {
            steps {
                echo 'Deploiement...'
                bat 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                bat 'ping -n 6 127.0.0.1 > nul'
                bat 'docker ps'
            }
        }
    }

    post {
        always {
            echo 'Fin du pipeline.'
        }
        success {
            echo '✅ Pipeline reussi.'
            echo 'Ibrahima vous avez fait un super travail, continuez comme ça !'
            mail(
                to: 'ibrahim.ibn.hi@gmail.com',
                subject: "SUCCESS: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Logs: ${BUILD_URL}"
            )
        }
        failure {
            echo '❌ Pipeline echoue.'
            echo 'Ibrahima vous avez fait un super travail, même si ça ne marche pas, Ne lâcher pas!'
            mail(
                to: 'ibrahim.ibn.hi@gmail.com',
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Logs: ${BUILD_URL}"
            )
        }
    }
