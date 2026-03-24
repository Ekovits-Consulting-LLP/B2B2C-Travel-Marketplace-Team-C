import Footer from "../components/Footer";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import {Heart, MapPin, Star, Users, Calendar,} from "lucide-react";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import "../styles/packagespecific.css";



function DestinationPage() {
    const location = useLocation();
    const { destination: routeDestination } = useParams();
    const selectedDestination = routeDestination || location.state?.destination || "";
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const normalizeDestination = (name) => {
      if (!name || !name.trim()) return "";
      return name.split(",")[0].trim();
    };

    useEffect(() => {
      if (selectedDestination) {
        setSearch(selectedDestination);
      }
    }, [selectedDestination]);

    
    const [durationFilter,setDurationFilter] = useState([])
    const [priceFilter,setPriceFilter] = useState([])
    const [styleFilter,setStyleFilter] = useState([])
    const [sortOption,setSortOption] = useState("best")
    
    const [allPackages, setAllPackages] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const handleBookNow = (packageId) => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login to book this package.');
            navigate('/login');
            return;
        }
        navigate(`/book/${packageId}`);
    };

    let filteredPackages = [...allPackages];
    const handleReset = () => {
        setDurationFilter([])
        setPriceFilter([])
        setStyleFilter([])
        setSortOption("best")
        setSearch("")
    }

    useEffect(() => {
    setLoading(true);

    const fetchDestination = normalizeDestination(search || selectedDestination);
    const url = fetchDestination
        ? `/api/packages/approved?destination=${encodeURIComponent(fetchDestination)}`
        : `/api/packages/approved`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const normalized = data.map(pkg => ({
                id: pkg.id,
                title: pkg.title,
                destination: pkg.destination,
                image: pkg.images && pkg.images.length > 0 
                    ? `/uploads/${pkg.images[0]}`
                    : "/images/placeholder.jpg",
                duration: `${pkg.days}D/${pkg.nights}N`,
                days: pkg.days,
                travelers: pkg.travelers,
                type: pkg.package_types && pkg.package_types.length > 0 
                    ? (typeof pkg.package_types === 'string' ? JSON.parse(pkg.package_types)[0] : pkg.package_types[0])
                    : "Adventure",
                final_price: pkg.offer_percent > 0 
                    ? Number(pkg.price) - (Number(pkg.price) * Number(pkg.offer_percent) / 100)
                    : Number(pkg.price),
                oldPrice: pkg.offer_percent > 0 ? Number(pkg.price) : null,
                save: pkg.offer_percent > 0 
                    ? Number(pkg.price) - (Number(pkg.price) - (Number(pkg.price) * Number(pkg.offer_percent) / 100))
                    : 0,
                rating: pkg.rating || 0,
                discount: pkg.offer_percent || 0,
                badge1: pkg.is_featured ? "Featured" : null,
                badge2: pkg.offer_percent > 50 ? "Luxury" : null,
            }));

            setAllPackages(normalized);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching packages:", err);
            setLoading(false);
        });

}, [search]);

    


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

<button 
className="search-btn"
onClick={() => setSearch(search)}
>
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
Under Rs.1000
</label>

<label>
<input
type="checkbox"
checked={priceFilter.includes("mid")}
onChange={()=>handleCheckbox("mid",priceFilter,setPriceFilter)}
/>
Rs.1000 - Rs.2500
</label>

<label>
<input
type="checkbox"
checked={priceFilter.includes("high")}
onChange={()=>handleCheckbox("high",priceFilter,setPriceFilter)}
/>
Rs.2500 - Rs.5000
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

const saveAmount = data.save || 0;

return(

<div className="travel-card" key={data.id}>

  {/* IMAGE */}
  <div className="travel-image">
    <img src={data.image} alt={data.title} />

    {/* DISCOUNT */}
    {data.discount > 0 && (
      <div className="wishlist-box">
        <span className="discount">
          {data.discount}%
        </span>
      </div>
    )}

    {/* BADGES */}
    <div className="image-badges">
      <span>
        <Calendar size={14}/> {data.duration}
      </span>
      <span>
        <Users size={14}/> {data.travelers}
      </span>
    </div>
  </div>

  {/* BODY */}
  <div className="travel-body">

    <h3 className="title">{data.title}</h3>

    <p className="location">
      <MapPin size={14}/> {data.destination}
    </p>

    {/* RATING */}
    <div className="rating-box">
      <span className="rating-star">
        <Star size={14} /> {data.rating}
      </span>
      <span className="rating-value">/ 5</span>
    </div>

    {/* PRICE */}
    <div className="price-section">

      <div className="price-left">
        <p className="starting">Starting from</p>
        <div className="price-row">
          <span className="price">
            ₹{Number(data.final_price).toLocaleString("en-IN")}
          </span>
          {data.oldPrice && (
            <span className="old-price">
              Rs. {Number(data.oldPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <p className="per">per person</p>
      </div>

      {saveAmount > 0 && (
        <div className="save-box">
          <p>You save</p>
          <span className="save">
            Rs. {Number(saveAmount).toLocaleString("en-IN")}
          </span>
        </div>
      )}

    </div>

    {/* BUTTONS */}
    <div className="card-buttons">
      <button className="details-btn" onClick={() => navigate(`/package/${data.id}`)}>
        Book Now
      </button>
      <button
        className={`download-btn ${isSaved(data.id) ? 'saved' : ''}`}
        onClick={() => toggleSave(data.id)}
        aria-label={isSaved(data.id) ? 'Unsave' : 'Save'}
      >
        <Heart size={24} color={isSaved(data.id) ? '#e11d48' : '#6b7280'} fill={isSaved(data.id) ? '#e11d48' : 'none'} />
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