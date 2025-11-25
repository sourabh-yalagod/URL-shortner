FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .


FROM node:18-slim AS production

WORKDIR /app

COPY --from=build /app ./

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD [ "npm" , "start" ]