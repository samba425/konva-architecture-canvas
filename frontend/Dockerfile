# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install for better compatibility)
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the application for production
RUN npm run build -- --configuration=production

# Stage 2: Serve the application for development
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for ng serve)
RUN npm install --legacy-peer-deps

# Copy source files for development hot-reload
COPY . .

# Expose port 4200
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4200', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application in development mode
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
