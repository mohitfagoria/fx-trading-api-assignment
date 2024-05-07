# FX Trading API

## Description
APIs for accessing real-time Exchange Rate data, Conversion, Checking Balance, and adding balance to the account

### Features
1. Developed a background data fetching service to regularly retrieve FX conversion rates from an external API and cache them in memory using Redux for efficient access.
2. Ensured secure user authentication and authorization by implementing signup and login functionalities with JWT token authentication using the passport library.
3. Secured sensitive user data by encrypting passwords before storing them in MongoDB, which serves as the database for storing user details.
4. Created protected routes for specific endpoints such as *** /accounts/topup *** and *** /accounts/balance *** to restrict access to authorized users with valid JWT tokens.
5. Ensured API robustness by implementing error handling, input validation, and thorough documentation of all API endpoints and their usage using Swagger, and enhanced reliability through comprehensive testing using Jest.

## Instruction

### Clone the repository 
```
git clone https://github.com/mohitfagoria/fx-trading-api-assignment.git
```
### Install the npm packages
```
$ cd fx-trading-api-assignment
$ npm install

```
### Run the backend

```
npm run start

# watch mode
$ npm run start:dev

```
### Swagger (Test the APIs)

#### When the app is running go to http://localhost:5174/api/ to test all the apis.

### Test
```
npm run test
```


- Created an FX rate syncing system that runs in the background and fetches live FX conversion rates from app.exchangerate-api.com and stores them in memory.
- Created a system that fetches data at a period of ***30s*** from app.exchangerate-api.com and stores it.
- When the data is fetched an expiry of ***30s*** is also stored with it 
- Caching is also done using Redux

## Create the following API endpoints

1. ***GET /fx-rates***
2. ***POST /fx-conversion***
3. ***POST /auth/signup***
4. ***POST /auth/login***
5. ***GET /accounts/balance***
6. ***POST /accounts/topup***

## Note

#### HI have used exchangerate-api.com because alphavantage.co had a limit in the free tier and I had to fetch the data every 30s.
