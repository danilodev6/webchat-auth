import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.DB_USERS_URL || "",
  authToken: process.env.DB_USERS_KEY,
});

await db.execute(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE,
password TEXT)`);

await db.execute(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT,
content TEXT)`);
