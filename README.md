# CRM for a small cafe
This application provides all the necessary functionality for a small cafe. You can add categories and items, create orders, count your revenue, see orders history, etc. The "Overview" page shows some statistics data. There are two charts on the "Analytics" page which show dynamics of orders and the revenue.

## Frontend (Angular 9)
* Materialize for styling

## Backend (NodeJS - Express)
* NodeJS with Express Framework 
* Database is MongoDB

## Prior to using this app the following steps should be taken
* Make sure you have Node.js v.10.19.0 or later and NPM installed
* You also must have **MongoDB database** available
* Run **npm install** to install dependencies for the server
* Run **npm run client-install** to install dependencies for the client

## For Development mode
* In **config** folder rename **keys_dev_mock.js** to **keys_dev.js** and fill in all fields with relevant data
* Run **npm run dev**. This command will launch the client and node-backend. The app will be automatically reloaded every time you change any of the source files


## For Production mode
* Set environment variable NODE_ENV **export NODE_ENV=production** if needed
* Set two variables **export MONGO_URI=*your link*** and **export JWT=*your token*** for MongoDB and jsonwebtoken
* You might want to change default port(5000) **export PORT=*your port***
* Run **npm install** to install dependencies for the server
* Run **npm run client-install** to install dependencies for the client
* Run **npm run build --prefix client** to build the project. The build artifacts will be stored in the **client/dist/client** directory
* Run **npm install pm2 -g** to install a production process manager for Node.js applications
* Run **pm2 start index.js** to start the app in production mode
