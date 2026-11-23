# FlavourVerse

FlavourVerse is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to share blogs and recipes.

## Features

- **User Authentication**: Secure login and signup functionality using Passport.js.
- **Social Networking**: Users can follow other users, comment on posts, and more.
- **Profile Section**: Users can view their profile and see their posts, followers, and following.
- **Responsive Front-end**: The front-end is fully responsive and works across various devices.
- **Efficient Server-side Operations**: Robust server-side operations ensure smooth functioning of the application.
- **Robust Data Management**: Efficient handling and management of data using MongoDB.
- **Powerful Back-end**: Strong back-end functionalities built with Node.js and Express.js.

## Preview

<p align="center">
  <img src="Frontend/src/pages/contactUs/mainspices.jpg" alt="Spices banner" width="720">
</p>
<p align="center">
  <img src="Frontend/src/assets/images/traditional-korean-dish-bibimbap-with-chopsticks-free-photo.webp" alt="Featured dish" width="360">
  <img src="Frontend/src/pages/contactUs/contactus.png" alt="Contact us" width="360">
</p>

## Project Structure

```
Recipe-Community/
├── Backend/    Express API (auth, recipes, blogs, reviews) + Mongoose models
└── Frontend/   React app built with Vite
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer and npm
- MongoDB (optional for local development, see Option A below)

## Installation & Running

### 1. Install dependencies

```bash
cd Backend
npm install
cd ../Frontend
npm install
```

### 2. Start the backend

**Option A: no MongoDB installation needed (recommended for a quick start)**

```bash
cd Backend
npm run dev
```

This starts a temporary in-memory MongoDB, loads sample recipes and blogs, and runs the API on `http://localhost:5000`. All data is reset every time the backend restarts.

**Option B: your own MongoDB**

Create `Backend/.env`:

```
PORT=5000
MONGO_URL=mongodb://localhost:27017/recipeeee
GOOGLE_CLIENT_ID=your_google_client_id        # optional, only for Google login
GOOGLE_CLIENT_SECRET=your_google_client_secret  # optional, only for Google login
```

Then run:

```bash
cd Backend
npm start
```

To load the sample data once, uncomment `seedDB();` in `Backend/index.js`, start the server once, then comment it again.

### 3. Start the frontend

```bash
cd Frontend
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). If that port is already taken, Vite picks the next free one (for example `5174`), which the backend also allows.

## Usage

1. Open the app. The home page lists the latest recipes; use **Read More** to open one.
2. Click **Signup Now** on the login page and register with a username, email and password.
3. Log in with the same username and password. Google sign-in only works if you configured the Google credentials.
4. Add your own recipes and blogs, review recipes, and comment on blogs.
5. Visit other users' profiles to follow or unfollow them and manage follow requests from the navbar.

## Test Login

When started with `npm run dev` (Option A), a test account is created automatically on every start:

| Field | Value |
| ----- | ----- |
| Username | `tester` |
| Password | `Test@1234` |

These credentials are for local testing only. With your own MongoDB (Option B) there is no default account, so sign up first.

## API Overview

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/recipe/` | List recipes |
| GET | `/recipe/:id` | Recipe details |
| POST | `/recipe/add` | Add a recipe |
| POST | `/recipe/:id/review` | Review a recipe |
| GET | `/blog/` | List blogs |
| POST | `/blog/add` | Add a blog |
| POST | `/blog/:id/comment` | Comment on a blog |
| POST | `/auth/register` | Sign up |
| POST | `/auth/login` | Log in |
| GET | `/auth/profile/:id` | User profile |

## Deploying to Vercel

Deploy the backend and the frontend as two separate Vercel projects from the same repository.

1. **Database:** create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas), add a database user, allow access from anywhere (`0.0.0.0/0`) under Network Access, and copy the connection string.
2. **Push the code** to your own Git repository (GitHub, GitLab or Bitbucket).
3. **Backend project:** in Vercel choose *Add New Project*, import the repository and set **Root Directory** to `Backend`. Add these environment variables:

   | Name | Value |
   | ---- | ----- |
   | `MONGO_URL` | your Atlas connection string |
   | `SESSION_SECRET` | any long random string |
   | `FRONTEND_URL` | the frontend URL from step 4 (add it after the frontend is deployed, then redeploy) |
   | `NODE_ENV` | `production` |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional, only for Google login |

   Deploy and note the backend URL, for example `https://recipe-api.vercel.app`.
4. **Frontend project:** import the same repository again with **Root Directory** `Frontend` (Framework: Vite). Add the variable `VITE_API_URL` set to the backend HTTPS URL from step 3 and deploy. Production builds require this variable; do not use `localhost`. Select the Production environment when adding it in Vercel. Changes to this variable require a new deployment because Vite embeds it at build time.
5. Go back to the backend project, set `FRONTEND_URL` to the frontend URL and redeploy. If the frontend domain changes, update this value again. For the current frontend, use `https://flavour-verse-pi.vercel.app`.
6. Open the backend's `/health` endpoint. It must return `{"status":"ok","database":"connected"}`. A `503` with `DATABASE_NOT_CONFIGURED` means `MONGO_URL` is missing from the backend environment. `DATABASE_UNAVAILABLE` means the connection failed: check Atlas database credentials, the connection string, and Network Access. Redeploy after changing Vercel environment variables. Do not share database passwords or connection strings in screenshots or logs.
7. **Load sample data (optional):** from `Backend`, with `MONGO_URL` saved in `Backend/.env`, run:

   ```powershell
   node -r dotenv/config -e "require('mongoose').connect(process.env.MONGO_URL).then(async()=>{await require('./seed')();}).catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>require('mongoose').disconnect())"
   ```

   Run this once per database; repeating it inserts duplicate sample content. Sign up in the deployed app to create your own account. Seeding the database does not create the local `tester` account.

Notes: some browsers block cookies between two different `vercel.app` domains, which can break login. If that happens, attach a custom domain (for example `app.example.com` and `api.example.com`) to the two projects. The in-memory test account only exists in local `npm run dev`; on Vercel, sign up a new user.

## Troubleshooting

- **Home page shows no recipes:** locally, make sure the backend is running on port 5000. On Vercel, verify `VITE_API_URL` points to your deployed backend and redeploy the frontend. Open the backend's `/recipe/` endpoint: it should return a JSON array, not HTML or a Vercel error. An empty array means the cloud database has no recipes yet; the local in-memory data is not transferred automatically.
- **CORS error in the browser console:** locally, use `localhost:5173` or `localhost:5174`. On Vercel, set the backend's `FRONTEND_URL` to your exact frontend origin (for example `https://flavour-verse-azure.vercel.app`) and redeploy the backend.
- **Google login fails:** expected unless `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- **Accounts disappeared:** you are using the in-memory database (Option A); register again after each restart.

## Validation

From `Backend`, run `node --test index.test.js` to check database readiness, retry behavior, CORS preflight and anonymous authentication responses. The tests use a separate temporary MongoDB instance, not your Atlas database.

## Technologies Used

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
