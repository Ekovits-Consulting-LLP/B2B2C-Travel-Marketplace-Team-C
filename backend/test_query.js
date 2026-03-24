require('dotenv').config();
const {Pool} = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.query(
  "SELECT id, title, status, offer_percent, price, (price::numeric - (price::numeric * COALESCE(offer_percent::numeric,0) / 100)) AS final_price FROM packages WHERE status='approved'",
  (err, r) => {
    if (err) console.error('ERR:', err.message);
    else console.log('ROWS:', r.rows.length, JSON.stringify(r.rows, null, 2));
    pool.end();
  }
);
