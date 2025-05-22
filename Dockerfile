# Installs Node.js image
FROM node:20.15.0-alpine

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/api_service

# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "nodemon.json", "./"]

# Copies everything in the src directory to WORKDIR/src
COPY ./src ./src
COPY ./prisma ./prisma

# Installs all packages
RUN npm install

# Runs the dev npm script to build & start the server
CMD ["prisma", "generate"]

ENTRYPOINT ["npm", "run", "start-prod"]