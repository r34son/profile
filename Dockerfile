FROM node:20.12.2-slim@sha256:b797c658cbbd75ea6ebeceed7f5c01e1d4054d2f53b32906090d1648eaccf860 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
ARG ENV
ENV ENV=$ENV
ENV NEXT_PUBLIC_ENV=$ENV
ARG ASSET_PREFIX
ENV ASSET_PREFIX=$ASSET_PREFIX
RUN apt-get update && apt-get install -y \
    ca-certificates  \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable
COPY . /app
WORKDIR /app


FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG SENTRY_AUTH_TOKEN
RUN if [ -n "$SENTRY_AUTH_TOKEN" ]; then \
      echo "SENTRY_AUTH_TOKEN is provided, setting environment variable"; \
      export SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN"; \
    else \
      echo "SENTRY_AUTH_TOKEN is not provided, skipping environment variable"; \
    fi
RUN pnpm run build

FROM base
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=prod-deps /app/node_modules /app/node_modules
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js