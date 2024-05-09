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

RUN echo "DB URL:" $db-url
RUN echo "DB Name:" $db-name
RUN echo "DB User:" $db-user
RUN echo "DB Password:" $db-password
RUN echo "Mapbox API Key:" $mapbox-api-key
RUN echo "Sendgrid API Key:" $sendgrid-api-key
RUN echo "JWT Secret Key" $jwt-secret-key

# ENV PGSQL_URL=$db-url
# ENV PGSQL_DB=$db-name
# ENV PGSQL_USER=$db-user
# ENV PGSQL_PASSWORD=$db-password
# ENV MAPBOX_API_KEY=$mapbox-api-key
# ENV SENDGRID_API_KEY=$sendgrid-api-key
# ENV JWT_SECRET_KEY=$jwt-secret-key
