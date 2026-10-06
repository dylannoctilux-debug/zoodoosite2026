#!/bin/sh
set -eu
# Mongo requires a private keyfile. Its only materialized copy is in volatile shared memory.
cp /run/secrets/mongo_repl_key /dev/shm/mongo-repl-key
chmod 400 /dev/shm/mongo-repl-key
chown mongodb:mongodb /dev/shm/mongo-repl-key
exec /usr/local/bin/docker-entrypoint.sh mongod --replSet rs0 --bind_ip_all --keyFile /dev/shm/mongo-repl-key
