# Deployment

## Docker

The Dockerfile builds **only the v2 frontend** (React, TanStack Router, Radix UI) using **Node 22 LTS**. The previous Dockerfile that built the legacy app is backed up as `Dockerfile.backup`.

### Build

From the project root:

```bash
docker build -t sports2-frontend .
```

### Build arguments

| Argument          | Default | Description                      |
|-------------------|---------|----------------------------------|
| `VITE_API_URL`    | `/api`  | Base URL for API requests       |
| `VITE_BASE_PATH`  | (empty) | Base path for SPA (served at `/`) |

Example with custom API URL:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com/v1 -t sports2-frontend .
```

Example for subpath deployment at `/app`:

```bash
docker build --build-arg VITE_BASE_PATH=/app -t sports2-frontend .
```

> **Note:** For subpath deployment, the v2 Vite config must set `base: '/app/'` so asset paths match.

### Run

```bash
docker run -p 3000:3000 sports2-frontend
```

The app listens on port 3000. nginx handles SPA routing and proxies `/uploads/` to the backend.
