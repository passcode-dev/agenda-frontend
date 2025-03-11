FROM node:22

WORKDIR /app

COPY agenda-frontend/package*.json ./

RUN npm install

COPY agenda-frontend/ ./

CMD ["npm", "run", "dev"]
