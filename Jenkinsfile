pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'ibraahiimm'
        FRONTEND_IMAGE  = "${DOCKER_HUB_USER}/portfolio-frontend"
        BACKEND_IMAGE   = "${DOCKER_HUB_USER}/portfolio-backend"
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
                // ✅ CORRECTION 1 : withCredentials + login direct sans --password-stdin
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    bat "docker push ${FRONTEND_IMAGE}:latest"
                    bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                    bat "docker push ${BACKEND_IMAGE}:latest"
                    bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    bat "docker logout"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploiement avec docker compose...'
                bat "docker compose down || exit 0"
                bat "docker compose pull"
                bat "docker compose up -d"
                echo 'Application deployee sur http://localhost:80'
            }
        }

        stage('Health Check') {
            steps {
                bat 'ping localhost -n 16 > nul'
                bat 'docker ps'
            }
        }
    }

    // ✅ CORRECTION 2 : post sans bat, seulement des echo
    post {
        success {
            echo '✅ Pipeline termine avec succes ! Portfolio en ligne sur http://localhost:80'
            mail(
                to:      'ibrahim.ibn.hi@gmail.com',
                subject: "✅ [Jenkins] Build #${env.BUILD_NUMBER} — Succès",
                body:    """
                Bonjour,

                Votre pipeline s'est terminé avec succès !

                Job     : ${env.JOB_NAME}
                Build   : #${env.BUILD_NUMBER}
                Durée   : ${currentBuild.durationString}
                Logs    : ${env.BUILD_URL}
                """
            )
        }
        failure {
            echo '❌ Erreur dans le pipeline. Verifiez les logs ci-dessus.'
                mail(
                    to:      'ibrahim.ibn.hi@gmail.com',
                    subject: "❌ [Jenkins] Build #${env.BUILD_NUMBER} — ÉCHEC",
                    body:    """
                    Bonjour,

                    Votre pipeline s'est terminé avec échec !

                    Job     : ${env.JOB_NAME}
                    Build   : #${env.BUILD_NUMBER}
                    Durée   : ${currentBuild.durationString}
                    Logs    : ${env.BUILD_URL}
                """
)
        }
        always {
            echo 'Fin du pipeline.'
        }
    }
}