FROM node:18-alpine as build

WORKDIR /api

COPY ["package.json", "yarn.lock", "./"]
COPY . .

EXPOSE 8000

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk add mongodb-tools
RUN yarn add global typescript

FROM build AS development

ENV NODE_ENV=development

RUN yarn install
RUN yarn add sharp --ignore-engines
RUN yarn global add ts-node

CMD ["sleep", "infinity"]

FROM build AS production

RUN yarn install
RUN yarn add sharp --ignore-engines

ENV NODE_ENV=production

RUN yarn build

CMD ["node", "./build/src/index.js"]
