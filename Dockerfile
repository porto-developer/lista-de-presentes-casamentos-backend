FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["sh", "-c", "npx typeorm migration:run -d dist/config/datasource.js && node dist/main"]
