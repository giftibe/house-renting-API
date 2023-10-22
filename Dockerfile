FROM node:17-alpine

WORKDIR /app


COPY ./package.json ./package-lock.json ./index.js ./.env ./


RUN npm install


RUN mkdir ./src


COPY ./src ./src


EXPOSE 4000


CMD [ "node", "-r", "dotenv/config", "./index.js" ]