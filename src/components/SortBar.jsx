import { LayoutGrid, List } from "lucide-react";

function SortBar() {

return(

<div className="header-controls">

<button className="control-pill active">
<LayoutGrid size={16}/>
All Packages
</button>


<button className="control-pill">
<List size={16}/>
By Destination
</button>


<select className="sort-dropdown">

<option>Most Popular</option>
<option>Price: Low to High</option>
<option>Price: High to Low</option>
<option>Duration</option>
<option>Highest Rated</option>

</select>

</div>

)

}

export default SortBar