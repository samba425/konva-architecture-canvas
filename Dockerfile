# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy project files
COPY . .

# Build the application for production
RUN npm run build --configuration=production

# Stage 2: Serve the application
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --silent

# Install Angular CLI globally
RUN npm install -g @angular/cli@21.0.0

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/angular.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.app.json ./

# Expose port 4200
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4200', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
