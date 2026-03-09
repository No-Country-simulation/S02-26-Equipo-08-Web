# Usamos una versión ligera de Node.js
FROM node:20-slim

# Instalamos OpenSSL porque Prisma lo necesita para correr en Linux/Ubuntu
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# GENERAMOS EL CLIENTE DE PRISMA (Paso crítico para que reconozca la DB)
RUN npx prisma generate

# Exponemos el puerto interno (el que definiste en el .env)
EXPOSE 3000

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "dev"]