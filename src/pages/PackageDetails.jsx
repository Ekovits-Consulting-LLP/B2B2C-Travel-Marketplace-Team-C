import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../App.css";

function PackageDetails() {

return (

<div>

<Navbar />

<div className="details-container">

<p className="breadcrumb">
Home / Packages / Dubai Complete Tour
</p>

<button className="back-btn">← Back to Search</button>

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

<h2 className="price">$1599 <span>$1899</span></h2>

<p className="per-person">per person</p>

<div className="save-tag">Save $300</div>

<button className="book-btn">Book Now</button>

<button className="pdf-btn">Download PDF</button>

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

<button className="contact-btn">Contact Agent</button>

</div>

</div>

<div className="details-card">

<h2>Dubai Complete Tour</h2>

<p className="meta">
Dubai, UAE • 6 Days / 5 Nights • Max 8 travelers
</p>

<p className="rating">
⭐ 4.7 (203 reviews)
</p>

<div className="tags">
<span>Mid-Range</span>
<span>Family</span>
<span>Adventure</span>
</div>

<hr />

<h3>Overview</h3>

<p>
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

<p>info@globaladventures.com</p>

</div>

</div>

</div>

</div>

<Footer />

</div>

)

}

export default PackageDetails