FROM node:slim

# Instalar dependências para compilar módulos nativos e OpenSSL
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar resto do código
COPY . .

# Build da aplicação
RUN npm run build

EXPOSE 3000

# Executar migrações e iniciar aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]