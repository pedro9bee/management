# Use uma imagem Node.js oficial
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração do NX
COPY nx.json ./
COPY package*.json ./
COPY tsconfig*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código do projeto
COPY . .

# Instale as dependências do NX e do projeto
RUN npm run nx -- install

# Compile o código
RUN npm run nx -- build users-api

# Exponha a porta que a aplicação vai usar
EXPOSE 3333

# Comando para iniciar o serviço
CMD ["npx", "nx", "serve", "users-api"]
