FROM node:20.18.0-alpine3.20@sha256:d504f23acdda979406cf3bdbff0dff7933e5c4ec183dda404ed24286c6125e60

USER root

# Update packages as a result of Trivy security vulnerability checks
RUN apk update && \
    apk add --upgrade gnutls binutils nodejs npm apk-tools libjpeg-turbo libcurl libx11 libxml2


# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

USER 999

WORKDIR /app
