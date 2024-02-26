#!/bin/bash
set -e

# Mingw/msys2 fix, https://github.com/docker/cli/issues/2204
export MSYS_NO_PATHCONV=1

docker run -it --rm -v $(pwd):/app -w /app -p 443:443 -p 3000:3000 node:21-alpine $@
