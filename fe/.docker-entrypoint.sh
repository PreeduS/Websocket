#!/bin/sh
set -eu

API_HOST=${API_HOST:-localhost}
API_PORT=${API_PORT:-3000}

envsubst '${API_HOST} ${API_PORT}' < /tmp/nginx.conf.template > /etc/nginx/nginx.conf


exec "$@"