FROM nginx:alpine
COPY index.html manifest.json sw.js /usr/share/nginx/html/
EXPOSE 80
