# E-Commerce Exercise

## About
A very simple app that simulates e-commerce basic behaviors such as:
1. Creating/Managing sellers
2. Creating/Managing products
3. Adding products into cart w/ checkout behavior
4. Sales reports

### Components
There are 3 components for building the app:
1. Database - Using Postgres and knex as SQL query builder.
2. API (Backend) - Using NodeJS and Express as the web application Framework.
3. Web (Frontend) - Using Nuxt (Vue) with Bootstrap as the UI Framework.

### DB Migration
Database migrations is handled and defined in the API which will run upon starting the service.

### Deployment
You may seamlessly deploy the whole app using docker-compose cli. [See below for the installation instructions.](#Installation)

## See it in action
http://moscord-env.eba-m5685j4z.ap-southeast-1.elasticbeanstalk.com/

Deployed the app using AWS Elastic Beanstalk for both web and api services which running under Docker w/ each designated (multi) containers.

## Running in your local environment
### Requirements
- **Docker**
- **Docker-Compose**

*Note:* The app's Docker compose configuration will use the following ports:
- **5000** - pgadmin
- **5432** - postgres
- **5434** - api
- **5435** - web

If your environment is using the abovementioned ports, then adjust the port mapping defined in the docker-compose.yml file as desired.
### Installation

 1. Clone the repository. 
	`git clone https://github.com/jasontalon/ecom_simula.git`
 2. Go to project root directory
 `cd ecom_simula`
 3. Initialize docker-compose
 `docker-compose up -d`
 4. Open web browser and go to http://localhost:5435/ (web)
 
 ## Others
 Other exercises can be demonstrated here:
 
 - page: http://moscord-env.eba-m5685j4z.ap-southeast-1.elasticbeanstalk.com/exercises
 - code: https://github.com/jasontalon/ecom_simula/blob/f7bbc0ae4bdd0c487bae5fd9c4475391dfa6bf63/web/pages/exercises.vue#L106-L134
 

 
