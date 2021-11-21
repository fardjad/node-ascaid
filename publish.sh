#!/bin/bash

VERSION=$(node -e 'import("./lib/utils.js").then(utils => utils.readVersion()).then(version => process.stdout.write(version))')
DOCKER_IMAGE_NAME="fardjad/ascaid"

cp docs/README.md .
npm publish

docker build -t "${DOCKER_IMAGE_NAME}:${VERSION}" .
docker push "${DOCKER_IMAGE_NAME}:${VERSION}"

docker tag "${DOCKER_IMAGE_NAME}:${VERSION}" "${DOCKER_IMAGE_NAME}:latest"
docker push "${DOCKER_IMAGE_NAME}:latest"

docker pushrm fardjad/ascaid

rm README.md
