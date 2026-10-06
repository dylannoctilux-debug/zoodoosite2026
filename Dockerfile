FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl && npm install --global pnpm@10.15.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/api/package.json services/api/schema.prisma services/api/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
