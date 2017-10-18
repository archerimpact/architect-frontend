FROM node:8.2.1

RUN mkdir /node
WORKDIR /node

ADD package.json /node
ADD yarn.lock /node
RUN yarn install >/dev/null 2>/dev/null

RUN yarn global add nodemon

ADD . /node/