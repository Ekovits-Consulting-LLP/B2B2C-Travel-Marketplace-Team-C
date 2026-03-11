import React, { useEffect, useState } from "react";

const ExplorePackages = () => {

const [packages,setPackages] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{
fetchPackages();
},[]);

const fetchPackages = async () => {

try{

const res = await fetch("/api/packages/approved");

if(res.ok){

const data = await res.json();
setPackages(data);

}

}catch(err){

console.error(err);

}

setLoading(false);

};


const bookPackage = async(pkg)=>{

const name = prompt("Enter your name");

if(!name) return;

try{

const res = await fetch("/api/bookings",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

customer_name:name,
package_id:pkg.id,
travelers:1,
travel_date:new Date()

})

});

if(res.ok){

alert("Booking Successful!");

}else{

alert("Booking failed");

}

}catch(err){

console.error(err);

}

};


return(

<div style={{
padding:"40px",
background:"#f8fafc",
minHeight:"100vh"
}}>

<h1 style={{marginBottom:"30px"}}>
Explore Travel Packages
</h1>

{loading ? (

<p>Loading packages...</p>

) : (

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
gap:"20px"
}}>

{packages.map(pkg=>(

<div
key={pkg.id}
style={{
background:"white",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 15px rgba(0,0,0,0.05)"
}}
>

<div style={{
height:"150px",
background:"#e2e8f0",
borderRadius:"8px",
marginBottom:"15px"
}}></div>

<h3>{pkg.title}</h3>

<p style={{color:"#64748b"}}>
{pkg.destination}
</p>

<p style={{
fontWeight:"bold",
marginTop:"10px"
}}>
${pkg.price} / person
</p>

<p style={{
fontSize:"13px",
color:"#9ca3af"
}}>
{pkg.duration} days
</p>

<button
onClick={()=>bookPackage(pkg)}
style={{
marginTop:"15px",
width:"100%",
padding:"10px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"6px",
cursor:"pointer"
}}
>

Book Now

</button>

</div>

))}

</div>

)}

</div>

);

};

export default ExplorePackages;