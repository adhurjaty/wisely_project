FROM node:12 AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn add react-scripts && yarn run build

FROM node:12
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/app.js .
RUN yarn add express http-proxy
EXPOSE 443
ENTRYPOINT [ "node" ]
CMD ["app.js"]
