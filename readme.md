#Docker images
Create an .env in the root folder file with 
MONGO_ROOT_USER
MONGO_ROOT_PASSWORD
//name for db
MONGO_DATABASE

docker compose build

docker-compose up -d

docker-compose watch

docker-compose down // to close



Vite issue has been fixed

Next optimisation of dockerfiles
docker image for mongo
endpoint to db and migrations