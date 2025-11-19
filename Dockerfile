FROM nginx:alpine

COPY . /usr/share/nginx/html

# Exponemos el puerto por donde se servirá el sitio
EXPOSE 80
