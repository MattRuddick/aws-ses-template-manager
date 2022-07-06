FROM node:14.19.3-slim

LABEL maintainer="Hossam Hammady <github@hammady.net>"

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3333
ENV HOST=0.0.0.0

CMD [ "npm", "start" ]
