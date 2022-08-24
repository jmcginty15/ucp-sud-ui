FROM node:16.14-alpine
WORKDIR /usr/server/app

ARG NPM_TOKEN

ENV NODE_ENV production
ENV API_BASE_URL ${API_BASE_URL}
ENV SESSION_SECRET ${SESSION_SECRET}

COPY . .
RUN NODE_ENV=development npm install
RUN npm run tsc
RUN npm run build

CMD ["npm", "run", "start"]
