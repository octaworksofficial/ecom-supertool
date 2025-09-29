# Railway Dockerfile - Subdirectory Support
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat openssl sqlite

# Copy package files from javascript-version subdirectory
COPY materio-mui-nextjs-admin-template-free/javascript-version/package*.json ./
COPY materio-mui-nextjs-admin-template-free/javascript-version/prisma ./prisma/

# Install dependencies
RUN npm ci --omit=dev --prefer-offline

# Copy source code from subdirectory
COPY materio-mui-nextjs-admin-template-free/javascript-version .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start command
CMD ["npm", "start"]