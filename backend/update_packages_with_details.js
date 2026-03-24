const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'travelhub_db',
  password: 'admin123',
  port: 5432
});

// Read packages.js from frontend
const packagesPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'packages.js');
const packagesContent = fs.readFileSync(packagesPath, 'utf8');

let packages;
try {
  // Extract the array content between const packages = [ and ];
  const arrayMatch = packagesContent.match(/const packages = (\[[\s\S]*?\]);/);
  if (!arrayMatch) {
    console.error('Could not extract packages array');
    process.exit(1);
  }
  packages = eval(arrayMatch[1]);
  console.log('Packages loaded, type:', typeof packages, 'length:', packages?.length);
} catch (err) {
  console.error('Error parsing packages.js:', err.message);
  process.exit(1);
}

async function updatePackages() {
  try {
    console.log('Connecting to database...');

    // First, list existing packages
    const existing = await db.query('SELECT id, title FROM packages ORDER BY id');
    console.log('Existing packages in database:');
    existing.rows.forEach(pkg => console.log(`- ID ${pkg.id}: ${pkg.title}`));
    console.log('');

    // Update ALL packages in database with data from packages.js
    // We'll use a simple mapping or just update all packages with sample data
    for (const dbPkg of existing.rows) {
      // Find a matching package from packages.js (by partial name match or just use the first one)
      let matchingPkg = null;

      // Try to find a matching package by partial name
      for (const pkg of packages) {
        if (dbPkg.title.toLowerCase().includes(pkg.title.toLowerCase().split(' ')[0]) ||
            pkg.title.toLowerCase().includes(dbPkg.title.toLowerCase().split(' ')[0])) {
          matchingPkg = pkg;
          break;
        }
      }

      // If no match found, use the first package as default
      if (!matchingPkg) {
        matchingPkg = packages[0]; // Use Dubai Complete Tour as default
        console.log(`⚠ No exact match for "${dbPkg.title}", using default data`);
      }

      // Update the package with inclusions, exclusions, and itinerary
      await db.query(
        `UPDATE packages
         SET inclusions = $1, exclusions = $2, itinerary = $3
         WHERE id = $4`,
        [
          JSON.stringify(matchingPkg.inclusions || []),
          JSON.stringify(matchingPkg.exclusions || []),
          JSON.stringify(matchingPkg.itinerary || []),
          dbPkg.id
        ]
      );

      console.log(`✓ Updated: ${dbPkg.title} (ID: ${dbPkg.id}) with ${matchingPkg.title} data`);
    }

    console.log('\n✓ All packages updated successfully!');
    await db.end();
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
}

updatePackages();