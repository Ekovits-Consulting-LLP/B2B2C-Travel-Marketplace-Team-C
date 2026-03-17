import React, { useState, useEffect,useRef  } from "react";
import { MapPin, Calendar, Users, Search, ChevronDown,Star } from "lucide-react";
import { deals, videos, worldDeals } from "../data/mockData";



export default function Deals(){

const containerRef = useRef(null);

const scrollLeft = () => {
containerRef.current.scrollBy({
left: -400,
behavior: "smooth"
});
};

const scrollRight = () => {
containerRef.current.scrollBy({
left: 400,
behavior: "smooth"
});
};

const [time,setTime] = useState(129356);

useEffect(()=>{
const timer = setInterval(()=>{
setTime(prev => prev > 0 ? prev - 1 : 0);
},1000);
return ()=> clearInterval(timer);
},[]);

const days = Math.floor(time/86400);
const hours = Math.floor((time%86400)/3600);
const minutes = Math.floor((time%3600)/60);
const seconds = time%60;

const [destination,setDestination] = useState("Select Continent or Country");
const [date,setDate] = useState("");

const [showDest,setShowDest] = useState(false);
const [showTravellers,setShowTravellers] = useState(false);

const [adults,setAdults] = useState(2);
const [children,setChildren] = useState(0);

const destinations = [
{ name:"North America", deal:"up to 40% Off"},
{ name:"Australia/Oceania", deal:"up to 30% Off"},
{ name:"India", deal:"up to 70% Off"},
{ name:"Bhutan", deal:"up to 70% Off"},
{ name:"Egypt", deal:"up to 62% Off"}
];

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

{/* SEARCH BAR */}

<div className="deals-search-bar">

{/* DESTINATION */}

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


{/* DATE */}

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


{/* TRAVELLERS */}

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


{/* SEARCH BUTTON */}

<button className="deals-search-btn" onClick={handleSearch}>
<Search size={18}/>
Search deals
</button>

</div>

</div>

</section>
{/* TOP DEALS */}

<section className="deals-top-section">

<div className="deals-top-header">

<h2>Top Deals</h2>

<button className="deals-view-btn">
See All Tours
</button>

</div>

<div className="deals-top-grid">

{deals.map((d,i)=>(

<div className="deals-card" key={i}>

<div className="deals-card-image">

<img src={d.img} alt=""/>

<span className="deals-discount">
{d.discount}
</span>

</div>

<h3 className="deals-card-title">
{d.title}
</h3>

<p className="deals-meta">

{d.days}

<span className="deals-dot">•</span>

{d.rating}

<Star size={14} fill="#f59e0b" color="#f59e0b"/>

<span className="deals-reviews">
({d.reviews})
</span>

</p>

<p className="deals-old">
From <span>{d.old}</span>
</p>

<p className="deals-price">
{d.price}
</p>

</div>

))}

</div>

</section>

{/*Authentic Traveller Moments */}

<section className="moments">

<div className="moments-header">

<h2>Authentic Traveller Moments</h2>

<div className="controls">

<button onClick={scrollLeft}>❮</button>

<button onClick={scrollRight}>❯</button>

<button className="see-more">See More</button>

</div>

</div>

<div className="video-scroll" ref={containerRef}>

{videos.map((item, index) => (

<div className="video-card" key={index}>

<video
poster={item.thumbnail}
controls
className="video"
>

<source src={item.video} type="video/mp4" />

</video>

<div className="video-top">

<div className="avatar">{item.initials}</div>

<span>{item.name}</span>

</div>

<div className="video-bottom">

<p>{item.title}</p>

</div>

</div>

))}

</div>

</section>

{/* WORLDWIDE DEALS */}

<section className="world-deals">

<h2 className="world-title">Worldwide deals</h2>



{/* CARD */}
<div className="world-grid">

{worldDeals.map((item, index) => (

<div className="world-card" key={index}>

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

{/* ADVENTURE SIMPLIFIED */}

<section className="adventure">

<div className="adventure-container">

{/* LEFT CONTENT */}
<div className="adventure-left">

<h2>Adventure Simplified</h2>

<h4>Adventure at Your Fingertips</h4>

<p>
The TravelHub mobile app puts adventure in your pocket. Explore thousands of trips,
receive real-time updates, and manage bookings effortlessly. Your next adventure is just a tap away.
</p>

<p className="adventure-sub">
Download the TravelHub app and enjoy app-exclusive perks:
</p>

<ul className="adventure-list">
<li>🌍 Book 50,000+ multi-day tours, safaris, river cruises, and more</li>
<li>🎁 Win up to $3,000 every month in app-only giveaways</li>
<li>🔥 Save up to 50% with app-exclusive deals</li>
</ul>

</div>

{/* RIGHT IMAGE */}
<div className="adventure-right">

<div className="adventure-card">

<h3>One app<br/>for your entire trip</h3>

<div className="store-buttons">

<img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="appstore"/>

<img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="playstore"/>

</div>


</div>

</div>

</div>

</section>
</div>


);
}