FROM node:12.4.0-alpine AS builder

COPY package.json /build/package.json
COPY yarn.lock /build/yarn.lock

RUN cd /build \
  && yarn install

COPY . /build

RUN cd /build \
  && yarn build

WORKDIR /app
# End builder stage

FROM node:12.4.0-alpine

ENV MONGODB_TOOLS_VERSION 4.0.5-r0

COPY package.json /dep/package.json
COPY yarn.lock /dep/yarn.lock

RUN apk add --no-cache ca-certificates tzdata mongodb-tools=${MONGODB_TOOLS_VERSION} findutils tar

RUN cd /dep \
  && yarn install --production
COPY --from=builder /build/dist ./dep/dist
COPY --from=builder /build/scripts ./dep/scripts

WORKDIR /dep
EXPOSE 3000
CMD ["yarn", "start"]
# End install-dep-prod stage
