# build
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# production
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# SOLO reemplaza server config (NO nginx.conf completo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
