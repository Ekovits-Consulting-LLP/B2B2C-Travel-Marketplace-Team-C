// ===============================
// AGENTS
// ===============================

export const mockAgents = [
  {
    id: "agent-1",
    name: "Wanderlust Travels",
    email: "contact@wanderlust.com",
    rating: 4.8,
    totalPackages: 25,
    totalBookings: 150,
    status: "approved",
    joinedDate: "2024-01-15",
    phone: "+1-555-0101",
    logo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop"
  },
  {
    id: "agent-2",
    name: "Global Adventures",
    email: "info@globaladventures.com",
    rating: 4.6,
    totalPackages: 18,
    totalBookings: 95,
    status: "approved",
    joinedDate: "2024-02-20",
    phone: "+1-555-0102",
    logo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop"
  },
  {
    id: "agent-3",
    name: "Luxury Escapes",
    email: "hello@luxuryescapes.com",
    rating: 4.9,
    totalPackages: 12,
    totalBookings: 78,
    status: "approved",
    joinedDate: "2024-03-10",
    phone: "+1-555-0103",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop"
  }
];


// ===============================
// DESTINATIONS
// ===============================

export const destinations = [
  {
    name: "Dubai, UAE",
    image: "images/destinations/dubai-uae.jpg"
  },
  {
    name: "Bali, Indonesia",
    image: "images/destinations/bali.jpg"
  },
  {
    name: "Manali, India",
    image: "images/destinations/manali-india.jpg"
  },
  {
    name: "Paris, France",
    image: "images/destinations/paris-france.jpg"
  },
  {
    name: "Maldives",
    image: "images/destinations/maldives.jpg"
  },
  {
    name: "Thailand",
    image: "images/destinations/thailand.jpg"
  },
  {
    name: "Singapore",
    image: "images/destinations/singapore.jpg"
  },
  {
    name: "Kerala, India",
    image: "images/destinations/kerala-india.jpg"
  }
];


// ===============================
// PACKAGES
// ===============================


export const mockPackages = [
{
id: "pkg-1",
title: "Dubai Luxury Experience",
destination: "Dubai, UAE",
image: "images/packages/dubai-luxury.jpg",


days: "5D/4N",
people: "Up to 6",

rating: 4.7,


price: 1299,
oldPrice: 1599,
save: 300,
discount: 19,

trend: 89
},

{
id: "pkg-2",
title: "Bali Paradise Retreat",
destination: "Bali, Indonesia",
image:"images/packages/bali-paradise.jpg" ,


days: "7D/6N",
people: "Up to 4",

rating: 4.8,

price: 899,
oldPrice: 1199,
save: 300,
discount: 25,

trend: 124
},

{
id: "pkg-3",
title: "Maldives Luxury Honeymoon",
destination: "Maldives",
image: "images/packages/bali-paradise.jpg",


days: "5D/4N",
people: "Up to 2",

rating: 4.9,

price: 2499,
oldPrice: 2999,
save: 500,
discount: 17,

trend: 78
},

{
id: "pkg-4",
title: "European Dream Tour",
destination: "Europe (Paris, Rome, Swiss)",
image:"images/packages/europe.jpg" ,

days: "12D/11N",
people: "Up to 10",

rating: 4.9,


price: 3499,
oldPrice: 3999,
save: 500,
discount: 13,

trend: 156
},

{
id: "pkg-5",
title: "Goa Beach Holiday",
destination: "Goa, India",

price: 299,
oldPrice: 399,
save: 100,

days: "4D/3N",
people: "Up to 5",

rating: 4.2,

image: "images/packages/goaa.jpg",
discount: 10
}


];
// ===============================
// BOOKINGS
// ===============================

export const mockBookings = [
  {
    id: "book-1",
    packageId: "pkg-1",
    packageTitle: "Dubai Luxury Experience",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    travelers: 2,
    totalPrice: 2598,
    bookingDate: "2026-02-15",
    travelDate: "2026-04-10",
    status: "confirmed",
    paymentStatus: "paid"
  },
  {
    id: "book-2",
    packageId: "pkg-2",
    packageTitle: "Bali Paradise Retreat",
    customerName: "Sarah Smith",
    customerEmail: "sarah@example.com",
    travelers: 2,
    totalPrice: 1798,
    bookingDate: "2026-02-20",
    travelDate: "2026-05-15",
    status: "confirmed",
    paymentStatus: "paid"
  }
];

