#!/bin/sh

npm_config_registry=http://10.186.18.19:4873 pnpx @actiontech/cli api-gen -y "$@" && pnpm --filter @actiontech/shared api:exports:g
