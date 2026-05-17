pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'ibraahiimm'
        FRONTEND_IMAGE  = "${DOCKER_HUB_USER}/portfolio-frontend"
        BACKEND_IMAGE   = "${DOCKER_HUB_USER}/portfolio-backend"
        DOCKER_CREDS    = credentials('dockerhub-credentials')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
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
                            bat "docker build -t ${FRONTEND_IMAGE}:latest -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ."
                        }
                    }
                }

                stage('Build Backend') {
                    steps {
                        echo 'Build image Docker Backend...'
                        dir('backend') {
                            bat "docker build -t ${BACKEND_IMAGE}:latest -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                        }
                    }
                }
            }
        }

        stage('Push vers Docker Hub') {
            steps {
                echo 'Push des images vers Docker Hub...'
                bat "echo %DOCKER_CREDS_PSW% | docker login -u %DOCKER_CREDS_USR% --password-stdin"
                bat "docker push ${FRONTEND_IMAGE}:latest"
                bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                bat "docker push ${BACKEND_IMAGE}:latest"
                bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploiement avec docker compose...'
                bat "docker compose down || exit 0"
                bat "docker compose pull"
                bat "docker compose up -d"
                echo 'Application deployee sur http://localhost:3000'
            }
        }

        stage('Health Check') {
            steps {
                bat 'timeout /t 15 /nobreak'
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Pipeline termine avec succes ! Portfolio en ligne sur http://localhost:3000'
        }
        failure {
            echo 'Erreur dans le pipeline. Verifiez les logs ci-dessus.'
        }
        always {
            bat 'docker logout'
        }
    }
}
