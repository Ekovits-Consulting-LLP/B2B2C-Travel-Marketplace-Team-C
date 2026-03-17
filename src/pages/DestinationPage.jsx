import Navbar from "../components/Navbar";
import packages from "../data/packages";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {Heart, MapPin, Star, Users, Calendar, Download, Crown, Sparkles, TrendingUp } from "lucide-react";
import { Search } from "lucide-react";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useLocation } from "react-router-dom";



function DestinationPage() {
    const location = useLocation();
const selectedDestination = location.state?.destination || "";
    const [search,setSearch] = useState(selectedDestination);
    
    const [durationFilter,setDurationFilter] = useState([])
    const [priceFilter,setPriceFilter] = useState([])
    const [styleFilter,setStyleFilter] = useState([])
    const [sortOption,setSortOption] = useState("best")
    const handleReset = () => {
    setDurationFilter([])
    setPriceFilter([])
    setStyleFilter([])
    setSortOption("best")
    setSearch("")
}
    
    let filteredPackages = packages.filter(pkg =>
pkg.destination.toLowerCase().includes(search.toLowerCase())
)

/* ===== DURATION FILTER ===== */

if(durationFilter.length){
filteredPackages = filteredPackages.filter(pkg => {

if(durationFilter.includes("short") && pkg.days <= 7) return true
if(durationFilter.includes("medium") && pkg.days >=8 && pkg.days <=14) return true
if(durationFilter.includes("long") && pkg.days >=15) return true

return false

})
}

/* ===== PRICE FILTER ===== */

if(priceFilter.length){
filteredPackages = filteredPackages.filter(pkg => {

if(priceFilter.includes("low") && pkg.price < 1000) return true
if(priceFilter.includes("mid") && pkg.price >=1000 && pkg.price <=2500) return true
if(priceFilter.includes("high") && pkg.price >=2500 && pkg.price <=5000) return true
if(priceFilter.includes("lux") && pkg.price >5000) return true

return false

})
}

/* ===== STYLE FILTER ===== */

if(styleFilter.length){
filteredPackages = filteredPackages.filter(pkg =>
styleFilter.includes(pkg.type)
)
}

const handleCheckbox = (value, list, setList) => {
if(list.includes(value)){
setList(list.filter(v => v !== value))
}else{
setList([...list,value])
}
}
if(sortOption==="low"){
filteredPackages.sort((a,b)=>a.price-b.price)
}

if(sortOption==="high"){
filteredPackages.sort((a,b)=>b.price-a.price)
}

if(sortOption==="rating"){
filteredPackages.sort((a,b)=>b.rating-a.rating)
}

if(sortOption==="duration"){
filteredPackages.sort((a,b)=>b.days-a.days)
}

return (

<div>

<Navbar />
<section className="package-hero">

<div className="container hero-inner">

<h1>Find Your Perfect Package</h1>

<div className="hero-search">

<div className="package-search-input">

<Search size={18} className="package-search-icon"/>

<input 
className="package-search-field"
placeholder="Where do you want to go ?" 
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<button className="search-btn">
Search Packages
</button>

</div>

<div className="hero-tags">

<span>Europe</span>
<span>Asia</span>
<span>Africa</span>
<span>South America</span>
<span>Adventure</span>
<span>Cultural</span>

</div>

</div>

</section>

<div className="container">

<div className="content-layout">

{/* LEFT FILTER */}
<div className="filter-card">

<div className="filter-title">
<h3>Filters</h3>
<div className="filter-setting-icon">
<SlidersHorizontal size={16}/>
</div>
</div>

<div className="filter-section">
<h4>Duration</h4>

<label>
<input
type="checkbox"
checked={durationFilter.includes("short")}
onChange={()=>handleCheckbox("short",durationFilter,setDurationFilter)}
/>
1-7 days
</label>

<label>
<input
type="checkbox"
checked={durationFilter.includes("medium")}
onChange={()=>handleCheckbox("medium",durationFilter,setDurationFilter)}
/>
8-14 days
</label>

<label>
<input
type="checkbox"
checked={durationFilter.includes("long")}
onChange={()=>handleCheckbox("long",durationFilter,setDurationFilter)}
/>
15+ days
</label>

</div>

<div className="filter-section">
<h4>Price Range</h4>

<label>
<input
type="checkbox"
checked={priceFilter.includes("low")}
onChange={()=>handleCheckbox("low",priceFilter,setPriceFilter)}
/>
Under $1000
</label>

<label>
<input
type="checkbox"
checked={priceFilter.includes("mid")}
onChange={()=>handleCheckbox("mid",priceFilter,setPriceFilter)}
/>
$1000 - $2500
</label>

<label>
<input
type="checkbox"
checked={priceFilter.includes("high")}
onChange={()=>handleCheckbox("high",priceFilter,setPriceFilter)}
/>
$2500 - $5000
</label>

<label>
<input
type="checkbox"
checked={priceFilter.includes("lux")}
onChange={()=>handleCheckbox("lux",priceFilter,setPriceFilter)}
/>
$5000+
</label>

</div>
<div className="filter-section">
<h4>Travel Style</h4>

<label>
<input
type="checkbox"
checked={styleFilter.includes("Luxury")}
onChange={()=>handleCheckbox("Luxury",styleFilter,setStyleFilter)}
/>
Luxury
</label>

<label>
<input
type="checkbox"
checked={styleFilter.includes("Family")}
onChange={()=>handleCheckbox("Family",styleFilter,setStyleFilter)}
/>
Family
</label>

<label>
<input
type="checkbox"
checked={styleFilter.includes("Honeymoon")}
onChange={()=>handleCheckbox("Honeymoon",styleFilter,setStyleFilter)}
/>
Honeymoon
</label>

<label>
<input
type="checkbox"
checked={styleFilter.includes("Adventure")}
onChange={()=>handleCheckbox("Adventure",styleFilter,setStyleFilter)}
/>
Adventure
</label>

<label>
<input
type="checkbox"
checked={styleFilter.includes("Couple")}
onChange={()=>handleCheckbox("Couple",styleFilter,setStyleFilter)}
/>
Couple
</label>

</div>
<button className="reset-btn" onClick={handleReset}>
Reset Filters
</button>

</div>

{/* RIGHT SIDE */}
<div className="right-section">

<div className="results-header">

<p className="results-count">
{filteredPackages.length} packages found
</p>

<select
value={sortOption}
className="sort-select"
onChange={(e)=>setSortOption(e.target.value)}
>
<option value="best">Best Match</option>
<option value="low">Price: Low To High</option>
<option value="high">Price: High To Low</option>
<option value="duration">Duration</option>
<option value="rating">Top Rated</option>
</select>
</div>


<div className="cards-grid">

{filteredPackages.length === 0 && (
<p className="no-result">No Search Found</p>
)}

{filteredPackages.map((data)=>{

const saveAmount =
data.oldPrice ? data.oldPrice - data.price : 0;

return(

<div className="card" key={data.id}>
{/* ⭐ KEEP YOUR FULL CARD JSX HERE SAME */}
      {/* IMAGE */}
      <div className="card-image">

        <img src={data.image} alt={data.title} />

        {/* BADGES */}
        <div className="image-badges">

  {data.badge1 === "Featured" && (
    <span className="badge featured">
      ✨ Featured
    </span>
  )}

  {data.badge1 === "Premium" && (
    <span className="badge premium">
      ⭐ Premium
    </span>
  )}

  {data.badge1 === "Budget Friendly" && (
    <span className="badge budget">
      💰 Budget Friendly
    </span>
  )}

  {data.badge2 === "Luxury" && (
    <span className="badge luxury">
      👑 Luxury
    </span>
  )}

</div>

        {/* DISCOUNT */}
        {data.discount && (
          <div className="discount-badge">
            {data.discount}%
          </div>
        )}

        {/* HEART */}
        <button className="wishlist">
          <Heart size={18}/>
        </button>

        {/* IMAGE INFO */}
        <div className="image-info">

          <span>
            <Calendar size={14}/> {data.duration}
          </span>

          <span>
            <Users size={14}/> {data.people}
          </span>

        </div>

      </div>


      {/* BODY */}
      <div className="card-body">

        {/* TITLE */}
        <h3 className="card-title">
          {data.title}
        </h3>

        {/* LOCATION */}
        <p className="location">
          <MapPin size={14}/> {data.destination}
        </p>


        {/* AGENT */}
        <div className="agent-row">

  <div className="agent-avatar">
    {data.agent.charAt(0)}
  </div>

  <div className="agent-info">

    <p className="agent-name">
      {data.agent}
    </p>

    <p className="agent-rating">
      ⭐ {data.agentRating} rating
    </p>

  </div>

  <span className="reviews">
  <span className="review-icon">
    <TrendingUp size={14} />
  </span>
  {data.reviews}
</span>

</div>

        {/* RATING */}
        <div className="rating-box">

          <span className="rating-value">
            <Star size={14} className="star filled"/> {data.rating} / 5
          </span>

          <span className="review-text">
          ({data.reviews} reviews)
          </span>

        </div>


        {/* PRICE */}
        <div className="price-row">

          <div>

            <p className="start">
              Starting from
            </p>

            <p className="price">

<span className="new-price">
${data.price}
</span>

{data.oldPrice && (
<span className="old-price">
${data.oldPrice}
</span>
)}

</p>

            <p className="per">
              per person
            </p>

          </div>


          {saveAmount > 0 && (

            <div className="save">

              You save

              <span>
                ${saveAmount}
              </span>

            </div>

          )}

        </div>


        <div className="button-row">

<Link to={`/package/${data.id}`} className="details">
View Details
</Link>

<button className="bottom-heart">
<Heart size={18}/>
</button>

</div>

      </div>

    </div>


)

})}

</div>

</div>

</div>

</div>


{/* FOOTER ADDED HERE */}

<Footer />

</div>

)

}

export default DestinationPage;