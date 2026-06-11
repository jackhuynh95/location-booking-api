FROM node:22-alpine AS admin-deps
WORKDIR /workspace/apps/admin
COPY apps/admin/package*.json ./
RUN npm ci

FROM admin-deps AS admin-build
COPY apps/admin ./
RUN npm run build

FROM node:22-alpine AS server-deps
WORKDIR /workspace/apps/server
COPY apps/server/package*.json ./
RUN npm ci

FROM server-deps AS server-build
COPY apps/server ./
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY apps/server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=server-build /workspace/apps/server/dist ./dist
COPY --from=admin-build /workspace/apps/admin/dist ./public/admin
EXPOSE 3000
CMD ["node", "dist/main.js"]
