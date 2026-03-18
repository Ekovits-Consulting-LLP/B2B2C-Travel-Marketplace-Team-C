
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search } from "lucide-react";
import { MapPin, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/newDestination.css";

function NewDestinationsPage() {

  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

  const handleSearch = () => {
      // later we will connect routing
};

const destinations = [
{
name:"Dubai",
country:"UAE",
img:"/images/destinations/dubai-uae.jpg",
desc:"Luxury shopping, ultramodern architecture, and desert adventures",
tours:156
},
{
name:"Bali",
country:"Indonesia",
img:"/images/destinations/bali-indonesia.jpg",
desc:"Discover the magic of Bali with beach resorts, temples, and cultural experiences",
tours:124
},
{
name:"Paris",
country:"France",
img:"/images/destinations/paris-france.jpg",
desc:"The City of Light offers romance, art, and culinary excellence",
tours:178
},
{
name:"Maldives",
country:"Maldives",
img:"/images/destinations/maldives.jpg",
desc:"Ultimate luxury overwater villa experience with pristine beaches",
tours:98
},
{
name:"Singapore",
country:"Singapore",
img:"/images/destinations/singapore.jpg",
desc:"Family fun with Universal Studios and Gardens by the Bay",
tours:87
},
{
name:"Bangkok & Phuket",
country:"Thailand",
img:"/images/destinations/thailand.jpg",
desc:"Discover Bangkok and Phuket with temples, beaches, and island hopping",
tours:142
},
{
name:"Manali",
country:"India",
img:"/images/destinations/manali-india.jpg",
desc:"Explore the snowy mountains with adventure activities and scenic beauty",
tours:76
},
{
name:"Kerala",
country:"India",
img:"/images/destinations/kerala-india.jpg",
desc:"Experience God's Own Country with houseboat stays and backwaters",
tours:65
},
{
name:"Goa",
country:"India",
img:"/images/packages/goa-beach.jpg",
desc:"Quick beach getaway with water sports and vibrant nightlife",
tours:93
}
];
const filteredDestinations = destinations.filter((d)=>
  d.name.toLowerCase().includes(search.toLowerCase())
);
const goToDestination = (name) => {
  navigate("/destinations", { state: { destination: name } });
};

  return (
    <div>

      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">

        <div className="container hero-content">

          <h1>Explore Destinations</h1>

          <p>
            Discover amazing places around the world and find the perfect tour for your next adventure
            
          </p>

          <div className="search-box">

            <div className="search-input">
              <Search size={18} className="search-icon" />

              <input
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button onClick={handleSearch}>
              Search
            </button>

          </div>

        </div>

      </section>

     {/* REGION */}
     
   <section className="regions">

  <div className="container">

    <h2 className="region-title">Browse by Region</h2>

    <div className="region-row">

      {[
        {name:"Europe", tours:542},
        {name:"Asia", tours:428},
        {name:"North America", tours:315},
        {name:"South America", tours:201},
        {name:"Africa", tours:187},
        {name:"Oceania", tours:156},
        {name:"Middle East", tours:134}
      ].map((r)=>(
        <div className="region-card" key={r.name}>
          <h4>{r.name}</h4>
          <p>{r.tours} tours</p>
        </div>
      ))}

    </div>

  </div>

</section>


     {/* POPULAR DESTINATIONS */}

<section className="popular-section">

 <div className="container"> {/* ⭐ OPEN HERE */}

    <div className="popular-header">

      <h2>Popular Destinations</h2>

      <div className="trending">
        <TrendingUp size={16}/>
        <span>Trending Now</span>
      </div>
      </div>

    </div>


  <div className="popular-grid">

    {filteredDestinations.map((d)=>(

      <div
  className="popular-card"
  key={d.name}
  onClick={() => goToDestination(d.name)}
>

        <div className="image-wrap">

          <img src={d.img} alt={d.name} />

          <div className="overlay">

            <h3>{d.name}</h3>

            <div className="location">
              <MapPin size={14}/>
              <span>{d.country}</span>
            </div>

          </div>

        </div>

        <div className="card-content">

          <p>{d.desc}</p>

          <div className="card-footer">

            <span className="tours">{d.tours} tours available</span>

            <span className="explore">Explore →</span>

          </div>

        </div>

      </div>

    ))}

  </div>

</section>


      {/* CTA */}
      <section className="cta">
        <h2>Can't Find Your Dream Destination?</h2>
        <p>Our travel experts can help you create a custom tour to any destination in the world</p>
        <button>Contact our Experts</button>
      </section>
      <Footer/>

    </div>
  );
}

export default NewDestinationsPage;