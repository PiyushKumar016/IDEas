FROM gcc:12

RUN useradd -m coderunner

USER coderunner

WORKDIR /code

CMD ["sh", "-c", "g++ main.cpp -o main 2>&1 && timeout 5 ./main 2>&1"]