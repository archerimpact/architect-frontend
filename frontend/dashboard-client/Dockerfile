FROM node:8.2.1

RUN mkdir -p /src/code

WORKDIR /src/code

ADD package.json /src/code
ADD yarn.lock /code
RUN npm install 

COPY ./src/app

RUN npm run build

ADD . /code/
