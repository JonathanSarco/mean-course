FROM node:12

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Get all the code needed to run the app
COPY . /usr/src/app
COPY .env.example .env

RUN npm install

EXPOSE 3000

CMD ["npm","run","start:server"]