// ===============================
// DEALS PAGE
// ===============================
 //reviews
export const reviews = [
  {
    tag: "Women's Special",
    title: "Women's Special Bhubaneswar Puri Konark Chilika",
    description:
      "AWESOME... We had great time from day 1 till last day.. Our tour manager Sagar Chachad and Vivek Chafekar were very friendly, very enthusiastic and supportive throughout the journey.",
    name: "Apeksha",
    manager: "Sagar Chachad, Vivek Chafekar"
  },
  {
    tag: "Women's Special",
    title: "Women's Special Bhubaneswar Puri Konark Chilika",
    description:
      "As it was my first trip with Veena, I was skeptical at first about how it will go. But with each passing day after the booking, I got more confident and the trip turned out to be amazing.",
    name: "Sayalee",
    manager: "Sagar Chachad, Vivek Chafekar"
  },
  {
    tag: "Family",
    title: "Best of Andaman",
    description:
      "We had a wonderful experience throughout the trip. Everything was managed so smoothly and professionally, and every small need was taken care of. Truly memorable vacation.",
    name: "Prachi",
    manager: "Nimkesh Patil"
  },

  {
    tag: "Family",
    title: "Amazing Dubai Experience",
    description:
      "The Dubai tour was perfectly organized with great hotel stays and sightseeing. The desert safari and Burj Khalifa visit were highlights of our trip. Everything was hassle-free.",
    name: "Rohit",
    manager: "Ankit Sharma"
  },


  {
    tag: "Women's Special",
    title: "Kerala Backwaters Delight",
    description:
      "Kerala trip was absolutely beautiful with scenic views and peaceful houseboat stay. The tour manager ensured comfort and safety throughout. Highly recommended for relaxing vacation.",
    name: "Neha",
    manager: "Pooja Mehta"
  }
];

//DEALS 

export const deals = [
{
title:"10-Day Ultimate Ireland Small Group Tour",
days:"10 days",
rating:"4.8",
reviews:158,
old:"Rs. 3,651",
price:"Rs. 3,103",
discount:"-15% OFF",
img:"images/deals/ireland.jpg",
},
{
title:"5-Day Escape to the South West Small-Group Tour from Dublin",
days:"5 days",
rating:"4.8",
reviews:190,
old:"Rs. 1,303",
price:"Rs. 1,173",
discount:"-10% OFF",
img:"images/deals/dublin.jpg",
},
{
title:"Highlights of Cliffs of Moher, Ring of Kerry & Ireland's South West",
days:"5 days",
rating:"5.0",
reviews:1,
old:"Rs. 2,450",
price:"Rs. 1,568",
discount:"-36% OFF",
img:"images/deals/kerry.jpg",
},
{
title:"Best of UK & Ireland",
days:"13 days",
rating:"4.7",
reviews:423,
old:"Rs. 4,030",
price:"Rs. 3,125",
discount:"-22% OFF",
img:"images/deals/uk.jpg",
}
];

// WORLD DEALS DATA

export const worldDeals = [
{
title: "Europe",
deals: "4,113 deals",
discount: "UP TO 53% OFF",
img:"images/worldwide-deals/europe.jpg",
},
{
title: "Asia",
deals: "3,767 deals",
discount: "UP TO 70% OFF",
img: "images/worldwide-deals/asia.jpg",
},
{
title: "Africa",
deals: "1,934 deals",
discount: "UP TO 62% OFF",
img: "images/worldwide-deals/africa.jpg",
},
{
title: "Australia/Oceania",
deals: "213 deals",
discount: "UP TO 30% OFF",
img: "images/worldwide-deals/australia.jpg",
},
{
title: "Latin America",
deals: "961 deals",
discount: "UP TO 50% OFF",
img: "images/worldwide-deals/latin-america.jpg",
},
{
title: "North America",
deals: "270 deals",
discount: "UP TO 40% OFF",
img: "images/worldwide-deals/north-america.jpg",
}
];

