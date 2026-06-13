FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

# Cria a pasta /data e dá permissão ao usuário node
RUN mkdir -p /data && chown -R node:node /data

EXPOSE 3000

USER node

CMD ["node", "src/server.js"]