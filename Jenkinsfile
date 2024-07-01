node {
    def app

    stage('Clone Repository') {
        checkout scm
    }

    stage('Build Image') {
        app = docker.build("airowire12/amt")
    }

    stage('Test') {
        script {
            app.inside {
                sh 'ls -al'
                sh 'python3 -m unittest discover -s tests'
            }
        }
    }

    stage('Push Image') {
        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
            app.push("latest")
        }
    }
}
