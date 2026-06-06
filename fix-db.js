const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_pKb0OeU6xfoJ@ep-sweet-river-aqymc4h8.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // Quoting column names and table names to ensure Postgres respects them
    const query = 'INSERT INTO "lessons" ("lessontitle", "lessonslug", "lessondescription", "lessoncontent", "lessoncreated_by") VALUES ($1, $2, $3, $4, $5)';
    const values = ['Intro to CSS', 'intro-to-css', 'Learn CSS fundamentals', 'CSS Content', 'admin'];
    
    await pool.query(query, values);
    console.log('Insert success!');
  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await pool.end();
  }
}

run();
