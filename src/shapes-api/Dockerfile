# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:24.18.0-bookworm-slim
FROM ${NODE_IMAGE}

ARG SERVICE_DIRECTORY

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node ${SERVICE_DIRECTORY}/package.json ${SERVICE_DIRECTORY}/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --chown=node:node ${SERVICE_DIRECTORY}/ ./

USER node

EXPOSE 50051

CMD ["npm", "start"]
