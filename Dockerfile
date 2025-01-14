# syntax=docker/dockerfile:1

FROM node:22.13.0-alpine@sha256:f2dc6eea95f787e25f173ba9904c9d0647ab2506178c7b5b7c5a3d02bc4af145 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
ARG ASSET_PREFIX
ENV ASSET_PREFIX=$ASSET_PREFIX
ARG SENTRY_ORG
ENV SENTRY_ORG=$SENTRY_ORG
ARG SENTRY_PROJECT
ENV SENTRY_PROJECT=$SENTRY_PROJECT
ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=$SENTRY_RELEASE
ARG ENV=development
ENV SENTRY_ENVIRONMENT=$ENV
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY packages package.json pnpm-lock.yaml .npmrc ./
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /pnpm/store to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
RUN apk add --no-cache ca-certificates aws-cli
COPY --from=deps /app/node_modules ./node_modules
RUN corepack enable pnpm
COPY . .

ARG SENTRY_AUTH_TOKEN
RUN if [ -n "$SENTRY_AUTH_TOKEN" ]; then \
      echo "SENTRY_AUTH_TOKEN is provided, setting environment variable"; \
      export SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN"; \
    else \
      echo "SENTRY_AUTH_TOKEN is not provided, skipping environment variable"; \
    fi
RUN pnpm run build

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ARG AWS_S3_BUCKET
ARG AWS_S3_PATH
ARG AWS_ENDPOINT_URL
ENV AWS_ENDPOINT_URL=$AWS_ENDPOINT_URL
ARG AWS_DEFAULT_REGION
ENV AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION

RUN aws s3 cp --recursive .next/static s3://${AWS_S3_BUCKET}/${AWS_S3_PATH}/_next/static

FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# https://nodejs.org/api/cli.html#cli_max_old_space_size_size_in_megabytes
CMD ["node", "--max-old-space-size=1536", "server.js"]
