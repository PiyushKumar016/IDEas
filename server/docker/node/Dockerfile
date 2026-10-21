FROM node:20-slim

RUN useradd -m coderunner

USER coderunner

WORKDIR /code

CMD ["sh", "-c", "timeout 5 node main.js 2>&1"]