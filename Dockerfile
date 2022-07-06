FROM node:16.15.1-bullseye As build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --only=production && npm cache clean --force

FROM node:16.15.1-bullseye As production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]