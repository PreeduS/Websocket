#!/bin/sh
set -eu

export API_HOST=${API_HOST:-http://localhost}
export API_PORT=${API_PORT:-3000}
export PORT=${PORT:-80}

envsubst '${PORT} ${API_HOST} ${API_PORT}' < /tmp/nginx.conf.template > /etc/nginx/nginx.conf


exec "$@"
