const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    usersID INTEGER PRIMARY KEY AUTOINCREMENT,
    usersNAME TEXT NOT NULL UNIQUE,
    usersEMAIL TEXT NOT NULL,
    usersPWD TEXT NOT NULL,
    usersXP INTEGER DEFAULT 0,
    usersBIO TEXT,
    usersAVATAR TEXT DEFAULT "avatar1.png"
  );

  CREATE TABLE IF NOT EXISTS posts (
    postsID INTEGER PRIMARY KEY AUTOINCREMENT,
    postsUSER TEXT NOT NULL,
    postsCONTENT TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    commentsID INTEGER PRIMARY KEY AUTOINCREMENT,
    commentsPOST INTEGER NOT NULL,
    commentsUSER TEXT NOT NULL,
    commentsCONTENT TEXT NOT NULL,
    commentsLIKES INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comment_likes (
    likeID INTEGER PRIMARY KEY AUTOINCREMENT,
    commentID INTEGER NOT NULL,
    username TEXT NOT NULL,
    UNIQUE(commentID, username)
  );

  CREATE TABLE IF NOT EXISTS lessons (
    lessonID INTEGER PRIMARY KEY AUTOINCREMENT,
    lessonTITLE TEXT NOT NULL,
    lessonSLUG TEXT NOT NULL UNIQUE,
    lessonDESCRIPTION TEXT,
    lessonCONTENT TEXT NOT NULL,
    lessonCREATED_BY TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lesson_completions (
    completionID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    lessonSLUG TEXT NOT NULL,
    UNIQUE(username, lessonSLUG)
  );
`);

console.log('Database initialized at', dbPath);
db.close();
