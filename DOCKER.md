# Docker Setup Guide

This guide explains how to run the NiceDentist Frontend using Docker.

## 📋 Prerequisites

- Docker installed
- Docker Compose installed (usually comes with Docker Desktop)

## 🏗️ Docker Files Overview

- **`Dockerfile`** - Multi-stage production build with Nginx
- **`Dockerfile.dev`** - Development build with hot reloading
- **`docker-compose.yml`** - Orchestration for both production and development
- **`nginx.conf`** - Custom Nginx configuration
- **`.dockerignore`** - Files to exclude from Docker build

## 🚀 Quick Start

### Production Mode
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t nicedentist-frontend .
docker run -p 3000:80 nicedentist-frontend
```

### Development Mode
```bash
# Build and run development environment
docker-compose --profile dev up -d

# Or build and run manually
docker build -f Dockerfile.dev -t nicedentist-frontend-dev .
docker run -p 3001:3000 -v "$(pwd):/app" -v /app/node_modules nicedentist-frontend-dev
```

## 📜 Available npm Scripts

```bash
# Docker build commands
npm run docker:build      # Build production image
npm run docker:build-dev  # Build development image

# Docker run commands
npm run docker:run        # Run production container
npm run docker:run-dev    # Run development container

# Docker Compose commands
npm run docker:up         # Start production services
npm run docker:up-dev     # Start development services
npm run docker:down       # Stop all services
```

## 🔧 Configuration

### Environment Variables
The Docker setup uses the following environment variables:

#### Production
- `NODE_ENV=production`

#### Development
- `NODE_ENV=development`
- `VITE_AUTH_API_URL=http://localhost:5000`
- `VITE_MANAGER_API_URL=http://localhost:5001`

### Ports
- **Production**: Port 3000 (nginx serving static files)
- **Development**: Port 3001 (Vite dev server with HMR)

## 🏥 Health Checks

The production container includes a health check endpoint:
- **URL**: `http://localhost:3000/health`
- **Response**: `healthy`

## 🌐 Networks

The Docker Compose setup uses an external network called `nicedentist-network` to communicate with backend services.

### Create the network (required):
```bash
docker network create nicedentist-network
```

### Alternative: Standalone Mode
If you prefer not to use external networks, use the standalone compose file:
```bash
# Production standalone
docker-compose -f docker-compose.standalone.yml up -d

# Development standalone  
docker-compose -f docker-compose.standalone.yml --profile dev up -d

# Using npm scripts
npm run docker:up-standalone
npm run docker:up-standalone-dev
```

## 📊 Container Details

### Production Container
- **Base Image**: `nginx:alpine`
- **Size**: ~50MB (optimized)
- **Features**: 
  - Gzip compression
  - Security headers
  - Client-side routing support
  - Static asset caching

### Development Container
- **Base Image**: `node:18-alpine`
- **Features**:
  - Hot module reloading
  - Volume mounting for live code changes
  - Vite dev server

## 🛠️ Troubleshooting

### Common Issues

1. **Network not found error**
   ```bash
   # Error: network nicedentist-network declared as external, but could not be found
   
   # Solution: Create the network
   docker network create nicedentist-network
   
   # Or use standalone mode
   docker-compose -f docker-compose.standalone.yml up -d
   ```

2. **Port already in use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Use different port
   docker run -p 3002:80 nicedentist-frontend
   ```

3. **Permission issues on Windows**
   ```bash
   # Make sure Docker Desktop is running as administrator
   # Or use PowerShell as administrator
   ```

### Logs
```bash
# View container logs
docker logs nicedentist-frontend

# Follow logs in real-time
docker logs -f nicedentist-frontend

# Docker Compose logs
docker-compose logs -f frontend
```

## 📦 Multi-Stage Build Benefits

The production Dockerfile uses multi-stage builds:

1. **Builder stage**: Compiles TypeScript and builds the application
2. **Production stage**: Serves static files with Nginx

Benefits:
- Smaller final image (~50MB vs ~500MB)
- No dev dependencies in production
- Better security (no Node.js in production)
- Optimized for performance

## 🔐 Security Features

- Security headers (XSS protection, content type options, etc.)
- No sensitive data in final image
- Non-root user in containers
- Health checks for monitoring

## 🚀 Production Deployment

For production deployment, consider:

1. **Environment-specific configurations**
2. **SSL/TLS termination**
3. **Load balancing**
4. **Monitoring and logging**
5. **Auto-scaling**

Example production deployment with SSL:
```bash
# With custom environment
docker run -p 443:80 \
  -e NODE_ENV=production \
  -v /path/to/ssl:/ssl \
  nicedentist-frontend
```
