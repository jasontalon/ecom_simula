FROM node:12-alpine

WORKDIR /web

COPY . /web

RUN npm install && npm run build

CMD ["npm", "run", "start"]
