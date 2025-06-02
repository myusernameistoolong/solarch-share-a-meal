FROM node:current-alpine
ENV NODE_ENV=production
ENV MONGO_DB=Share-a-Meal_MealService
ENV RABBITMQ_URL=amqp://admin:Welkom123@127.0.0.1:5672
ENV RABBITMQ_EXCHANGE=amq.direct

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]