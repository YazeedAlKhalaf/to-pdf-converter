# Use Node.js as base image
FROM node:20-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    wkhtmltopdf \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]