// Local dev launcher: starts an in-memory MongoDB, seeds it, then boots the API.
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongod.getUri("recipeeee");
  process.env.PORT = process.env.PORT || "5000";
  await mongoose.connect(process.env.MONGO_URL);
  await require("./seed")();
  await require("./Models/user").register(
    { username: "tester", email: "tester@example.com" },
    "Test@1234"
  );
  console.log("Test login -> username: tester, password: Test@1234");
  await mongoose.disconnect();
  require("./index");
})();
