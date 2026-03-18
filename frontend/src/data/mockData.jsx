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

//videos
export const videos = [
{
name: "Lori",
initials: "LR",
video: "videos/balloon-travel.mp4",
thumbnail:"images/videos-thumbnail/european cities.jpg",
title: "Exploring European Cities"
},


{
name: "Carol",
initials: "CK",
video: "videos/airport.mp4",
thumbnail: "images/videos-thumbnail/city-explore.jpg",
title: "City Exploration"
},
{
name: "Paul",
initials: "PL",
video: "videos/coastal.mp4",
thumbnail: "images/videos-thumbnail/coastal.jpg",
title: "Coastal Travel Journey"
},
{
name: "Lisa",
initials: "LS",
video: "videos/road-trip.mp4",
thumbnail:"images/videos-thumbnail/road-trip.jpg",
title: "Road Trip Adventure"
}
];

//DEALS 

export const deals = [
{
title:"10-Day Ultimate Ireland Small Group Tour",
days:"10 days",
rating:"4.8",
reviews:158,
old:"$3,651",
price:"$3,103",
discount:"-15% OFF",
img:"images/deals/ireland.jpg",
},
{
title:"5-Day Escape to the South West Small-Group Tour from Dublin",
days:"5 days",
rating:"4.8",
reviews:190,
old:"$1,303",
price:"$1,173",
discount:"-10% OFF",
img:"images/deals/dublin.jpg",
},
{
title:"Highlights of Cliffs of Moher, Ring of Kerry & Ireland's South West",
days:"5 days",
rating:"5.0",
reviews:1,
old:"$2,450",
price:"$1,568",
discount:"-36% OFF",
img:"images/deals/kerry.jpg",
},
{
title:"Best of UK & Ireland",
days:"13 days",
rating:"4.7",
reviews:423,
old:"$4,030",
price:"$3,125",
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