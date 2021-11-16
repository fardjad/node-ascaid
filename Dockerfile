FROM node:16.13 as builder

ENV NODE_ENV production

WORKDIR /opt/node-ascaid

COPY ./package*.json ./
RUN npm install

FROM node:16.13 as app

ENV NODE_ENV production

WORKDIR /opt/node-ascaid

RUN apt-get update && apt-get install -y \
    pandoc \
 && rm -rf /var/lib/apt/lists/*

COPY . ./
RUN rm -rf jest.config.mjs lib/*.test.js lib/__fixtures__
RUN chmod a+x cli/ascaid
COPY --from=builder /opt/node-ascaid/node_modules ./node_modules/

ENTRYPOINT ["cli/ascaid"]
