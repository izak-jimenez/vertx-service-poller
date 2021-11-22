:: Run this batch file to setup the fullstack application in Windows

call ./gradlew clean build
call java -jar build/libs/service-poller-1.0.0-SNAPSHOT-fat.jar run com.kry.codetest.service_poller.ServiceVerticle
pause
