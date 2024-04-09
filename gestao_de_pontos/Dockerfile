# Dockerfile para rodar a aplicação em produção
FROM ubuntu:latest AS build

RUN apt-get update
RUN apt-get install openjdk-17-jdk -y
COPY . .

RUN apt-get install maven -y
RUN mvn clean install

FROM openjdk:17-jdk-slim
EXPOSE 8080

COPY --from=build /target/gestao_de_pontos-0.0.1-SNAPSHOT.jar /app.jar

ENTRYPOINT [ "java", "-jar", "/app.jar" ]

# Dockerfile para rodar a aplicação localmente
# FROM maven:3.8.4-openjdk-17-slim
# WORKDIR /app
# COPY . .
# CMD ["mvn", "spring-boot:run"]