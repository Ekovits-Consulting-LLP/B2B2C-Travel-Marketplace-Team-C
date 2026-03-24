const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'travelhub_db',
  password: 'admin123',
  port: 5432
});

const packages = [
  // Dubai Packages
  {
    title: "Perfect Dubai & Abu Dhabi Escape",
    destination: "Dubai",
    days: 5,
    nights: 4,
    price: 65045.25,
    travelers: 15,
    rating: 5,
    description: "Experience the glamour of Dubai and the desert beauty of Abu Dhabi with luxury accommodations and guided tours.",
    offer_percent: 25,
    package_types: ["Luxury", "City Tour"],
    is_featured: true
  },
  {
    title: "Budget Dubai City Explorer",
    destination: "Dubai",
    days: 3,
    nights: 2,
    price: 18000,
    travelers: 8,
    rating: 4,
    description: "Explore Dubai's famous attractions including Burj Khalifa, Dubai Mall, and Palm Jumeirah on a budget.",
    offer_percent: 15,
    package_types: ["Budget Friendly", "City Tour"],
    is_featured: false
  },
  {
    title: "Luxury Dubai Shopping & Spa",
    destination: "Dubai",
    days: 4,
    nights: 3,
    price: 125000,
    travelers: 6,
    rating: 5,
    description: "Indulge in world-class shopping and spa treatments in Dubai's most luxurious resorts.",
    offer_percent: 10,
    package_types: ["Luxury"],
    is_featured: false
  },
  
  // Bali Packages
  {
    title: "Bali Bliss Beach Getaway",
    destination: "Bali",
    days: 7,
    nights: 6,
    price: 33333,
    travelers: 12,
    rating: 5,
    description: "Enjoy pristine beaches, temples, rice terraces, and rejuvenating spa treatments in exotic Bali.",
    offer_percent: 20,
    package_types: ["Honeymoon", "Beach Vacation"],
    is_featured: true
  },
  {
    title: "Bali Adventure & Culture Tour",
    destination: "Bali",
    days: 5,
    nights: 4,
    price: 42000,
    travelers: 10,
    rating: 4,
    description: "Discover Bali's rich culture, ancient temples, volcanic mountains, and vibrant nightlife.",
    offer_percent: 18,
    package_types: ["Adventure", "Cultural"],
    is_featured: false
  },
  {
    title: "Budget Bali Explorer",
    destination: "Bali",
    days: 4,
    nights: 3,
    price: 22000,
    travelers: 8,
    rating: 4,
    description: "Experience the beauty of Bali with affordable accommodation and local experiences.",
    offer_percent: 12,
    package_types: ["Budget Friendly"],
    is_featured: false
  },
  
  // Manali Packages
  {
    title: "Manali Adventure & Trekking",
    destination: "Manali",
    days: 5,
    nights: 4,
    price: 18500,
    travelers: 10,
    rating: 5,
    description: "Experience thrilling treks, snow-capped mountains, and charming hill station culture in Manali.",
    offer_percent: 22,
    package_types: ["Adventure", "Family"],
    is_featured: true
  },
  {
    title: "Honeymoon in Himalayas - Manali",
    destination: "Manali",
    days: 6,
    nights: 5,
    price: 45000,
    travelers: 2,
    rating: 5,
    description: "Romantic getaway with scenic mountain views, cozy accommodations, and couple activities.",
    offer_percent: 15,
    package_types: ["Honeymoon"],
    is_featured: false
  },
  {
    title: "Family Holiday in Hill Stations",
    destination: "Manali",
    days: 4,
    nights: 3,
    price: 28000,
    travelers: 20,
    rating: 4,
    description: "Fun-filled family vacation with activities suitable for all ages in the beautiful Himalayas.",
    offer_percent: 10,
    package_types: ["Family"],
    is_featured: false
  },
  
  // Paris Packages
  {
    title: "Europe - Paris City of Love",
    destination: "Paris",
    days: 4,
    nights: 3,
    price: 900,
    travelers: 4,
    rating: 4,
    description: "Explore iconic landmarks like Eiffel Tower, Louvre Museum, and charming Parisian streets.",
    offer_percent: 10,
    package_types: ["Couple", "Cultural"],
    is_featured: true
  },
  {
    title: "Luxury Paris With Countryside",
    destination: "Paris",
    days: 7,
    nights: 6,
    price: 2850,
    travelers: 6,
    rating: 5,
    description: "Experience Paris luxury and French countryside charm with wine tasting and gourmet dining.",
    offer_percent: 12,
    package_types: ["Luxury", "Cultural"],
    is_featured: false
  },
  {
    title: "Budget Paris Backpacker Tour",
    destination: "Paris",
    days: 3,
    nights: 2,
    price: 650,
    travelers: 8,
    rating: 4,
    description: "Affordable Paris tour with hostel stays, free attractions, and local street food experiences.",
    offer_percent: 15,
    package_types: ["Budget Friendly"],
    is_featured: false
  },
  
  // Maldives Packages
  {
    title: "Maldives Paradise Escape",
    destination: "Maldives",
    days: 5,
    nights: 4,
    price: 125000,
    travelers: 4,
    rating: 5,
    description: "Luxury island resort experience with overwater villas, pristine beaches, and water sports.",
    offer_percent: 8,
    package_types: ["Luxury", "Honeymoon"],
    is_featured: true
  },
  {
    title: "Maldives Budget Island Hop",
    destination: "Maldives",
    days: 4,
    nights: 3,
    price: 55000,
    travelers: 6,
    rating: 4,
    description: "Explore multiple Maldivian islands with budget-friendly guesthouses and local experiences.",
    offer_percent: 18,
    package_types: ["Budget Friendly", "Beach Vacation"],
    is_featured: false
  },
  {
    title: "Honeymoon in Maldives",
    destination: "Maldives",
    days: 6,
    nights: 5,
    price: 185000,
    travelers: 2,
    rating: 5,
    description: "Ultimate romantic getaway with private villas, sunset cruises, and couple spa treatments.",
    offer_percent: 5,
    package_types: ["Honeymoon", "Luxury"],
    is_featured: false
  },
  
  // Thailand Packages
  {
    title: "Thailand Bangkok & Phuket Adventure",
    destination: "Thailand",
    days: 6,
    nights: 5,
    price: 38000,
    travelers: 12,
    rating: 5,
    description: "Discover vibrant Bangkok temples, stunning beaches of Phuket, and authentic Thai culture.",
    offer_percent: 20,
    package_types: ["Adventure", "Beach Vacation"],
    is_featured: true
  },
  {
    title: "Thailand Luxury Spa & Resort",
    destination: "Thailand",
    days: 5,
    nights: 4,
    price: 85000,
    travelers: 6,
    rating: 5,
    description: "Indulge in world-class spa treatments, luxury resorts, and gourmet cuisine in Thailand.",
    offer_percent: 10,
    package_types: ["Luxury"],
    is_featured: false
  },
  {
    title: "Budget Thailand Backpacker Trail",
    destination: "Thailand",
    days: 7,
    nights: 6,
    price: 28000,
    travelers: 10,
    rating: 4,
    description: "Explore Thailand on a budget with hostels, street food, and local transportation.",
    offer_percent: 25,
    package_types: ["Budget Friendly", "Adventure"],
    is_featured: false
  },
  
  // Singapore Packages
  {
    title: "Singapore City Explorer",
    destination: "Singapore",
    days: 3,
    nights: 2,
    price: 32000,
    travelers: 8,
    rating: 4,
    description: "Visit modern Singapore with Marina Bay Sands, Gardens by the Bay, and cultural neighborhoods.",
    offer_percent: 12,
    package_types: ["City Tour"],
    is_featured: true
  },
  {
    title: "Singapore & Sentosa Island Luxury",
    destination: "Singapore",
    days: 4,
    nights: 3,
    price: 78000,
    travelers: 6,
    rating: 5,
    description: "Luxury Singapore experience with 5-star hotels, Sentosa Island resort, and fine dining.",
    offer_percent: 8,
    package_types: ["Luxury"],
    is_featured: false
  },
  {
    title: "Singapore Family Fun Package",
    destination: "Singapore",
    days: 4,
    nights: 3,
    price: 45000,
    travelers: 15,
    rating: 4,
    description: "Family-friendly Singapore tour with Universal Studios, zoo, aquarium, and theme parks.",
    offer_percent: 15,
    package_types: ["Family"],
    is_featured: false
  },
  
  // Kerala Packages
  {
    title: "Kerala Backwaters Cruise",
    destination: "Kerala",
    days: 4,
    nights: 3,
    price: 18000,
    travelers: 8,
    rating: 5,
    description: "Experience serene backwater cruises, houseboat stays, and tropical beauty of Kerala.",
    offer_percent: 18,
    package_types: ["Beach Vacation", "Cultural"],
    is_featured: true
  },
  {
    title: "Kerala Wellness & Ayurveda Retreat",
    destination: "Kerala",
    days: 7,
    nights: 6,
    price: 55000,
    travelers: 6,
    rating: 5,
    description: "Rejuvenate with authentic Ayurvedic treatments, yoga, and wellness programs in Kerala.",
    offer_percent: 12,
    package_types: ["Luxury"],
    is_featured: false
  },
  {
    title: "Kerala Family Heritage Tour",
    destination: "Kerala",
    days: 5,
    nights: 4,
    price: 28000,
    travelers: 12,
    rating: 4,
    description: "Explore Kerala's rich heritage with temple visits, spice plantations, and local communities.",
    offer_percent: 15,
    package_types: ["Family", "Cultural"],
    is_featured: false
  }
];

async function addPackages() {
  try {
    console.log('Connecting to database...');
    
    for (const pkg of packages) {
      try {
        const result = await db.query(
          `INSERT INTO packages
          (title, destination, days, nights, price, travelers, rating, description, 
           package_types, offer_percent, status, agent_id, is_featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id`,
          [
            pkg.title,
            pkg.destination,
            pkg.days,
            pkg.nights,
            pkg.price,
            pkg.travelers,
            pkg.rating,
            pkg.description,
            JSON.stringify(pkg.package_types),
            pkg.offer_percent,
            'approved',
            1, // agent_id
            pkg.is_featured
          ]
        );
        
        console.log(`✓ Added: ${pkg.title} (ID: ${result.rows[0].id})`);
      } catch (err) {
        console.error(`✗ Error adding ${pkg.title}:`, err.message);
      }
    }
    
    console.log('\n✓ All packages added successfully!');
    await db.end();
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
}

addPackages();
