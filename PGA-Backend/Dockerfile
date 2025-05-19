FROM node:23-bullseye

# Otimizações de memória para Node.js
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Instalar dependências para compilar módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar apenas arquivos necessários primeiro
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production \
    && npm cache clean --force

# Gerar Prisma Client
RUN npx prisma generate

# Copiar resto do código
COPY . .

# Construir aplicação
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]