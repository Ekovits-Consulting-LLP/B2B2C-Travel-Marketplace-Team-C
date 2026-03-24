const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'travelhub_db',
  password: 'admin123',
  port: 5432
});

// Map packages to correct image filenames that exist in public/images/packages/
const packageImages = {
  6: ['dubai-complete.jpg', 'dubai-luxury.jpg'], // Perfect Dubai & Abu Dhabi Escape
  7: ['dubai-budget.jpg'], // Budget Dubai City Explorer
  8: ['dubai-complete.jpg'], // Luxury Dubai Shopping & Spa
  9: ['bali-paradise.jpg', 'bali-luxury.jpg'], // Bali Bliss Beach Getaway
  10: ['bali-paradise.jpg', 'bali-luxury.jpg'], // Bali Adventure & Culture Tour
  11: ['bali-budget.jpg'], // Budget Bali Explorer
  12: ['manali-adventure.jpg', 'shimla-manali.jpg'], // Manali Adventure & Trekking
  13: ['manali-adventure.jpg', 'shimla-manali.jpg'], // Honeymoon in Himalayas
  14: ['shimla-manali.jpg'], // Family Holiday in Hill Stations
  15: ['europe.jpg', 'europe-dream.jpg'], // Europe - Paris City of Love
  16: ['europe.jpg', 'europe-dream.jpg'], // Luxury Paris With Countryside
  17: ['europe.jpg'], // Budget Paris Backpacker Tour
  18: ['maldives-honeymoon.jpg', 'maldives-honeymoon.jpg'], // Maldives Paradise Escape
  19: ['maldives-honeymoon.jpg'], // Maldives Budget Island Hop
  20: ['maldives-honeymoon.jpg'], // Honeymoon in Maldives
  21: ['thailand-discovery.jpg', 'thailand-discovery.jpg'], // Thailand Bangkok & Phuket Adventure
  22: ['thailand-discovery.jpg'], // Thailand Luxury Spa & Resort
  23: ['thailand-discovery.jpg'], // Budget Thailand Backpacker Trail
  24: ['singapore-family.jpg', 'singapore-family.jpg'], // Singapore City Explorer
  25: ['singapore-family.jpg'], // Singapore & Sentosa Island Luxury
  26: ['singapore-family.jpg'], // Singapore Family Fun Package
  27: ['kerala-backwaters.jpg', 'kerala-backwaters.jpg'], // Kerala Backwaters Cruise
  28: ['kerala-backwaters.jpg'], // Kerala Wellness & Ayurveda Retreat
  29: ['kerala-backwaters.jpg'] // Kerala Family Heritage Tour
};

async function fixImages() {
  try {
    console.log('Fixing image filenames in packages...\n');

    for (const [packageId, images] of Object.entries(packageImages)) {
      try {
        const result = await db.query(
          `UPDATE packages SET images = $1 WHERE id = $2 RETURNING title`,
          [JSON.stringify(images), packageId]
        );

        if (result.rows.length > 0) {
          console.log(`✓ Added ${images.length} image(s) to: ${result.rows[0].title}`);
        } else {
          console.log(`✗ Package ${packageId} not found`);
        }
      } catch (error) {
        console.error(`Error updating package ${packageId}:`, error.message);
      }
    }

    console.log('\n✓ Images fixed successfully!');
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await db.end();
  }
}

fixImages();