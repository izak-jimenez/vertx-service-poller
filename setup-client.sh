# Run this bash file to setup the application in Unix

echo "Building Next.js client"
# shellcheck disable=SC2164
cd "src/main/kry-service-poller-ui"

echo "Installing dependencies..."
yarn

echo "Running tests..."
yarn test

echo "Starting client application..."
yarn start
