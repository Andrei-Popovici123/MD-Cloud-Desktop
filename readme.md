#Docker images
Create an .env in the root folder file with 
MONGO_ROOT_USER
MONGO_ROOT_PASSWORD
//name for db
MONGO_DATABASE

docker compose build

docker-compose up -d

docker-compose down // to close

!! IMPORTANT: image for frontend currently not working due to vite not beeing exposed to docker.
to be fixed 
