#syntax=docker/dockerfile:1.5


FROM node:22-alpine AS builder

WORKDIR /repo
RUN apk add --no-cache libc6-compat
COPY . .
RUN npm ci
RUN npm run build
RUN --mount=type=secret,id=env \
    export $(cat /run/secrets/env | xargs) && \
    npm run db:push




FROM node:22-alpine AS runner 
WORKDIR /repo
RUN apk add --no-cache libc6-compat
RUN npm i -g concurrently

COPY --from=builder /repo/apps/api/dist ./apps/api/dist
COPY --from=builder /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /repo/apps/api/package.json ./apps/api/package.json
COPY --from=builder /repo/apps/web/.next ./apps/web/.next
COPY --from=builder /repo/apps/web/public ./apps/web/public
COPY --from=builder /repo/apps/web/package.json ./apps/web/package.json


COPY --from=builder /repo/packages/database/dist ./packages/database/dist
COPY --from=builder /repo/packages/database/package.json ./packages/database/package.json
COPY --from=builder /repo/packages/database/node_modules ./packages/database/node_modules

COPY --from=builder /repo/packages/mailer/dist ./packages/mailer/dist
COPY --from=builder /repo/packages/mailer/node_modules ./packages/mailer/node_modules

COPY --from=builder /repo/packages/shared/dist ./packages/shared/dist
COPY --from=builder /repo/packages/shared/node_modules ./packages/shared/node_modules

COPY --from=builder /repo/package*.json ./
COPY --from=builder /repo/turbo.json ./
COPY --from=builder /repo/node_modules ./node_modules



RUN npm prune --omit=dev

EXPOSE 3330
EXPOSE 8000 

CMD ["concurrently", \
  "node apps/api/dist/bundle.js", \
  "npm --prefix apps/web run start -- --port 3330" \
]
