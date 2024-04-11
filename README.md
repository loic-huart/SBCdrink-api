# SBCdrink-api

## Prerequisites

- docker

## Initial Setup

1. Clone the repository
2. Copy the `.env.example` file to `.env` and to `docker/.env` update the values if needed (you can keep the default values for development)

## Start the project

This project is using Docker to run the application. You can start the project using two different methods.

both methods will start the project on `http://localhost:8000`

the container will also start a mongodb instance on `http://localhost:27017` and a mongo-express instance on `http://localhost:8081`

### Solution 1: Using Devcontainer (Recommended)

1. Install [Docker](https://www.docker.com/products/docker-desktop)
2. Install [VSCode](https://code.visualstudio.com/)
3. Install [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
4. Open the project in VSCode
5. Click on the green button in the bottom left corner and select "Reopen in Container"

### Solution 2: Using Docker Compose

To simply start the project, you can use Makefile to start the project.

to list all available commands, run:

```bash
make help

help       Display this help
 --- Docker 🐳 --- 
up         Start the containers
down       Stop the containers
build      Build the containers
clean      Remove all containers, images and volumes
 --- Projet 🐸 --- 
init       Init the project (npm install)
shell      Open a shell in the container
test       Run tests
```

## Api Documentation (facultative)

This project is using usebruno to have a ui for the api documentation.

To access the documentation, you can install the [Bruno client](`https://github.com/usebruno/bruno`) and open `sbcdrink-bruno` folder in the client.

# Usage

## seeder

If you using Devcontainer, you can run the seeder by running the following command in the terminal: 
```bash
npm run seed
```

If you are using Docker Compose, you can run the seeder by running the following command in the terminal: 
```bash
make seed
```

you can update the seeder data in `src/seeder/data` folder
these are json files resulting from an export of the database from mongo express