//destinations data for deals page
export const destinations_deal = [
{ name:"Anywhere", deal:"up to 70% Off"},
{ name:"North America", deal:"up to 40% Off"},
{ name:"Australia/Oceania", deal:"up to 30% Off"},
{ name:"India", deal:"up to 70% Off"},
{ name:"Bhutan", deal:"up to 70% Off"},
{ name:"Egypt", deal:"up to 62% Off"}
];

// ===============================
// REVIEWS PAGE
// ===============================


export const cust_reviews = [
{
name:"Sarah Mitchell",
date:"February 2026",
tour:"Ultimate European Adventure",
title:"Absolutely unforgettable experience!",
text:"This tour exceeded all my expectations. From the moment we met our guide Jacques in Paris, everything was perfectly organized. The hotels were centrally located and comfortable, and the balance between guided activities and free time was just right. The highlight for me was definitely the Sagrada Familia in Barcelona – our guide’s passion for architecture made it even more special.",
initials:"SM",
rating:5,
image:"images/cust_review/SM.jpg"
},

{
name:"Michael Rodriguez",
date:"January 2026",
tour:"Ultimate European Adventure",
title:"Great tour with minor issues",
text:"Overall a fantastic experience! The itinerary covered all the major sights without feeling rushed. Our guide was knowledgeable and friendly. The only reason I'm not giving 5 stars is that one of our hotels in Rome was a bit dated and the breakfast options were limited. However, the tour company was very responsive when we mentioned it.",
initials:"MR",
rating:4,
image:"images/cust_review/MR.jpg"
},

{
name:"Emily Chen",
date:"December 2025",
tour:"Asian Highlights Tour",
title:"Perfect first-time Asia trip!",
text:"As someone who had never been to Asia before, this tour was the perfect introduction. I was initially worried about traveling alone, but the group was so welcoming. The pace was just right – busy enough to see everything but with enough downtime to rest. The included meals were delicious and gave us a taste of authentic local cuisine.",
initials:"EC",
rating:5,
image:"images/cust_review/EC.jpg"
},

{
name:"James Thompson",
date:"November 2025",
tour:"South American Explorer",
title:"Exceeded expectations in every way",
text:"My wife and I have been on many tours, and this one ranks among the best. The attention to detail was impressive – from the skip-the-line tickets at major attractions to the carefully selected restaurants. The group dynamics were excellent, and we made friends we’re still in touch with. Worth every penny!",
initials:"JT",
rating:5,
image:"images/cust_review/JT.jpg"
},

{
name:"Lisa Patel",
date:"October 2025",
tour:"Mediterranean Discovery",
title:"Wonderful tour, highly recommend",
text:"This was my dream trip and it didn't disappoint! The itinerary was well-paced and covered all the must-see sights. Our guide was fantastic – entertaining, informative, and always ready to help. I especially loved the small group size which made everything more personal.",
initials:"LP",
rating:4,
image:"images/cust_review/LP.jpg"
},

{
name:"David Kim",
date:"September 2025",
tour:"African Safari Adventure",
title:"Once in a lifetime experience",
text:"The safari was absolutely breathtaking. Seeing wildlife in their natural habitat was something I'll never forget. Our guide's knowledge of animal behavior was incredible and made every game drive exciting. The accommodations were luxurious and the food was outstanding.",
initials:"DK",
rating:5,
image:"images/cust_review/DK.jpg"
},

{
name:"Rachel Green",
date:"August 2025",
tour:"Scandinavian Wonders",
title:"Beautiful scenery and amazing culture",
text:"Scandinavia was stunning! From the fjords in Norway to the design culture in Copenhagen, every day brought new wonders. The tour was well-organized with excellent hotels and knowledgeable guides. The Northern Lights viewing was the cherry on top. Highly recommend for nature lovers.",
initials:"RG",
rating:5,
image:"images/cust_review/RC.jpg"
},

{
name:"Tom Wilson",
date:"July 2025",
tour:"Australian Outback Expedition",
title:"Great adventure with amazing landscapes",
text:"The Australian outback is truly spectacular. Our tour covered Uluru, the Great Barrier Reef, and Sydney – an amazing mix of natural wonders and city life. The only minor complaint was that some days felt a bit rushed. But overall, an incredible experience with a great group of fellow travelers.",
initials:"TW",
rating:4,
image:"images/cust_review/TW.jpg"
}
];