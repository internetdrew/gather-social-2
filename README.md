# Deploy React, Express, and tRPC on Vercel

<div align="center">
  <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXVvZXFidzJtbzRoZ291MGRzZHFpdHM2MzQ1aXR4NmdiYmtkcDdpMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2UndXEgN5iBwc/giphy.gif" width="100%" alt="animated cassette spinning in radio">
</div>
<br/>

Use this starter pack to create an SPA quickly and deploy to Vercel. If you want something fun, light, and fast with a type-safe API, you've arrived.

## Table of Contents

- [What's Here?](#whats-here)
- [What's in the Stack?](#whats-in-the-stack)
- [Get Started](#get-started)
- [Usage and Structure](#usage-and-structure)
  - [Development](#development)
  - [Deployment](#deployment)
  - [Notes on Middleware](#notes-on-middleware)

## What's in the Stack?

- [Vite-based React](https://vite.dev/guide/) with...
  - [TypeScript](https://www.typescriptlang.org/) and
  - [SWC](https://swc.rs/)
- [tRPC](https://trpc.io/)
- [Express](https://expressjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Zod](https://zod.dev/)

## Get Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/internetdrew/lyte-stack.git
   cd lytestack
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development servers**

   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the client (Vite) and server (Express) in development mode.

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage and Structure

### Development

The development environment uses Vite's dev server with a proxy configuration to seamlessly connect the frontend and backend:

1. **Vite Dev Server**:
   - Runs on `http://localhost:5173`
   - Handles hot module replacement (HMR) for React components
   - Serves static assets and handles client-side routing

2. **Express Server**:
   - Runs on `http://localhost:3000`
   - Handles tRPC API requests
   - Manages server-side logic and database connections

3. **Proxy Configuration**:
   The connection between Vite and Express is handled through Vite's proxy configuration in `vite.config.ts`:
   ```typescript
   {
     proxy: {
       '/trpc': {
         target: 'http://localhost:3000',
         changeOrigin: true,
       }
     }
   }
   ```
   This configuration:
   - Forwards all `/trpc/*` requests to the Express server
   - Enables seamless API calls during development (nodemon watches server files)
   - Maintains type safety through tRPC

### Deployment

- The key difference between making this work locally and making it work in deployment is the `vercel.json` file in the root directory. This configuration file tells Vercel how to build and serve your application:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "rewrites": [
    { "source": "/trpc/:path*", "destination": "/server/index.ts" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Here's what each part does:

1. **Builds Configuration**:
   - First build: Uses `@vercel/node` to build the Express server from `server/index.ts`
   - Second build: Uses `@vercel/static-build` to build the client-side React application, outputting to the `dist` directory

2. **Rewrites Configuration**:
   - `/trpc/:path*`: Routes all tRPC API requests to the server
   - `/(.*)`: Routes all other requests to `index.html` for client-side routing

### Notes on Middleware

The Express server uses the following middleware in this order:

1. [**compression**](https://expressjs.com/en/resources/middleware/compression.html): Compresses HTTP responses to reduce bandwidth and improve load times
2. [**helmet**](https://helmetjs.github.io/): Sets security headers to protect against common web vulnerabilities
3. [**cors**](https://expressjs.com/en/resources/middleware/cors.html): Handles cross-origin requests with credentials enabled
4. [**express.json**](https://expressjs.com/en/api.html#express.json): Parses incoming JSON request bodies

I choose these as general best-practices for providing security, performance, and proper request handling. I encourage you to [take a look at Express's middlware resources to find others that may suit your app needs](https://expressjs.com/en/resources/middleware.html).

## Listen to Webhook in Development

```bash
stripe listen --forward-to localhost:3000/webhook
```
