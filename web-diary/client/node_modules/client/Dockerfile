# Build stage
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Inject build-time environment variable
ARG VITE_BACKEND_URL
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env

RUN npm run build --force

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
