FROM node:18.16.0-alpine3.16
LABEL version="1.0.0"

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

RUN yarn prisma generate

EXPOSE 3000

ENTRYPOINT [ "yarn", "dev" ]