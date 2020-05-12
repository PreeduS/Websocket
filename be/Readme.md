
## .env

GMAIL_ADDRESS=
GMAIL_OAUTH_CLIENT_ID=
GMAIL_OAUTH_CLIENT_SECRET=
MONGO_USER=
MONGO_PASSWORD=
MONGO_DB=
MONGO_HOST=




# test connection inside container

mongo --host localhost --port 27017 \
-u $MONGO_INITDB_ROOT_USERNAME \
-p $MONGO_INITDB_ROOT_PASSWORD \
--authenticationDatabase admin


---
db = db.getSiblingDB('app')
db.createCollection("init")