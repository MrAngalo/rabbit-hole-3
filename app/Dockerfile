FROM node:18-alpine3.16 as angular

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 4200 49153

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]