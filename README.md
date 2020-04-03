# E-Commerce Exercise

## About

## Running in your local environment
### Requirements
- **Docker**
- **Docker-Compose**

*Note:* The app's Docker compose configuration will use the following ports:
- **5000** - pgadmin
- **5432** - postgres
- **5434** - api
- **5435** - web

If your environment is using the said ports, then adjust the port mapping defined in the docker-compose.yml file as desired.
### Installation

 1. Clone the repository. 
	`git clone https://github.com/jasontalon/ecom_simula.git`
 2. Go to project root directory
 `cd ecom_simula`
 3. Initialize docker-compose
 `docker-compose up -d`
 4. Open web browser and go to http://localhost:5435/ (web)

 
