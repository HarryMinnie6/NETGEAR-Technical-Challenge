
# NETGEAR Challenge

The objective is to build a minimal yet production-ready API for a book management application.

### Key Features
1. __CRUD Operations__: Implement basic CRUD operations for a Book model with fields such as id, title, author, published_date, and genre.
2. __Database__: Use MySQL or any SQL database of your choice to store book records.
3. __ErrorHandling&Validation__:Ensure robust error handling and input validation. Use appropriate HTTP status codes for various outcomes.
4. __Logging__:Introduce logging to capture key API events and errors. Think about what logs would be useful for debugging and monitoring.



## Setup the project

#### Prerequisites:

Download postgresql [here](https://www.postgresql.org/download/)

Download docker [here](https://www.docker.com/pricing/) (```On mac brew install docker```)


In the root of the project folder run:
```
yarn install
```

#### Setting up postgresql:
Setting up postgresql locally (default setup for now is ok)

Login to postgresql via the terminal
```
psql -U postgres -d postgres
```
After successful login create a database by running ```CREATE DATABASE book-catalogue```.

After creating the database run the scripts in ```init.sql``` to create the necessary tables.

Set your .env variables:
```
JWT_SECRET=""
PORT=3000
NODE_ENV=development
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book-catalogue

```



## Run the project


Step 2:
In the root of the project run the following command in your terminal:
```
yarn start
```
This will start up the project.


## Running the project in a docker container

Step 1: Ensure the docker app is open locally.

Step 2: In a new terminal _(at the root of the project)_ run ```docker login```.

Step 3: After successful login run ```docker-compose up --build```.

To stop and remove containers run ```docker-compose down -v```._(Note: this will remove all databases and stored information in postgres)_

Docker testing url example: ```http://localhost:13000/api/v1/all-books```


## Running Tests

To run tests, run the following command:

```
  yarn test
```

