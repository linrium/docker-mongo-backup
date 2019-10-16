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

COPY package.json /dep/package.json
COPY yarn.lock /dep/yarn.lock

RUN cd /dep \
  && yarn install --production
COPY --from=builder /build/dist ./dep/dist

WORKDIR /dep
EXPOSE 3000
CMD ["yarn", "start"]
# End install-dep-prod stage
