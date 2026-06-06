const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function nukeAndPave() {
  try {
    console.log("Starting database reset...");
    
    // Drop all tables
    await pool.query('DROP TABLE IF EXISTS lesson_completions, lessons, comment_likes, comments, posts, users CASCADE');
    console.log("Tables dropped.");

    // Recreate tables with clean PostgreSQL-compatible syntax
    await pool.query(`
      CREATE TABLE users (
        usersid SERIAL PRIMARY KEY,
        usersname TEXT UNIQUE,
        usersemail TEXT,
        userspwd TEXT,
        usersxp INTEGER DEFAULT 0,
        usersbio TEXT,
        usersavatar TEXT DEFAULT 'avatar1.svg'
      );
      CREATE TABLE posts (
        postsid SERIAL PRIMARY KEY,
        postsuser TEXT,
        postscontent TEXT
      );
      CREATE TABLE comments (
        commentsid SERIAL PRIMARY KEY,
        commentspost INTEGER,
        commentsuser TEXT,
        commentscontent TEXT,
        commentslikes INTEGER DEFAULT 0
      );
      CREATE TABLE comment_likes (
        likeid SERIAL PRIMARY KEY,
        commentid INTEGER,
        username TEXT,
        UNIQUE(commentid, username)
      );
      CREATE TABLE lessons (
        lessonid SERIAL PRIMARY KEY,
        lessontitle TEXT,
        lessonslug TEXT UNIQUE,
        lessondescription TEXT,
        lessoncontent TEXT,
        lessoncreated_by TEXT
      );
      CREATE TABLE lesson_completions (
        completionid SERIAL PRIMARY KEY,
        username TEXT,
        lessonslug TEXT,
        UNIQUE(username, lessonslug)
      );
    `);
    console.log("Tables recreated successfully.");
    
    // Insert initial CSS lesson
    await pool.query(`
      INSERT INTO lessons (lessontitle, lessonslug, lessondescription, lessoncontent, lessoncreated_by)
      VALUES ($1, $2, $3, $4, $5)
    `, ['Intro to CSS', 'intro-to-css', 'Learn CSS fundamentals', 'CSS Content', 'admin']);
    console.log("Initial lesson inserted.");

  } catch (err) {
    console.error("Critical Error during Nuke:", err);
  } finally {
    await pool.end();
  }
}

nukeAndPave();
