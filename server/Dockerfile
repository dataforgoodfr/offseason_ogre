FROM node:16.13.1-slim

# Built by deploy-node-app

WORKDIR /app

# Add common build deps
RUN apt-get update && apt-get install -yqq nginx && \
  sed -i 's/root \/var\/www\/html/root \/app\/build/' /etc/nginx/sites-enabled/default && \
  chown -R node /app /home/node /etc/nginx /var/log/nginx /var/lib/nginx /usr/share/nginx && \
  rm -rf /var/lib/apt/lists/*

USER node

COPY package.json /app/

RUN yarn install --no-cache --no-audit

COPY . /app/

COPY .env /app/

# RUN yarn run seed
CMD ["node", "index.js"]
