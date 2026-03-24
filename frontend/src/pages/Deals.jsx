import React, { useState, useEffect, useRef } from "react";
import "../styles/Deals.css";
import "../styles/Home.css";
import { MapPin, Calendar, Users, Search, ChevronDown, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { worldDeals } from "../data/mockData";
import Footer from "../components/Footer";

export default function Deals(){

const containerRef = useRef(null);
const navigate = useNavigate();

const [packages, setPackages] = useState([]);
const [expandedIndex, setExpandedIndex] = useState(null);

const [time,setTime] = useState(129356);
const [destination,setDestination] = useState("Select Continent or Country");
const [date,setDate] = useState("");

const [showDest,setShowDest] = useState(false);
const [showTravellers,setShowTravellers] = useState(false);

const [adults,setAdults] = useState(2);
const [children,setChildren] = useState(0);

const [selectedContinent, setSelectedContinent] = useState(null);

const [savedPackages, setSavedPackages] = useState([]);

useEffect(() => {
  const storedSaved = localStorage.getItem('savedPackages');
  if (storedSaved) {
    try { setSavedPackages(JSON.parse(storedSaved)); } catch (e) { setSavedPackages([]); }
  }
}, []);

const toggleSave = (id) => {
  let updated;
  if (savedPackages.includes(id)) {
    updated = savedPackages.filter((pid) => pid !== id);
  } else {
    updated = [...savedPackages, id];
  }
  setSavedPackages(updated);
  localStorage.setItem('savedPackages', JSON.stringify(updated));
};

const isSaved = (id) => savedPackages.includes(id);

const destinations = [
{ name:"North America", deal:"up to 40% Off"},
{ name:"Australia/Oceania", deal:"up to 30% Off"},
{ name:"Europe", deal:"up to 53% Off"},
{ name:"India", deal:"up to 70% Off"},
{ name:"Bhutan", deal:"up to 70% Off"},
{ name:"Egypt", deal:"up to 62% Off"}
];

const reviews = [
{
tag:"Women's Special",
title:"Women's Special Bhubaneswar Puri Konark Chilika",
description:"It was a very well organised trip. Everything was smooth and perfectly managed.",
name:"Apeksha",
manager:"Sagar Chachad, Vivek Chafekar"
},
{
tag:"Women's Special",
title:"Women's Special Bhubaneswar Puri Konark Chilika",
description:"Amazing travel experience. The whole tour was handled professionally.",
name:"Sayalee",
manager:"Sagar Chachad, Vivek Chafekar"
},
{
tag:"Family Special",
title:"Best of Andaman",
description:"Great travel experience with perfect planning and arrangements.",
name:"Prachi",
manager:"Nimkesh Patil"
}
];

useEffect(()=>{
const timer = setInterval(()=>{
setTime(prev => prev > 0 ? prev - 1 : 0);
},1000);
return ()=> clearInterval(timer);
},[]);

useEffect(() => {
  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/deals");
      const data = await res.json();
      const processedPackages = data.map(pkg => ({
        ...pkg,
        final_price: pkg.offer_percent > 0 
          ? Number(pkg.price) - (Number(pkg.price) * Number(pkg.offer_percent) / 100)
          : Number(pkg.price),
        oldPrice: pkg.offer_percent > 0 ? Number(pkg.price) : null,
        save: pkg.offer_percent > 0 
          ? Number(pkg.price) - (Number(pkg.price) - (Number(pkg.price) * Number(pkg.offer_percent) / 100))
          : 0,
        discount: pkg.offer_percent || 0,
        duration: `${pkg.days || 0}D/${pkg.nights || 0}N`
      }));
      setPackages(processedPackages);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  fetchPackages();
}, []);

const filteredPackages = selectedContinent ? packages.filter(pkg => pkg.destination.toLowerCase().includes(selectedContinent.toLowerCase())) : packages;

const scrollLeft = () => {
if(containerRef.current){
const width = containerRef.current.clientWidth;
containerRef.current.scrollBy({
left: -width,
behavior: "smooth"
});
}
};

const scrollRight = () => {
if(containerRef.current){
const width = containerRef.current.clientWidth;
containerRef.current.scrollBy({
left: width,
behavior: "smooth"
});
}
};

const days = Math.floor(time/86400);
const hours = Math.floor((time%86400)/3600);
const minutes = Math.floor((time%3600)/60);
const seconds = time%60;

const handleSearch = ()=>{
alert(`Searching deals for ${destination}`);
};

return(

<div>

<section className="deals-hero">

<div className="deals-hero-overlay">

<div className="deals-countdown">
{days}D {hours}H {minutes}M {seconds}S
</div>

<h1 className="deals-title">Deals of The Week</h1>

<p className="deals-subtitle">
Save up to 50% on trips to Ireland, England, Scotland
</p>

<div className="deals-search-bar">

<div className="deals-search-item" onClick={()=>setShowDest(!showDest)}>

<div className="deals-search-left">
<MapPin size={18}/>
<span>{destination}</span>
</div>

<ChevronDown size={16}/>

{showDest && (

<div className="deals-dropdown">

{destinations.map((d,i)=>(

<div
key={i}
className="deals-dropdown-item"
onClick={(e)=>{
e.stopPropagation();
setDestination(d.name);
setShowDest(false);
}}
>

<span>{d.name}</span>
<span className="deals-deal">{d.deal}</span>

</div>

))}

</div>

)}

</div>

<div className="deals-search-item">

<div className="deals-search-left">
<Calendar size={18}/>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>

</div>

<ChevronDown size={16}/>

</div>

<div
className="deals-search-item"
onClick={()=>setShowTravellers(!showTravellers)}
>

<div className="deals-search-left">
<Users size={18}/>
<span>{adults} Adults</span>
</div>

<ChevronDown size={16}/>

{showTravellers && (

<div className="deals-traveller-box">

<h3>Who is travelling?</h3>

<div className="deals-traveller-row">

<div>
<p>Adults</p>
<span>Ages 18 or above</span>
</div>

<div className="deals-counter">

<button onClick={(e)=>{
e.stopPropagation();
setAdults(Math.max(1,adults-1));
}}>-</button>

<span>{adults}</span>

<button onClick={(e)=>{
e.stopPropagation();
setAdults(adults+1);
}}>+</button>

</div>

</div>

<div className="deals-traveller-row">

<div>
<p>Children</p>
<span>Under 18</span>
</div>

<div className="deals-counter">

<button onClick={(e)=>{
e.stopPropagation();
setChildren(Math.max(0,children-1));
}}>-</button>

<span>{children}</span>

<button onClick={(e)=>{
e.stopPropagation();
setChildren(children+1);
}}>+</button>

</div>

</div>

<button
className="deals-apply-btn"
onClick={(e)=>{
e.stopPropagation();
setShowTravellers(false);
}}
>
Apply
</button>

</div>

)}

</div>

<button className="deals-search-btn" onClick={handleSearch}>
<Search size={18}/>
Search deals
</button>

</div>

</div>

</section>


<section className="deals-top-section">

<div className="deals-top-header">

<h2>Top Deals{selectedContinent ? ` in ${selectedContinent}` : ''}</h2>

<div style={{display: 'flex', gap: '10px'}}>
{selectedContinent && (
<button className="deals-view-btn" onClick={() => setSelectedContinent(null)}>
Show All Deals
</button>
)}
<button className="deals-view-btn" onClick={() => navigate("/packagespecific")}>
See All Tours
</button>
</div>

</div>

<div className="deals-top-grid">

{filteredPackages.map((d,i)=>(

<div
className="travel-card"
key={i}
onClick={() => navigate(`/package/${d.id}`)}
style={{ cursor: "pointer" }}
>

<div className="travel-image">

<img
src={
d.images && d.images.length > 0
? `/uploads/${d.images[0]}`
: "https://via.placeholder.com/400x300"
}
alt={d.title}
/>

<span className="deals-discount">
{d.offer_percent || 20}% OFF
</span>

</div>

{/* BODY */}
<div className="travel-body">

<h3 className="title">{d.title}</h3>

<p className="location">
<MapPin size={14}/> {d.destination}
</p>

{/* RATING */}
<div className="rating-box">
<span className="rating-star">
<Star size={14} /> {d.rating || 5}
</span>
<span className="rating-value">/ 5</span>
</div>

{/* PRICE */}
<div className="price-section">

<div className="price-left">
<p className="starting">Starting from</p>
<div className="price-row">
<span className="price">
₹{Number(d.final_price || d.price).toLocaleString("en-IN")}
</span>
{d.oldPrice && (
<span className="old-price">
Rs. {Number(d.oldPrice).toLocaleString("en-IN")}
</span>
)}
</div>
<p className="per">per person</p>
</div>

{d.save > 0 && (
<div className="save-box">
<p>You save</p>
<span className="save">
Rs. {Number(d.save).toLocaleString("en-IN")}
</span>
</div>
)}

</div>

{/* BUTTONS */}
<div className="card-buttons">
<button className="details-btn" onClick={(e)=>{
e.stopPropagation();
navigate(`/package/${d.id}`);
}}>
Book Now
</button>
<button
className={`download-btn ${isSaved(d.id) ? 'saved' : ''}`}
onClick={(e) => {
e.stopPropagation();
toggleSave(d.id);
}}
aria-label={isSaved(d.id) ? 'Unsave' : 'Save'}
>
<Heart size={24} color={isSaved(d.id) ? '#e11d48' : '#6b7280'} fill={isSaved(d.id) ? '#e11d48' : 'none'} />
</button>
</div>

</div>

</div>

))}

</div>

</section>


<section className="veena-reviews">

<h1 className="vr-title">Authentic Traveller Reviews</h1>

<p className="vr-subtitle">
What are you waiting for? Chalo Bag Bharo Nikal Pado!
</p>

<div className="vr-wrapper">

<button className="vr-arrow left" onClick={scrollLeft}>❮</button>

<div className="vr-container" ref={containerRef}>

{reviews.map((item,index)=>{

const isExpanded = expandedIndex === index;

return(

<div className="vr-card" key={index}>

<div className="vr-rating">
<Star size={16}/>
<span className="vr-rate">5</span>
<span className="vr-tag">{item.tag}</span>
</div>

<h3 className="vr-heading">{item.title}</h3>

<p className={`vr-text ${isExpanded ? "expanded" : ""}`}>
"{item.description}"
</p>

<span
className="vr-read"
onClick={()=>setExpandedIndex(isExpanded ? null : index)}
>
{isExpanded ? "Read less" : "Read more"}
</span>

<div className="vr-footer">

<div>
<p className="vr-name">{item.name}</p>
<span className="vr-date">Travelled in Mar, 2026</span>
</div>

<div className="vr-manager">
<div className="icon-circle">
<Users size={14}/>
</div>
<span>{item.manager}</span>
</div>

</div>

</div>

);

})}

</div>

<button className="vr-arrow right" onClick={scrollRight}>❯</button>

</div>
<div className="vr-btn-wrapper">
<button className="vr-btn" onClick={() => navigate('/reviews')}>Read more Reviews</button>
</div>

</section>


<section className="world-deals">

<h2 className="world-title">Worldwide deals</h2>

<div className="world-grid">

{worldDeals.map((item,index)=>(
<div className="world-card" key={index} onClick={() => setSelectedContinent(item.title)} style={{cursor: 'pointer'}}>

<img src={item.img} alt={item.title}/>

<span className="deal-badge">
{item.discount}
</span>

<div className="world-overlay">

<h3>{item.title}</h3>

<span className="deals-count">
{item.deals} →
</span>

</div>

</div>
))}

</div>

</section>

<section className="adventure">

<div className="adventure-container">

<div className="adventure-left">

  <h2>Adventure Simplified</h2>

  <h4>Adventure at Your Fingertips</h4>

  <p>
  The TravelHub mobile app puts adventure in your pocket. Explore thousands of trips,</p>
  <p>receive real-time updates, and manage bookings effortlessly.</p>
  <p>Your next adventure is just a tap away.</p>

  <p className="adventure-sub">
  Download the TravelHub app and enjoy app-exclusive perks:
  </p>

  <ul className="adventure-list">
  <li>🌍 Book 50,000+ multi-day tours, safaris, river cruises, and more</li>
  <li>🎁 Win up to Rs.3,000 every month in app-only giveaways</li>
  <li>🔥 Save up to 50% with app-exclusive deals</li>
  </ul>

  </div>





</div>

</section>

<Footer/>

</div>

);
}