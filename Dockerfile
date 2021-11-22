FROM openjdk:11 as build
MAINTAINER Isaac Jimenez
COPY build/libs/service-poller-1.0.0-SNAPSHOT-fat.jar service-poller-1.0.0-SNAPSHOT-fat.jar
ENTRYPOINT ["java","-jar","service-poller-1.0.0-SNAPSHOT-fat.jar run com.kry.codetest.service_poller.ServiceVerticle"]
