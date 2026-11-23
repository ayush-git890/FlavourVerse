// Local dev launcher: starts an in-memory MongoDB, seeds it, then boots the API.
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongod.getUri("recipeeee");
  process.env.PORT = process.env.PORT || "5000";
  await mongoose.connect(process.env.MONGO_URL);
  await require("./seed")();
  await mongoose.disconnect();
  require("./index");
})();
