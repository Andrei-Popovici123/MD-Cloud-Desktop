
FROM node:22.12.0-alpine


ENV NODE_ENV production


WORKDIR /app


COPY package*.json  ./
RUN npm install
COPY src/ ./src
COPY server.js .  


RUN npm install --save-dev nodemon


EXPOSE 3000


CMD npm start
