FROM node:lts-bullseye-slim
RUN npm install -g nowapi@latest
ENTRYPOINT ["/usr/local/bin/nowapi"]
