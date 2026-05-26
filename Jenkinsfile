pipeline {
    agent any

    environment {
        DOCKER_PASS = credentials('dockerhub-credentials')
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Recuperation du code depuis GitHub...'
                checkout scm
            }
        }

        stage('Build Images Docker') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        echo 'Build image Docker Frontend...'
                        dir('frontend') {
                            bat "docker build -t ibraahiimm/portfolio-frontend:latest -t ibraahiimm/portfolio-frontend:${BUILD_NUMBER} ."
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        echo 'Build image Docker Backend...'
                        dir('backend') {
                            bat "docker build -t ibraahiimm/portfolio-backend:latest -t ibraahiimm/portfolio-backend:${BUILD_NUMBER} ."
                        }
                    }
                }
            }
        }

        stage('Push vers Docker Hub') {
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

        // ✅ STAGE CORRIGÉ ICI
        stage('SonarQube Analysis') {
            steps {
                echo 'Analyse de code avec SonarQube...'
                withSonarQubeEnv('sonarqube-server') {
                    bat '''
                        sonar-scanner ^
                          -Dsonar.projectKey=portfolio ^
                          -Dsonar.sources=. ^
                          -Dsonar.host.url=http://host.docker.internal:9000 ^
                          -Dsonar.token=%SONAR_TOKEN%
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploiement en cours...'
                bat 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verification de sante...'
                bat 'timeout /t 10 /nobreak'
                bat 'docker ps'
            }
        }
    }

    post {
        always {
            echo 'Fin du pipeline.'
        }
        success {
            echo '✅ Pipeline reussi avec succes.'
        }
        failure {
            echo '❌ Erreur dans le pipeline. Verifiez les logs ci-dessus.'
            mail(
                to: 'ton-email@example.com',
                subject: "Pipeline FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Verifiez les logs : ${BUILD_URL}"
            )
        }
    }
}