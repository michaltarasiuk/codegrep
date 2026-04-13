FROM oven/bun:1.3.9-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json bun.lock ./
COPY tsconfig.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies (ignore prepare script which requires git for lefthook)
RUN bun install --frozen-lockfile --ignore-scripts

COPY apps/api ./apps/api

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
