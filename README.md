## AUTH NODE SERVER

## Configuration
Before start please run this commands:
- $ npm install


## Run Project
cd /projectDir
node app.js or nodemon app.js

## TEST Signup and Authenticate routes

You can use postman to test:

http://localhost:3000/users/signup
POST
Body ->
- x-www-form-urlencoded
- email
- password

http://localhost:3000/users/authenticate
POST
Body ->
- x-www-form-urlencoded
- email
- password