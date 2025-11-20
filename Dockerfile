# Etapa 1: Build de React
FROM node:18 AS build
WORKDIR /app
COPY flyblue/package.json ./
COPY flyblue/package-lock.json ./
COPY flyblue/ ./
RUN npm install
RUN npm run build

# Etapa 2: Nginx sirve los archivos producidos
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
