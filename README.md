# NestJS MongoDB API Project

This is a practical project created to learn how to build a RESTful API using NestJS with MongoDB as the database.

## Table of Contents

- [NestJS MongoDB API Project](#nestjs-mongodb-api-project)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Endpoints](#endpoints)

## Features

- CRUD operations for managing resources (e.g., users).
- Integration with MongoDB using Mongoose.
- Error handling and validation using built-in NestJS features.
- Modular architecture for better organization and scalability.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (version 12 or higher)
- npm (version 6 or higher)
- MongoDB

## Configuration

1. Configure MongoDB connection:

- Make sure MongoDB is running locally or specify the connection URI in the `.env` file.

2. Configure environment variables (optional):

- Create a `.env` file in the root directory and define environment variables if needed.

## Usage

1. Start the server:

```

npm run start:dev

```

2. The server should be running at `http://localhost:3000`.

## Endpoints

- **GET /users**: Get all users.
- **GET /users/:id**: Get user by ID.
- **POST /users**: Create a new user.
- **PATCH /users/:id**: Update user by ID.
- **DELETE /users/:id**: Delete user by ID.
