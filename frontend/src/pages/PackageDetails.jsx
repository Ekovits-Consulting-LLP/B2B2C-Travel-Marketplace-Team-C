import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../App.css";
import { MapPin, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/packageDetails.css";

function PackageDetails() {
    const navigate = useNavigate();

return (

<div>

<Navbar />

<div className="details-container">

<p className="breadcrumb">

<span style={{cursor:"pointer"}} onClick={()=>navigate("/")}>
Home
</span>

{" / "}

<span style={{cursor:"pointer"}} onClick={()=>navigate("/destinations",{state:null})}>
Packages
</span>

{" / "} Dubai Complete Tour

</p>

<button
className="back-btn"
onClick={() => navigate(-1)}
>
← Back to Search
</button>

<div className="details-top">

<div className="details-image">

<img
src="/images/packages/dubai-complete.jpg"
alt="Dubai"
className="main-img"
/>

<div className="thumbnail-row">

<img src="/images/packages/dubai-complete.jpg" alt="" />

<img src="/images/packages/dubai-luxury.jpg" alt="" />

</div>

</div>

<div className="price-card">

<p className="price-label">Starting from</p>

<h2 className="price">Rs.1599 <span className="old-price">Rs.1899</span></h2>

<p className="per-person">per person</p>

<div className="save-tag">Save Rs.300</div>

<button className="book-btn" onClick={() => window.location.href = `/book/${/* use selected package id if dynamic? fallback to 1 */ 1}`} >Book Now</button>


<div className="action-row">

<button className="action-btn">
❤️ Save
</button>

<button className="action-btn">
🔗 Share
</button>

</div>

<hr />

<h4>Need Help?</h4>

<p className="help-text">
Have questions about this package? Contact our travel experts.
</p>

<button className="contact-btn">Contact Support</button>

</div>

</div>

<div className="details-card">

<h2>Dubai Complete Tour</h2>

<div className="meta-row">

<span className="meta-item">
<MapPin className="meta-icon"/> Maldives
</span>

<span className="meta-item">
<Calendar className="meta-icon"/> 4 Days / 3 Nights
</span>

<span className="meta-item">
<Users className="meta-icon"/> Max 4 travelers
</span>

</div>

<div className="review-row">

<div className="review-left">
⭐ 4.7 <span className="review-count">(203 reviews)</span>
</div>

<div className="tags">
<span>Mid-Range</span>
<span>Family</span>
<span>Adventure</span>
</div>

</div>

<hr />

<h3>Overview</h3>

<p className="overview-text">
Comprehensive Dubai experience with premium 4-star hotels and desert safari.
</p>

</div>

<div className="details-card">

<h3>Day-wise Itinerary</h3>

<ul className="itinerary">

<li>
<span className="day-badge">1</span>
Arrival & Marina
</li>

<li>
<span className="day-badge">2</span>
Dubai City Tour
</li>

<li>
<span className="day-badge">3</span>
Desert Safari
</li>

<li>
<span className="day-badge">4</span>
Abu Dhabi Tour
</li>

<li>
<span className="day-badge">5</span>
Leisure Day
</li>

<li>
<span className="day-badge">6</span>
Departure
</li>

</ul>

</div>

<div className="grid-two">

<div className="details-card">

<h3 className="green">Inclusions</h3>

<ul className="include-list">

<li>Round-trip flights</li>
<li>4-star hotel</li>
<li>Daily breakfast & dinner</li>
<li>Desert safari with BBQ</li>
<li>Abu Dhabi tour</li>
<li>Visa assistance</li>

</ul>

</div>

<div className="details-card">

<h3 className="red">Exclusions</h3>

<ul className="exclude-list">

<li>Lunch</li>
<li>Personal expenses</li>
<li>Travel insurance</li>

</ul>

</div>

</div>

<div className="details-card">

<h3>Travel Agent</h3>

<div className="agent">

<img
src="/images/agents/global-adventures-logo.jpg"
alt="agent"
/>

<div>

<h4>Global Adventures</h4>

<p>⭐ 4.6 rating • 18 packages • 95 bookings</p>


</div>

</div>

</div>

</div>

<Footer />

</div>

)

}

export default PackageDetails