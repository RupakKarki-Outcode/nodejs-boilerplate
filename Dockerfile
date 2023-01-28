# Base image
FROM node:16-alpine

# nest cli is installed globally
RUN npm i -g @nestjs/cli typescript ts-node

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies -- excluding dev dependencies -- immutable is same as --frozen-lockfile
RUN yarn install --immutable --immutable-cache --check-cache

# Bundle app source
COPY . .

# Start the server using the production build
CMD [ "yarn", "start:dev" ]