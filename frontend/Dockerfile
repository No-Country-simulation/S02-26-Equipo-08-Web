# Etapa 1: Construcción
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Generamos la versión de producción
RUN npm run build

# Etapa 2: Servidor de producción (Nginx)
FROM nginx:stable-alpine
# Copiamos los archivos compilados desde la etapa anterior a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos una configuración básica de Nginx si la tienes (opcional)
# EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]