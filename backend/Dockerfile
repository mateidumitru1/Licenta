FROM maven:3.9.6-amazoncorretto-21 AS build
ARG JAR_FILE=target/*.jar
COPY ./target/backend-latest.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

EXPOSE 8080

ENV PGSQL_URL=${{ secrets.GH_PGSQL_URL }}
ENV PGSQL_DB=${{ secrets.GH_PGSQL_DB }}
ENV PGSQL_USER=${{ secrets.GH_PGSQL_USER }}
ENV PGSQL_PASSWORD=${{ secrets.GH_PGSQL_PASSWORD }}
ENV MAPBOX_API_KEY=${{ secrets.GH_MAPBOX_API_KEY }}
ENV SENDGRID_API_KEY=${{ secrets.GH_SENDGRID_API_KEY }}
ENV JWT_SECRET_KEY=${{ secrets.GH_JWT_SECRET_KEY }}
