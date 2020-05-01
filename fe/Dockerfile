FROM node:13.13.0-alpine3.10 as Build

WORKDIR /home/node/frontend
USER node

# Build frontend 
#RUN mkdir frontend
COPY --chown=node:node . ./
RUN npm --prefix app ci
RUN npm --prefix app run build

# Build nginx image
FROM nginx:1.17.6-alpine as release

COPY --from=build /home/node/frontend/app/dist/app/. /var/www

COPY ./nginx.conf.template /tmp/nginx.conf.template

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
