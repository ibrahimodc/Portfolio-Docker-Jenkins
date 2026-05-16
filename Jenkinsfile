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
            emailext (
                to: "${EMAIL_DEST}",
                subject: "✅ [Jenkins] Build #${BUILD_NUMBER} — SUCCÈS — ${JOB_NAME}",
                body: """
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #28a745;">✅ Déploiement réussi !</h2>
                        <table border="1" cellpadding="8" style="border-collapse: collapse;">
                            <tr><td><b>Job</b></td><td>${JOB_NAME}</td></tr>
                            <tr><td><b>Build</b></td><td>#${BUILD_NUMBER}</td></tr>
                            <tr><td><b>Statut</b></td><td style="color:green;"><b>SUCCÈS</b></td></tr>
                            <tr><td><b>Durée</b></td><td>${currentBuild.durationString}</td></tr>
                            <tr><td><b>Portfolio</b></td><td><a href="http://localhost:80">http://localhost:80</a></td></tr>
                            <tr><td><b>Logs Jenkins</b></td><td><a href="${BUILD_URL}">${BUILD_URL}</a></td></tr>
                        </table>
                        <br>
                        <p>Images déployées :</p>
                        <ul>
                            <li>ibraahiimm/portfolio-frontend:${BUILD_NUMBER}</li>
                            <li>ibraahiimm/portfolio-backend:${BUILD_NUMBER}</li>
                        </ul>
                    </body>
                    </html>
                """,
                mimeType: 'text/html'
            )
        }
        failure {
            echo '❌ Erreur dans le pipeline. Verifiez les logs ci-dessus.'
            emailext (
                to: "${EMAIL_DEST}",
                subject: "❌ [Jenkins] Build #${BUILD_NUMBER} — ÉCHEC — ${JOB_NAME}",
                body: """
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #dc3545;">❌ Déploiement échoué !</h2>
                        <table border="1" cellpadding="8" style="border-collapse: collapse;">
                            <tr><td><b>Job</b></td><td>${JOB_NAME}</td></tr>
                            <tr><td><b>Build</b></td><td>#${BUILD_NUMBER}</td></tr>
                            <tr><td><b>Statut</b></td><td style="color:red;"><b>ÉCHEC</b></td></tr>
                            <tr><td><b>Durée</b></td><td>${currentBuild.durationString}</td></tr>
                            <tr><td><b>Logs Jenkins</b></td><td><a href="${BUILD_URL}console">${BUILD_URL}console</a></td></tr>
                        </table>
                        <br>
                        <p>Vérifiez les logs Jenkins pour identifier la cause de l'échec.</p>
                    </body>
                    </html>
                """,
                mimeType: 'text/html'
            )
        }
        always {
            echo 'Fin du pipeline.'
        }
    }
}