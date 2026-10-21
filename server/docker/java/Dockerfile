FROM eclipse-temurin:17-jdk-alpine

RUN adduser -D coderunner

USER coderunner

WORKDIR /code

CMD ["sh", "-c", "javac Main.java 2>&1 && timeout 5 java Main 2>&1"]