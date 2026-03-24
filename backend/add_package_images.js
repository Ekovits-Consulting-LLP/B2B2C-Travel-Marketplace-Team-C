const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'travelhub_db',
  password: 'admin123',
  port: 5432
});

// Map packages to image URLs
const packageImages = {
  6: ['dubai1.jpg', 'dubai2.jpg'], // Perfect Dubai & Abu Dhabi Escape
  7: ['dubai_budget.jpg'], // Budget Dubai City Explorer
  8: ['dubai_spa.jpg'], // Luxury Dubai Shopping & Spa
  9: ['bali1.jpg', 'bali2.jpg'], // Bali Bliss Beach Getaway
  10: ['bali_culture.jpg', 'bali_temple.jpg'], // Bali Adventure & Culture Tour
  11: ['bali_budget.jpg'], // Budget Bali Explorer
  12: ['manali_trek.jpg', 'manali_mountain.jpg'], // Manali Adventure & Trekking
  13: ['manali_honeymoon.jpg', 'manali_romantic.jpg'], // Honeymoon in Himalayas
  14: ['manali_family.jpg'], // Family Holiday in Hill Stations
  15: ['paris_eiffel.jpg', 'paris_city.jpg'], // Europe - Paris City of Love
  16: ['paris_luxury.jpg', 'paris_countryside.jpg'], // Luxury Paris With Countryside
  17: ['paris_budget.jpg'], // Budget Paris Backpacker Tour
  18: ['maldives_resort.jpg', 'maldives_beach.jpg'], // Maldives Paradise Escape
  19: ['maldives_island.jpg', 'maldives_snorkel.jpg'], // Maldives Budget Island Hop
  20: ['maldives_honeymoon.jpg', 'maldives_romantic.jpg'], // Honeymoon in Maldives
  21: ['thailand_bangkok.jpg', 'thailand_phuket.jpg'], // Thailand Bangkok & Phuket Adventure
  22: ['thailand_spa.jpg', 'thailand_resort.jpg'], // Thailand Luxury Spa & Resort
  23: ['thailand_budget.jpg', 'thailand_street.jpg'], // Budget Thailand Backpacker Trail
  24: ['singapore_marina.jpg', 'singapore_city.jpg'], // Singapore City Explorer
  25: ['singapore_sentosa.jpg', 'singapore_luxury.jpg'], // Singapore & Sentosa Island Luxury
  26: ['singapore_family.jpg', 'singapore_universal.jpg'], // Singapore Family Fun Package
  27: ['kerala_backwater.jpg', 'kerala_houseboat.jpg'], // Kerala Backwaters Cruise
  28: ['kerala_ayurveda.jpg', 'kerala_spa.jpg'], // Kerala Wellness & Ayurveda Retreat
  29: ['kerala_temple.jpg', 'kerala_heritage.jpg'] // Kerala Family Heritage Tour
};

async function addImages() {
  try {
    console.log('Adding images to packages...\n');
    
    for (const [packageId, images] of Object.entries(packageImages)) {
      try {
        const result = await db.query(
          `UPDATE packages SET images = $1 WHERE id = $2 RETURNING title`,
          [JSON.stringify(images), packageId]
        );
        
        if (result.rows.length > 0) {
          console.log(`✓ Added ${images.length} image(s) to: ${result.rows[0].title}`);
        }
      } catch (err) {
        console.error(`✗ Error updating package ${packageId}:`, err.message);
      }
    }
    
    console.log('\n✓ Images added successfully!');
    await db.end();
  } catch (err) {
    console.error('Database error:', err.message);
    process.exit(1);
  }
}

addImages();
