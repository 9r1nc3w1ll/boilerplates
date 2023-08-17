FROM node:20-buster-slim as builder
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
RUN npm prune --production

FROM node:20-buster-slim
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --chown=nextjs --from=builder /app/package.json ./package.json
COPY --chown=nextjs --from=builder /app/node_modules ./node_modules
COPY --chown=nextjs --from=builder /app/.next ./.next
COPY --chown=nextjs --from=builder /app/public ./public


EXPOSE 3000

CMD ["npm", "start"]
