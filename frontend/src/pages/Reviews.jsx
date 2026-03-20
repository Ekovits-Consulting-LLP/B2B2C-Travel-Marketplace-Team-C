import React, { useState } from "react";
import "../styles/Reviews.css";
import {cust_reviews} from "../data/mockData";

import {
  Search,
  Filter,
  Star,
  ThumbsUp,
  Share2,
  Flag
} from "lucide-react";


function Reviews(){
  const [activeFilter,setActiveFilter] = useState("all");

const renderStars=(count)=>{
return(
<div className="review-stars">
{[...Array(5)].map((_,i)=>(
<Star
key={i}
className={i < count ? "star filled" : "star"}
/>
))}
</div>
)
}

return(

<div className="reviews-page">

{/* HERO */}

<section className="review-hero">
  <div className="review-hero-content">

    <h1>Customer Reviews</h1>

    <p>
      Read authentic reviews from travelers who've experienced our tours
    </p>

    <div className="search-wrapper">
      <Search className="search-icon"/>
      <input
        type="text"
        placeholder="Search reviews by tour name or destination..."
      />
    </div>

  </div>
</section>


{/* MAIN CONTENT */}

<section className="reviews-container">

{/* FILTER CARD */}

<div className="filter-card">

<div className="filter-title">
<Filter size={18}/>
<span>Filters</span>
</div>

<div className="rating-summary">

<h2>4.7</h2>

<div className="stars">
<Star className="star filled"/>
<Star className="star filled"/>
<Star className="star filled"/>
<Star className="star filled"/>
<Star className="star"/>
</div>

<p>2847 reviews</p>

</div>


<div className="rating-bars">

<div className="rating-row">
<span>5 star</span>
<div className="bar"><div style={{width:"65%"}}></div></div>
<span>1823</span>
</div>

<div className="rating-row">
<span>4 star</span>
<div className="bar"><div style={{width:"30%"}}></div></div>
<span>742</span>
</div>

<div className="rating-row">
<span>3 star</span>
<div className="bar"><div style={{width:"10%"}}></div></div>
<span>189</span>
</div>

<div className="rating-row">
<span>2 star</span>
<div className="bar"><div style={{width:"4%"}}></div></div>
<span>62</span>
</div>

<div className="rating-row">
<span>1 star</span>
<div className="bar"><div style={{width:"2%"}}></div></div>
<span>31</span>
</div>

</div>

<hr/>

<div className="review-type">

<h4>Review Type</h4>

<button
className={`review-btn ${activeFilter === "all" ? "active" : ""}`}
onClick={()=>setActiveFilter("all")}
>
All Reviews
</button>

<button
className={`review-btn ${activeFilter === "verified" ? "active" : ""}`}
onClick={()=>setActiveFilter("verified")}
>
Verified Purchases
</button>

<button
className={`review-btn ${activeFilter === "recent" ? "active" : ""}`}
onClick={()=>setActiveFilter("recent")}
>
Recent Reviews
</button>

</div>

<button className="clear-btn">Clear Filters</button>

</div>


{/* REVIEWS LIST */}

<div className="reviews">

<div className="reviews-header">

<h2>All Reviews (8)</h2>

<select className="sort-select">
<option>Most Recent</option>
<option>Highest Rated</option>
<option>Lowest Rated</option>
<option>Most Helpful</option>
</select>

</div>


{cust_reviews.map((r,index)=>(
<div className="review-card" key={index}>

<img
src={r.image}
alt="tour"
className="tour-img"
/>

<div className="review-main">

<div className="review-top">

<div className="user">

<div className="avatar">{r.initials}</div>

<div>

<h4>
{r.name}
<span className="verified">
Verified Purchase
</span>
</h4>

<p className="date">{r.date}</p>

</div>

</div>

{renderStars(r.rating)}

</div>

<p className="tour">
Tour: <span>{r.tour}</span>
</p>

<h3>{r.title}</h3>

<p className="review-text">{r.text}</p>

<div className="review-actions">

<span>
<ThumbsUp size={16}/> Helpful (24)
</span>

<span>
<Share2 size={16}/> Share
</span>

<span>
<Flag size={16}/> Report
</span>

</div>

</div>

</div>
))}


</div>

</section>
<div className="load-more-wrapper">
  <button className="load-more">
    Load More Reviews
  </button>
</div>


</div>

)
}

export default Reviews;