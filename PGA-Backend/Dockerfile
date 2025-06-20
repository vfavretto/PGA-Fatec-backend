FROM node:18-slim

# Instalar dependências para compilar módulos nativos e OpenSSL
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copiar resto do código
COPY . .

RUN npm run build

# Gerar o Prisma Client APÓS o build para garantir compatibilidade
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]