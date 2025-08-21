#!/bin/bash
set -e

# Start MongoDB in background, binding to all interfaces (internal container)
# Use /data/db as the data directory
mongod --dbpath /data/db --bind_ip 0.0.0.0 --fork --logpath /var/log/mongodb.log

# Simple wait loop to ensure Mongo is accepting connections
until mongo --eval "print('ready')" &>/dev/null; do
  echo "Waiting for mongod to be ready..."
  sleep 1
done

# Now start the Node.js backend (assumes `npm start` uses .env for config)
exec npm start
