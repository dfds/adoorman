FROM node:alpine

WORKDIR /app

COPY src/package.json .
COPY src/package-lock.json .

RUN npm install --production

COPY src/index.js .

ENTRYPOINT ["npm", "start"]