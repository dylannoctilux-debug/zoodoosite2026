FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl && npm install --global pnpm@10.15.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api/package.json api/schema.prisma api/
RUN pnpm install --frozen-lockfile
COPY api api
COPY shared shared
RUN pnpm --filter @zoodoo/api db:generate
FROM build AS operations
# Contains Prisma CLI for explicit schema/bootstrap operations; never receives public traffic.
CMD ["pnpm", "--filter", "@zoodoo/api", "setup"]
FROM build AS package
RUN pnpm --filter @zoodoo/api deploy --prod /opt/api
RUN cd /opt/api && node /app/api/node_modules/prisma/build/index.js generate --schema schema.prisma
FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl && mkdir -p /data/uploads && chown node:node /data/uploads
WORKDIR /app
COPY --from=package --chown=node:node /opt/api ./api
COPY --from=build --chown=node:node /app/shared ./shared
USER node
WORKDIR /app/api
ENV NODE_ENV=production UPLOAD_DIR=/data/uploads PORT=4000
CMD ["node", "--import", "tsx", "src/index.ts"]
