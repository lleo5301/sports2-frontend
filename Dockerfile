# Build v2 frontend only (Node 22 LTS)
FROM node:22-alpine AS builder

ARG VITE_API_URL=/api
ARG VITE_BASE_PATH=

WORKDIR /app

# Copy v2 package files
COPY v2/package.json v2/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy v2 source
COPY v2/ .

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH

# Build v2
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
