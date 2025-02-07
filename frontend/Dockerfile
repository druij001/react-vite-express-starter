FROM node:22.11
COPY ./frontend /frontend
RUN rm -rf /frontend/node_modules

WORKDIR /qmaps
RUN npm ci
RUN npm run dev
RUN npm run dev-node