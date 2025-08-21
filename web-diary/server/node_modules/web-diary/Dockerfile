# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

COPY .env .env

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]
