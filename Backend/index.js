const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const seedDB = require("./seed");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv").config();
const passport = require("passport");
const passportsetup = require("./passoprt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongourl = process.env.MONGO_URL;
const port = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";
const clientUrls = (process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((u) => u.trim().replace(/\/$/, ""));

// Vercel sits behind a proxy; needed for secure cookies
app.set("trust proxy", 1);

mongoose
  .connect(mongourl)
  .then(() => console.log("Connection Open!"))
  .catch((err) => console.log(err));

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

app.use(
  cors({
    origin: clientUrls,
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Include credentials (cookies, authorization headers) in CORS requests
  })
);

app.use((req, res, next) => {
  // console.log("req.user");
  // console.log(req.user);
  next();
});

//all routes
const BlogRoutes = require("./Routes/BlogRoutes");
const NormalRoutes = require("./Routes/NormalRoutes");
const RecipeRoutes = require("./Routes/RecipeRoutes");
const UserRoutes = require("./Routes/UserRoutes");

app.use(BlogRoutes);
app.use(NormalRoutes);
app.use(RecipeRoutes);
app.use("/auth", UserRoutes);

// seedDB();
// Vercel runs the exported app as a serverless function; only listen locally
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
