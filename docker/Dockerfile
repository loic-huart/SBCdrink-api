FROM node:20-alpine as build

WORKDIR /api
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn add sharp --ignore-engines
COPY . .
RUN yarn build

FROM node:20-alpine as dependencies

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk add mongodb-tools

FROM dependencies AS development

WORKDIR /api
ENV NODE_ENV=development
RUN yarn global add ts-node
RUN yarn global add nodemon
COPY . .
COPY --from=build /api/node_modules ./node_modules
EXPOSE 8000
CMD ["sleep", "infinity"]

FROM dependencies AS production

WORKDIR /api
ENV NODE_ENV=production
COPY --from=build /api/node_modules ./node_modules
COPY --from=build /api/build ./build
EXPOSE 8000
CMD ["node", "./build/src/index.js"]
