# JotForm - PII Detection Manual Review System
 
## Implementation
I used Node.js, Express.js, and MySQL for the backend of this application. For the frontend, I used React, axios, HTML, CSS. I did tests and experiments on a local database, using XAMPP and PHPMyAdmin.

## Running
In order to run this project, first you have to create database specifically for this project. My table name is "pii_db" as it can be seen in the config.js file. After the creation of database, you have to modify the config.js file for your own database.

After that, running `node init_db.js` code will initialize the tables. Then, you must run the `node populate.js` file to populate the tables with PII containing forms. PII_with_substr.json file is not available.

Then, running frontend and the backend is trivial.
