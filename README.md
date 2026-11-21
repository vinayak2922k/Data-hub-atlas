# The Data Hub

The Data Hub is a persistent RESTful API server built on Node.js and Express, migrating from previous in-memory array storage to cloud document storage on MongoDB Atlas via Mongoose ODM.

The system features schema validation, normalized document references with population, custom colored terminal request logging, a mock JWT authentication endpoint, and an interactive live API console served directly at the root endpoint (`/`).

---

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5
- **Database**: MongoDB Atlas
- **ODM**: Mongoose 9
- **Environment Management**: Dotenv
- **Dev Tooling**: Nodemon

---

## Project Structure

```text
├── config/
│   └── db.js                 # Database connection logic with Mongoose
├── controllers/
│   ├── authController.js     # Mock JWT login handler
│   ├── postController.js     # Post CRUD, validation, and population logic
│   └── userController.js     # User registration and listing logic
├── docs/
│   └── DataHub.postman_collection.json  # Comprehensive Postman test suite
├── middleware/
│   └── logger.js             # ANSI-colored HTTP request logger with latency
├── models/
│   ├── Post.js               # Post schema with strict types and User ref
│   └── User.js               # User schema with unique, lowercase email
├── routes/
│   ├── authRoutes.js         # Auth routes (/login)
│   ├── postRoutes.js         # Post routes (/posts, /posts/recent, /posts/:id)
│   └── userRoutes.js         # User routes (/users)
├── views/
│   └── landingPage.js        # Interactive live API console and landing page
├── .env.example              # Placeholder environment configuration
├── .gitignore                # Ignores .env, node_modules, and logs
├── package.json              # Project metadata, dependencies, and run scripts
├── README.md                 # System documentation and deployment instructions
├── seed.js                   # Database seed script for test users and posts
└── server.js                 # Application bootstrap and server entry point
```

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd "Sprint 10"
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to create `.env`:

```bash
cp .env.example .env
```

Open `.env` and set your credentials:

```ini
PORT=5000
MONGO_URI=mongodb+srv://<user>:<hidden>@cluster0.abcde.mongodb.net/datahub?retryWrites=true&w=majority
```

> **Security Note**: Never commit `.env` or expose database credentials in version control. The MongoDB connection string must remain strictly masked if referenced in logs or documentation (e.g., `mongodb+srv://<user>:<hidden>@...`).

### 3. Seed Database (Optional)

To wipe the collections and load 3 sample users and 8 realistic web development posts:

```bash
npm run seed
```

### 4. Run the Application

For local development with live reloading:

```bash
npm run dev
```

For production execution:

```bash
npm start
```

Once running, navigate to `http://localhost:5000/` to view the interactive live dashboard and route console.

---

## API Route Table

All API endpoints return a standardized JSON envelope:

```json
{
  "success": true,
  "message": "Status description",
  "data": { ... }
}
```

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Interactive API explorer & console with live Atlas telemetry | `200` |
| `GET` | `/health` | Server uptime, operational status, and database telemetry | `200` |
| `POST` | `/login` | Mock JWT authentication generating 3-part Base64URL token | `200`, `400` |
| `GET` | `/users` | Retrieve list of all registered authors | `200` |
| `POST` | `/users` | Create new author (`name`, unique lowercase `email`) | `201`, `400` |
| `GET` | `/posts` | Retrieve all posts populated with author (`name`, `email`) | `200` |
| `GET` | `/posts/recent` | Retrieve Top 3 most recent posts (sorted by `createdAt` desc) | `200` |
| `GET` | `/posts/:id` | Retrieve single post by 24-character hexadecimal ObjectId | `200`, `400`, `404` |
| `POST` | `/posts` | Create new post (`title`: 3-120 chars, `content`, `authorId`) | `201`, `400`, `404` |
| `PUT` | `/posts/:id` | Update post title or content with schema validation | `200`, `400`, `404` |
| `DELETE`| `/posts/:id` | Permanently delete post by ObjectId | `200`, `400`, `404` |

---

## Postman Collection

A complete Postman test collection is located at [`docs/DataHub.postman_collection.json`](file:///c:/Users/VINAYAK%20SHARMA/OneDrive/Desktop/Prodesk%20IT/Sprint%2010/docs/DataHub.postman_collection.json). It includes requests testing all happy paths, malformed ObjectId validation errors (`400`), resource missing scenarios (`404`), and invalid payloads.

---

## Deployment Guide (Render)

This project is configured for cloud deployment on [Render](https://render.com). Do NOT deploy this service on Vercel, as Vercel's serverless execution model terminates persistent database connection pools and background sockets.

### Steps to Deploy on Render

1. Log in to your Render dashboard and click **New +** > **Web Service**.
2. Connect your Git repository containing the Data Hub project.
3. Configure service settings:
   - **Name**: `the-data-hub`
   - **Environment**: `Node`
   - **Branch**: `master` (or `main`)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In the **Environment Variables** tab, add the following variables:
   - `PORT`: `5000` (or leave default assigned by Render)
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/datahub?retryWrites=true&w=majority`
   - `NODE_ENV`: `production`
5. Click **Create Web Service**.
6. Ensure that MongoDB Atlas Network Access whitelist permits Render's outbound traffic (or allows `0.0.0.0/0` with secure user credentials).

---

## What I Learned

Transitioning from in-memory arrays to MongoDB Atlas with Mongoose solidified how critical database lifecycle management is in production Node services. Ensuring that the application connects to MongoDB before binding the HTTP listener prevents dropped requests on cold starts.

Working with Mongoose schema validation highlighted the power of enforcing constraints (like title length bounds and email sanitization) at the data layer rather than scattering checks across controllers. Using `.populate("authorId", "name email")` showed how document databases can manage relational structures cleanly without complex manual lookups, while registering parameterized routes in the correct order (`/posts/recent` prior to `/posts/:id`) reinforced how Express processes routing tables sequentially.

---

## Author

- **Vinayak Sharma**
- GitHub: [vinayak2922k](https://github.com/vinayak2922k)
- LinkedIn: [Vinayak Sharma](https://www.linkedin.com/in/vinayak-sharma)
- Email: [vinayaksharma2289@gmail.com](mailto:vinayaksharma2289@gmail.com)
