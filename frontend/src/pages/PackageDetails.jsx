import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../App.css";
import { MapPin, Calendar, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/packageDetails.css";

function PackageDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/packages/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPkg(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("PackageDetails fetch error", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ padding: 40, textAlign: "center" }}><h3>Loading package details...</h3></div>;
    if (!pkg) return <div style={{ padding: 40, textAlign: "center" }}><h3>Package not found</h3></div>;

    const parseJSON = (str) => {
        try {
            return typeof str === 'string' ? JSON.parse(str) : str;
        } catch {
            return [];
        }
    };

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

{" / "} {pkg.title}

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
src={pkg.images && pkg.images.length > 0 ? `/uploads/${pkg.images[0]}` : "/images/packages/dubai-complete.jpg"}
alt={pkg.title}
className="main-img"
/>

<div className="thumbnail-row">

{pkg.images && pkg.images.length > 1 ? pkg.images.slice(1, 3).map((img, idx) => (
<img key={idx} src={`/uploads/${img}`} alt="" />
)) : (
<>
<img src="/images/packages/dubai-complete.jpg" alt="" />
<img src="/images/packages/dubai-luxury.jpg" alt="" />
</>
)}

</div>

</div>

<div className="price-card">

<p className="price-label">Starting from</p>

<h2 className="price">Rs.{Number(pkg.final_price || pkg.price).toLocaleString('en-IN')} <span className="old-price">Rs.{Number(pkg.price).toLocaleString('en-IN')}</span></h2>

<p className="per-person">per person</p>

<div className="save-tag">Save Rs.{Number(pkg.price - (pkg.final_price || pkg.price)).toLocaleString('en-IN')}</div>

<button className="book-btn" onClick={() => window.location.href = `/book/${pkg.id}`} >Book Now</button>


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

<h2>{pkg.title}</h2>

<div className="meta-row">

<span className="meta-item">
<MapPin className="meta-icon"/>{pkg.destination}
</span>

<span className="meta-item">
<Calendar className="meta-icon"/>{pkg.days} Days / {pkg.nights} Nights
</span>

<span className="meta-item">
<Users className="meta-icon"/>Max {pkg.travelers || 4} travelers
</span>

</div>

<div className="review-row">

<div className="review-left">
⭐ {pkg.rating || 4.7} <span className="review-count">({pkg.reviews || 203} reviews)</span>
</div>

<div className="tags">
{pkg.package_types && parseJSON(pkg.package_types).map((type, idx) => (
<span key={idx}>{type}</span>
))}
</div>

</div>

<hr />

<h3>Overview</h3>

<p className="overview-text">
{pkg.description || "Comprehensive experience with premium accommodations and activities."}
</p>

</div>

<div className="details-card">

<h3>Day-wise Itinerary</h3>

<ul className="itinerary">
{parseJSON(pkg.itinerary).map((day, index) => (
<li key={index}>
<span className="day-badge">{day.day || (index + 1)}</span>
{day.title}
{pkg.hotels && Array.isArray(pkg.hotels) && pkg.hotels.some(h => h.day_number === (day.day || (index + 1))) && (
<div style={{ marginTop: "6px", fontSize: "13px", color: "#2563eb" }}>
🏨 Stay: {pkg.hotels.find(h => h.day_number === (day.day || (index + 1))).hotel_name}
</div>
)}
</li>
))}
</ul>

</div>

<div className="grid-two">

<div className="details-card">

<h3 className="green">Inclusions</h3>

<ul className="include-list">
{parseJSON(pkg.inclusions).map((item, idx) => (
<li key={idx}>{item}</li>
))}
</ul>

</div>

<div className="details-card">

<h3 className="red">Exclusions</h3>

<ul className="exclude-list">
{parseJSON(pkg.exclusions).map((item, idx) => (
<li key={idx}>{item}</li>
))}
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

<h4>{pkg.agent_name || "Global Adventures"}</h4>

<p>⭐ {pkg.agent_rating || 4.6} rating • {pkg.agent_packages || 18} packages • {pkg.agent_bookings || 95} bookings</p>


</div>

</div>

</div>

</div>

<Footer />

</div>

)

}

export default PackageDetails