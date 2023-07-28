FROM node:19-slim

WORKDIR /root

ARG API_DOMAIN

RUN echo "VITE_API_DOMAIN='$API_DOMAIN'" > .env

RUN npm install pnpm -g

COPY . /root

RUN pnpm install

RUN pnpm run build