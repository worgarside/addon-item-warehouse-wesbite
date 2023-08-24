ARG BUILD_FROM
FROM $BUILD_FROM

COPY .next /app/.next
COPY .env /app/.env

COPY .eslintrc.json /app
COPY next-env.d.ts /app
COPY next.config.js /app
COPY package-lock.json /app
COPY package.json /app
COPY tsconfig.json /app

# Install requirements for add-on
RUN \
  apk add --no-cache --update nodejs npm

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install --omit=dev --verbose

CMD [ "npm", "start" ]
