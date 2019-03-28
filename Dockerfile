FROM node:alpine

WORKDIR /app

COPY src/package*.json .

RUN npm install --production

COPY src/index.js .

ENTRYPOINT ["npm", "start"]