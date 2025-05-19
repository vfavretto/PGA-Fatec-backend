FROM node:23-bullseye

# Instalar dependências para compilar módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências para build
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar resto do código
COPY . .

# Construir aplicação
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]