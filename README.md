# Spam detection REST API

This project is a backend API for a Truecaller-like application, where users can register, login, report spam numbers, and search for users or phone numbers. It is built using **Node.js**, **Express.js**, and **Sequelize ORM** with **MySQL** as the database.


## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Token)
- **Password Security**: bcrypt

## Folder Structure

Backend/
 - controllers/ # All route handler logic
 - models/ # Sequelize models
 - routes/ # API route definitions
 - seed/ # Sample data seeding script
 - middleware/ # JWT auth middleware
 - config/ # DB config
 - server.js # Entry point
 - .env # Environment variables

## Features

-  User Registration & Login (JWT-based)
-  Add Contacts (simulated via seeding)
-  Global database includes all users and their imported contacts
-  Report a number as spam
-  Visibility of email only to contacts
-  Search by **name** or **phone number**
-  Spam likelihood tracking
-  MySQL + Sequelize for relational data modeling

##  Setup Instructions

### 1. Clone the Repository

- git clone https://github.com/Geethika4427/SpamDetection.git
- cd backend

### 2. Install Dependencies

npm install

### 3. Setup .env File
Create a .env file and add:
- PORT=3000
- DB_NAME=your_db_name
- DB_USER=your_mysql_username
- DB_PASSWORD=your_mysql_password
- DB_HOST=localhost
- JWT_SECRET=your_jwt_secret

### 4. Run Sample Seeder Script

node seed.js

### 5. Start the Server

node server.js

## API Endpoints
### Auth
POST http://localhost:3000/auth/register – Register a new user

POST http://localhost:3000/auth/login – Login and receive a JWT token

### Spam Reporting
POST http://localhost:3000/spam/report – Report a number as spam (requires auth)

### Search
GET http://localhost:3000/search/name?q=<name> – Search contacts/users by name

GET http://localhost:3000/search/phone?q=<phone> – Search by phone number

GET http://localhost:3000/search/details/:phone – Get full contact details by phone

## Authorization
Pass JWT token in the header for protected routes:-
Authorization: Bearer <your_token>

## Testing the API
Use Postman tool









