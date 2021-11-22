# Run this bash file to setup the application in Unix

# shellcheck disable=SC2034
export MONGODB_URI="mongodb+srv://kry:JBE7E3hBtgkRrSoL@kry-cluster.ovhky.mongodb.net/krydb?retryWrites=true&w=majority"
export MONGODB_DATABASE="krydb"

echo "Building Vert.x REST API"
./gradlew clean build

echo "Installing dependencies..."
java -jar build/libs/service-poller-1.0.0-SNAPSHOT-fat.jar run com.kry.codetest.service_poller.ServiceVerticle
