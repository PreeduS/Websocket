FROM node:12

USER node

RUN mkdir -p /home/node/backend
WORKDIR /home/node/backend


COPY . ./
# COPY --chown=node:node . ./

RUN npm install
# build
CMD npm run build && node ./build-wp/index.js



EXPOSE 5000