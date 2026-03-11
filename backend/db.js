require('dotenv').config();
const { Pool } = require('pg');

// Use dummy credentials if real ones aren't provided in .env
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travelhub_db',
  password: process.env.DB_PASSWORD || 'atharva1',
  port: process.env.DB_PORT || 5432,
});

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    await initDb();
    release();
  }
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        status VARCHAR(20) DEFAULT 'pending',
        agency_name TEXT,
        phone TEXT,
        address TEXT,
        agent_photo TEXT,
        company_logo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        destination VARCHAR(150),
        days INTEGER,
        nights INTEGER,
        price NUMERIC(10,2),
        travelers INTEGER,
        rating INTEGER,
        description TEXT,
        inclusions JSONB,
        exclusions JSONB,
        itinerary JSONB,
        images JSONB,
        package_types JSONB,
        status VARCHAR(20) DEFAULT 'pending',
        agent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
        day_number INTEGER,
        hotel_name TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS package_requests (
        request_id SERIAL PRIMARY KEY,
        package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
        agent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        request_type VARCHAR(20),
        new_title TEXT,
        new_price NUMERIC,
        new_description TEXT,
        status VARCHAR(20) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        new_images JSONB,
        new_data JSONB
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
        customer_name VARCHAR(100),
        email VARCHAR(100),
        travelers INTEGER,
        travel_date DATE,
        status VARCHAR(20) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create default admin if not exists
    const adminCheck = await pool.query("SELECT id FROM users WHERE email = 'admin@travelhub.com'");
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        "INSERT INTO users (full_name, email, password, role) VALUES ('Platform Admin', 'admin@travelhub.com', $1, 'Admin')",
        [hash]
      );
      console.log('Default Admin account created (admin@travelhub.com / admin123)');
    }

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb,
};
