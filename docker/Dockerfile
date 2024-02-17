FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /api

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --production
RUN npm install -g ts-node

COPY . .

EXPOSE 3000

CMD ["ts-node", "./src/index.ts"]
