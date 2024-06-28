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
                // List the contents of the current directory to verify the path
                sh 'ls -al'
                // Run the tests individually since they are in the root directory
                sh 'python3 -m unittest app.py'
            }
        }
    }

    stage('Push Image') {
        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
            app.push("latest")
        }
    }
}
