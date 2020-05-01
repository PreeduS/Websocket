FROM node:12

WORKDIR /node
COPY . ./

RUN npm install
# build
CMD npm run build && node ./build-wp/index.js


EXPOSE 5000