const assert = require("node:assert/strict");
const { test } = require("node:test");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

test("database readiness gates API requests and preserves CORS", async (t) => {
  process.env.VERCEL = "1";
  process.env.FRONTEND_URL = "https://flavour-verse-pi.vercel.app";
  delete process.env.MONGO_URL;
  const app = require("./index");
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  let database;
  t.after(async () => {
    t.mock.restoreAll();
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    if (database) await database.stop();
  });
  const url = `http://127.0.0.1:${server.address().port}`;
  const headers = { Origin: process.env.FRONTEND_URL };

  await t.test("reports missing configuration without buffering queries", async () => {
    const response = await fetch(`${url}/recipe`, { headers });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("access-control-allow-origin"), headers.Origin);
    assert.equal((await response.json()).code, "DATABASE_NOT_CONFIGURED");
  });

  await t.test("allows CORS preflight even when the database is unavailable", async () => {
    const response = await fetch(`${url}/auth/login`, {
      method: "OPTIONS",
      headers: { ...headers, "Access-Control-Request-Method": "POST" },
    });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
  });

  await t.test("shares a failed connection attempt and retries on a later request", async () => {
    process.env.MONGO_URL = "mongodb://127.0.0.1:1/unavailable";
    let rejectConnection;
    const attempt = new Promise((resolve, reject) => {
      rejectConnection = reject;
    });
    let connectionStarted;
    const started = new Promise((resolve) => { connectionStarted = resolve; });
    const mocked = t.mock.method(mongoose, "connect", () => {
      connectionStarted();
      return attempt;
    });
    const requests = [fetch(`${url}/recipe`), fetch(`${url}/blog`)];
    await started;
    // Let both requests enter the middleware before rejecting their shared promise.
    await new Promise((resolve) => setTimeout(resolve, 50));
    rejectConnection(new Error("Private connection details"));
    for (const response of await Promise.all(requests)) {
      assert.equal(response.status, 503);
      const body = await response.json();
      assert.equal(body.code, "DATABASE_UNAVAILABLE");
      assert.equal(JSON.stringify(body).includes("Private connection details"), false);
    }
    assert.equal(mocked.mock.callCount(), 1);
    assert.equal((await fetch(`${url}/health`)).status, 503);
    assert.equal(mocked.mock.callCount(), 2);
    mocked.mock.restore();
  });

  await t.test("connects before listing content and completes anonymous auth checks", async () => {
    database = await MongoMemoryServer.create();
    process.env.MONGO_URL = database.getUri("readiness-test");
    const response = await fetch(`${url}/recipe`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
    assert.deepEqual(await (await fetch(`${url}/health`)).json(), {
      status: "ok", database: "connected",
    });
    assert.deepEqual(await (await fetch(`${url}/blog`)).json(), []);
    const auth = await fetch(`${url}/auth/login/success`);
    assert.equal(auth.status, 401);
    assert.equal((await auth.json()).success, false);
  });
});
