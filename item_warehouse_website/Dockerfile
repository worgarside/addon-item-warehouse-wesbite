ARG BUILD_FROM
FROM $BUILD_FROM

COPY . /app

RUN apk add --no-cache --update nodejs npm

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm ci --ignore-scripts

COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]

