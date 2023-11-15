FROM node:18.17.0-bullseye-slim AS builder
ENV NODE_ENV production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

COPY . .
RUN yarn build

FROM node:18.17.0-bullseye-slim AS release
ENV NODE_ENV production
USER node
WORKDIR /app

COPY package*.json ./
COPY .env .env
COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules

CMD ["node", "./build/src/app.js"]
