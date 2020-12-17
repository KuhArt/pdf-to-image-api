FROM node:12

EXPOSE 80
RUN apt-get update -qq && apt-get install -y \
  poppler-data \
  poppler-utils
  
COPY ["./package.json", "./package-lock.json", ".eslintrc.js", ".eslintignore", "/app/"]
WORKDIR /app
RUN npm ci --quiet
COPY ./src /app/src

CMD npm start