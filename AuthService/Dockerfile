# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json .
RUN npm install
#RUN mkdir -p ./src
COPY . .
CMD ["npm", "start"]
