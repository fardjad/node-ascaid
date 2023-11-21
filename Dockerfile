FROM node:lts as builder

ENV NODE_ENV production

WORKDIR /opt/node-ascaid

COPY ./package*.json ./.npmrc ./
RUN npm install --ignore-scripts

FROM node:lts as app

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
