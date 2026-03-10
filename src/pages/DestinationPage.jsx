import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";
import PackageCard from "../components/PackageCard";
import SortBar from "../components/SortBar";
import packages from "../data/packages";
import Footer from "../components/Footer";

function DestinationPage() {

return (

<div>

<Navbar />

<div className="page-container">

<div className="page-header">

<div className="header-left">

<h1>Travel Packages</h1>

<div className="package-count">

<span className="count-badge">
20
</span>

<span className="count-text">
packages found
</span>

</div>

</div>

<SortBar />

</div>

<div className="content-layout">

<FilterSidebar />

<div className="cards-grid">

{packages.map((pkg) => (
<PackageCard key={pkg.id} data={pkg}/>
))}

</div>

</div>

</div>

{/* FOOTER ADDED HERE */}

<Footer />

</div>

)

}

export default DestinationPage;