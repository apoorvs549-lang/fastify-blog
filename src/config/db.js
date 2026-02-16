import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "./env.js";

async function dbConnector(fastify, options) {
  const dbFile = env.dbFile || "./blog.db";
  const db = new Database(dbFile, { verbose: console.log });
db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const count=db.prepare("SELECT COUNT(*) as total FROM posts").get();
  if(count.total===0){
db.exec(`
    INSERT INTO posts (title, slug, content) VALUES
  ('Getting Started with Fastify', 'getting-started-fastify', 'Fastify is a fast and low overhead web framework for Node.js.'),
  ('Understanding SQLite in Node.js', 'sqlite-nodejs-guide', 'SQLite is a lightweight database perfect for small projects.'),
  ('Why Fastify is Faster than Express', 'fastify-vs-express', 'Fastify focuses on performance and low overhead.');
  `);
  }
  
  fastify.decorate("db", db);

  fastify.addHook("onClose", (fastify, done) => {
    db.close();
    done();
  });

  console.log("Database and posts table created successfully");
}

export default fp(dbConnector);
