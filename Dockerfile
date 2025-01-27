FROM --platform=linux/amd64 node:20-alpine
LABEL org.opencontainers.image.source https://github.com/spielhoelle/goldangai
RUN npm install -g pnpm
# RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# RUN npx prisma generate

ARG REPLICATE_API_TOKEN
ENV REPLICATE_API_TOKEN ${REPLICATE_API_TOKEN}

ARG PINATA_GROUP
ENV PINATA_GROUP ${PINATA_GROUP}

ARG PINATA_KEY_ID
ENV PINATA_KEY_ID ${PINATA_KEY_ID}

ARG PINATA_SECRET_KEY
ENV PINATA_SECRET_KEY ${PINATA_SECRET_KEY}

RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "run", "start"]
