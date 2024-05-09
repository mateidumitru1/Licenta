FROM maven:3.9.6-amazoncorretto-21 AS build
ARG JAR_FILE=target/*.jar
COPY ./target/backend-latest.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

EXPOSE 8080

ARG db-url
ARG db-name
ARG db-user
ARG db-password
ARG mapbox-api-key
ARG sendgrid-api-key
ARG jwt-secret-key

RUN echo "db-url: $db-url"
RUN echo "db-name: $db-name"
RUN echo "db-user: $db-user"
RUN echo "db-password: $db-password
RUN echo "mapbox-api-key: $mapbox-api-key"
RUN echo "sendgrid-api-key: $sendgrid
RUN echo "jwt-secret-key: $jwt-secret

ENV PGSQL_URL=$db-url
ENV PGSQL_DB=$db-name
ENV PGSQL_USER=$db-user
ENV PGSQL_PASSWORD=$db-password
ENV MAPBOX_API_KEY=$mapbox-api-key
ENV SENDGRID_API_KEY=$sendgrid-api-key
ENV JWT_SECRET_KEY=$jwt-secret-key
