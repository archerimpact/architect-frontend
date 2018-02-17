FROM node:8.2.1

RUN mkdir /code
WORKDIR /code

ADD package.json /code
RUN yarn install

ADD . /code/
