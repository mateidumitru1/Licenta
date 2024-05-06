FROM maven:3.8.4-openjdk-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src src
RUN mvn package -DskipTests

FROM openjdk:21-jdk-slim

EXPOSE 8080

COPY --from=build /app/target/demo-1.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
