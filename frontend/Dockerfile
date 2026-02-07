FROM node:18

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm i baseline-browser-mapping@latest -D

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--host", "lan", "--port", "8081"]