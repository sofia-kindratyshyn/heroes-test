# Superhero Backend API

## Overview

This backend API provides CRUD operations for a superhero database. The API is built with Node.js and Express and uses PostgreSQL as the database.

---

## Steps to Run Backend

1. **Install dependencies**

    ```
    npm install
    ```

2. **Configure environment variables**

    Create a `.env` file with the following content:

    ```
    PORT=3000
    DB_HOST=
    DB_PORT=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    APP_DOMAIN=
    CLOUD_NAME=
    API_KEY=
    API_SECRET=
    ```

3. **Set up PostgreSQL database**

    Create the database and run any migrations or SQL scripts to create necessary tables.

4. **Start the backend server**

    ```
    npm run dev
    ```

    The server runs at [http://localhost:3000](http://localhost:3000) by default.

---

## API Endpoints

| Method | Endpoint     | Description                                       |
|--------|--------------|-------------------------------------------------|
| GET    | /heroes      | Get a paginated list of superheroes (5 per page)|
| GET    | /heroes/:id  | Get details of a specific superhero              |
| POST   | /heroes      | Create a new superhero                            |
| PUT    | /heroes/:id  | Update an existing superhero                      |
| DELETE | /heroes/:id  | Delete a superhero                                |

- Pagination is handled by query parameters, e.g., `?page=1` ; `?perPage=4`
- Image upload is supported on create/update endpoints with `multipart/form-data` field named `images`

---

## Assumptions

- `id` is an auto-incremented, unique identifier.
- `nickname` must be unique for each superhero.
- `images` are stored as URLs or paths after upload; multiple images allowed per superhero.
- Validation is performed using Joi, requiring all key fields.
- API expects JSON bodies or `multipart/form-data` for hero creation/updating.

---
