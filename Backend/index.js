const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv").config();
const passport = require("passport");
const passportsetup = require("./passoprt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";
const clientUrls = (process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((u) => u.trim().replace(/\/$/, ""));

// Vercel sits behind a proxy; needed for secure cookies
app.set("trust proxy", 1);

let connectionPromise;

async function connectDatabase() {
  if (!process.env.MONGO_URL) {
    const error = new Error("Set MONGO_URL in the backend environment.");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    }).finally(() => {
      connectionPromise = undefined;
    });
  }
  await connectionPromise;
}

app.use(
  cors({
    origin: clientUrls,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Await MongoDB inside the request lifecycle so serverless invocations cannot
// finish before the connection is established.
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    const code = error.code === "DATABASE_NOT_CONFIGURED"
      ? error.code
      : "DATABASE_UNAVAILABLE";
    console.error("Database connection failed", {
      name: error.name,
      code: error.code,
    });
    res.status(503).json({
      code,
      msg: code === "DATABASE_NOT_CONFIGURED"
        ? "Set MONGO_URL in the backend environment and redeploy."
        : "Database connection failed. Check MongoDB credentials and network access.",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", database: "connected" });
});

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "helloji"],
    maxAge: 24 * 60 * 60 * 100,
    // frontend and backend are on different domains in production
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//all routes
const BlogRoutes = require("./Routes/BlogRoutes");
const NormalRoutes = require("./Routes/NormalRoutes");
const RecipeRoutes = require("./Routes/RecipeRoutes");
const UserRoutes = require("./Routes/UserRoutes");

app.use(BlogRoutes);
app.use(NormalRoutes);
app.use(RecipeRoutes);
app.use("/auth", UserRoutes);

// Vercel runs the exported app as a serverless function; only listen locally
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
