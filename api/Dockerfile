FROM node:12-alpine

WORKDIR /api

COPY . /api

RUN npm install --production

CMD ["npm", "run", "migrate-and-start"]
