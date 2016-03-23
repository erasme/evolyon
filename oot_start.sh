#!/bin/bash

echo "Launching outside box..."
PORT=3010
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
parentdir="$(dirname "$CURRENT_DIR")"

echo $parentdir
echo $CURRENT_DIR

export PORT=$PORT && forever start -o $parentdir/log/out.log -e $parentdir/log/error.log -a ootsidebox-client/ootside.js -p $parentdir/run
