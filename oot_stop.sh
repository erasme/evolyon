#!/bin/bash

echo "Stopping outside box..."
PORT=3010
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
parentdir="$(dirname "$CURRENT_DIR")"

echo $parentdir
echo $CURRENT_DIR

forever stop $PORT -a ootsidebox-client/ootside.js -p $parentdir/run
