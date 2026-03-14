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

agentName: "Wanderlust Travels",
provider: "Wanderlust Travels",
agentRating: 4.7,
providerRating: 4.3,

days: "5D/4N",
people: "Up to 6",

rating: 4.7,
reviews: 89,

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

agentName: "Global Adventures",
provider: " Global Adventures",
agentRating: 4.8,
providerRating: 3.6,

days: "7D/6N",
people: "Up to 4",

rating: 4.8,
reviews: 124,

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

agentName: "Luxury Escapes",
provider: "Luxury Escapes",
agentRating: 4.9,
providerRating: 4.2,

days: "5D/4N",
people: "Up to 2",

rating: 4.9,
reviews: 78,

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

agentName: "Wanderlust Travels",
provider: "Wanderlust Travels",
providerRating: 5.0,

agentRating: 4.9,

days: "12D/11N",
people: "Up to 10",

rating: 4.9,
reviews: 156,

price: 3499,
oldPrice: 3999,
save: 500,
discount: 13,

trend: 156
},

{
id: "pkg-5",
agentName: "Budget Getaways",
provider: "Budget Getaways",
providerRating: 4.3,
trending: 44,

title: "Goa Beach Holiday",
destination: "Goa, India",

price: 299,
oldPrice: 399,
save: 100,

days: "4D/3N",
people: "Up to 5",

rating: 4.2,
reviews: 93,

image: "images/packages/goaa.jpg",

featured: false,
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