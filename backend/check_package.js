const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'travelhub_db',
  password: 'admin123',
  port: 5432
});

async function checkPackage() {
  try {
    const result = await db.query('SELECT id, title, inclusions, exclusions, itinerary FROM packages WHERE id = $1', [26]);
    if (result.rows.length > 0) {
      const pkg = result.rows[0];
      console.log('Package:', pkg.title);
      console.log('Inclusions type:', typeof pkg.inclusions, 'value:', pkg.inclusions);
      console.log('Exclusions type:', typeof pkg.exclusions, 'value:', pkg.exclusions);
      console.log('Itinerary type:', typeof pkg.itinerary, 'value:', pkg.itinerary ? pkg.itinerary.length : 0, 'items');
    } else {
      console.log('Package not found');
    }
    await db.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkPackage();