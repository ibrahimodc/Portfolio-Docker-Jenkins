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
                bat 'timeout /t 5 /nobreak'
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
            mail(
                to: 'ibrahim.ibn.hi.com',
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Logs: ${BUILD_URL}"
            )
        }
        failure {
            echo '❌ Pipeline echoue.'
            mail(
                to: 'ibrahim.ibn.hi.com',
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Logs: ${BUILD_URL}"
            )
        }
    }
}