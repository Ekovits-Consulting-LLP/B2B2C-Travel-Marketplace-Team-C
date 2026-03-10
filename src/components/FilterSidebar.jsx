import { Funnel } from "lucide-react";

function FilterSidebar() {

return (

<div className="sidebar">

<div className="filter-header">

<Funnel size={18} />

<h3>Filters</h3>

</div>


{/* PRICE RANGE */}

<div className="filter-group">

<h4>Price Range</h4>

<input type="range" min="0" max="5000" />

<div className="range-labels">

<span>$0</span>
<span>$5000</span>

</div>

</div>


{/* DURATION */}

<div className="filter-group">

<h4>Duration (Days)</h4>

<input type="range" min="1" max="15" />

<div className="range-labels">

<span>1 days</span>
<span>15 days</span>

</div>

</div>


{/* PACKAGE TYPE */}

<div className="filter-group">

<h4>Package Type</h4>

<label><input type="checkbox"/> Luxury</label>
<label><input type="checkbox"/> Family</label>
<label><input type="checkbox"/> Honeymoon</label>
<label><input type="checkbox"/> Adventure</label>
<label><input type="checkbox"/> Leisure</label>
<label><input type="checkbox"/> Group</label>

</div>


{/* INCLUSIONS */}

<div className="filter-group">

<h4>Inclusions</h4>

<label><input type="checkbox"/> Round-trip flights</label>
<label><input type="checkbox"/> Hotel stay</label>
<label><input type="checkbox"/> Daily breakfast</label>
<label><input type="checkbox"/> Visa assistance</label>
<label><input type="checkbox"/> City tour</label>

</div>


<button className="clear-btn">

Clear All Filters

</button>


</div>

)

}

export default FilterSidebar