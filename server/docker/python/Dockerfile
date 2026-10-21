FROM python:3.11-slim

RUN useradd -m coderunner

USER coderunner

WORKDIR /code

CMD ["sh", "-c", "timeout 5 python3 main.py 2>&1"]