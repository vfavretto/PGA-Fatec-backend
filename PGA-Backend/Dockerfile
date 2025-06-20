FROM node:slim

# Instalar dependências para compilar módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

# Copiar resto do código
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]