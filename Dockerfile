# Etapa 1: build de la app React
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: Nginx sirve los archivos generados
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
