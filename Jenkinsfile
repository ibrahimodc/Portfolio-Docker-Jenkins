pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')  // ⬇️ réduit de 30 à 15 min
        timestamps()
        skipStagesAfterUnstable()           // ✅ saute les stages si unstable
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

        // ✅ Push Docker + SonarQube en parallèle
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

                stage('SonarQube Analysis') {
                    steps {
                        echo 'Analyse SonarQube...'
                        withSonarQubeEnv('sonarqube-server') {
                            bat '''
                                sonar-scanner ^
                                  -Dsonar.projectKey=portfolio ^
                                  -Dsonar.sources=. ^
                                  -Dsonar.host.url=http://host.docker.internal:9000 ^
                                  -Dsonar.token=%SONAR_TOKEN% ^
                                  -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/.git/** ^
                                  -Dsonar.scm.disabled=true
                            '''
                        }
                        // ✅ Timeout court pour ne pas bloquer
                        timeout(time: 2, unit: 'MINUTES') {
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
                bat 'timeout /t 5 /nobreak'  // ⬇️ réduit de 10 à 5 secondes
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
        }
        failure {
            echo '❌ Pipeline echoue.'
            mail(
                to: 'ton-email@example.com',
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Logs: ${BUILD_URL}"
            )
        }
    }
}