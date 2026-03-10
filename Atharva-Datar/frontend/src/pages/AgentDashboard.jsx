import React, { useState } from 'react';
import {
LayoutDashboard,
Package,
CalendarCheck,
Settings,
User,
Plus,
AlertCircle,
Package2,
Calendar,
DollarSign,
TrendingUp,
LogOut,
Plane,
Search,
MoreVertical,
X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {

const navigate = useNavigate();

const [activeTab,setActiveTab] = useState('dashboard');
const [isAddModalOpen,setIsAddModalOpen] = useState(false);
const [newPkg,setNewPkg] = useState({title:'',destination:'',duration:'',price:''});
const [isSubmitting,setIsSubmitting] = useState(false);
const [myPackages,setMyPackages] = useState([]);
const [loadingPackages,setLoadingPackages] = useState(false);
const [agentUser,setAgentUser] = useState(null);
const [bookings,setBookings] = useState([]);
const [agentPhoto,setAgentPhoto] = useState(null);
const [companyLogo,setCompanyLogo] = useState(null);

const [profile,setProfile] = useState({
agency_name:'',
agent_name:'',
phone:'',
address:''
});

React.useEffect(()=>{

const userStr = localStorage.getItem('user');

if(!userStr){
navigate('/login');
return;
}

const user = JSON.parse(userStr);

if(user.role.toLowerCase() !== 'agent'){
navigate('/login');
return;
}

setAgentUser(user);

/* ADD THIS PART */
setProfile({
agency_name: user.agency_name || '',
agent_name: user.agent_name || '',
phone: user.phone || '',
address: user.address || ''
});

setAgentPhoto(user.agent_photo || null);
setCompanyLogo(user.company_logo || null);

if(activeTab === 'packages' || activeTab === 'dashboard'){
fetchMyPackages(user.id);
}

if(activeTab === 'bookings'){
fetchBookings(user.id);
}

},[activeTab,navigate]);


/* ---------------- DELETE REQUEST ---------------- */

const handleDeleteRequest = async(packageId)=>{

try{

const res = await fetch("/api/agent/delete-package",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
package_id:packageId,
agent_id:agentUser.id
})
});

if(res.ok){

alert("Delete request sent to admin for approval");

}else{

alert("Failed to send request");

}

}catch(err){

console.error(err);

}

};


/* ---------------- FETCH PACKAGES ---------------- */

const fetchMyPackages = async(agentId)=>{

setLoadingPackages(true);

try{

const res = await fetch(`/api/agent/packages?agent_id=${agentId}`);

if(res.ok){
const data = await res.json();
setMyPackages(data);
}

}catch(err){
console.error(err);
}

setLoadingPackages(false);

};



/* ---------------- ADD PACKAGE ---------------- */

const handleAddPackage = async(e)=>{

e.preventDefault();
setIsSubmitting(true);

try{

const res = await fetch('/api/packages',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
...newPkg,
duration:parseInt(newPkg.duration),
price:parseFloat(newPkg.price),
agent_id:agentUser.id
})
});

if(res.ok){

setNewPkg({title:'',destination:'',duration:'',price:''});
setIsAddModalOpen(false);
fetchMyPackages(agentUser.id);

alert("Package added and pending admin approval");

}else{

alert("Failed to add package");

}

}catch(err){

console.error(err);
alert("Error adding package");

}

setIsSubmitting(false);

};



/* ---------------- FETCH BOOKINGS ---------------- */

const fetchBookings = async(agentId)=>{

try{

const res = await fetch(`/api/agent/bookings?agent_id=${agentId}`);

if(res.ok){

const data = await res.json();
setBookings(data);

}

}catch(err){

console.error("Booking fetch error",err);

}

};


/* ---------------- PROFILE SAVE ---------------- */

const saveProfile = async()=>{

try{

const formData = new FormData();

formData.append("agency_name",profile.agency_name);
formData.append("agent_name",profile.agent_name);
formData.append("phone",profile.phone);
formData.append("address",profile.address);

if(agentPhoto){
formData.append("agent_photo",agentPhoto);
}

if(companyLogo){
formData.append("company_logo",companyLogo);
}

const res = await fetch(`/api/agent/profile/${agentUser.id}`,{
method:"PUT",
body:formData
});

if(res.ok){

const updatedUser = await res.json();

/* update local storage */
const storedUser = JSON.parse(localStorage.getItem("user"));

const newUser = {
...storedUser,
...updatedUser
};

localStorage.setItem("user", JSON.stringify(newUser));
setAgentUser(newUser);

/* update state */
setAgentUser(updatedUser);

alert("Profile updated");

}

}catch(err){
console.error(err);
}

};

/* ---------------- STATS ---------------- */

const totalPackages = myPackages.length;
const liveCount = myPackages.filter(p=>p.status==='approved').length;
const pendingCount = myPackages.filter(p=>p.status==='pending').length;
const rejectedCount = myPackages.filter(p=>p.status==='rejected').length;
const approvedPackages = myPackages.filter(p=>p.status==='approved');



/* ---------------- DASHBOARD ---------------- */

const renderDashboardHome = ()=>(

<>
<header className="dashboard-header">

<div>
<h2>Agent Dashboard</h2>
<p>Welcome back, {agentUser?.full_name || 'Agent'}!</p>
</div>

{/* <button
className="btn-add-package"
onClick={()=>navigate("/add-package")}
>
<Plus size={16}/> Add New Package
</button> */}

</header>

{pendingCount > 0 && (

<div className="alert-banner">

<div className="alert-content">

<AlertCircle size={20}/>

<div>
<h4>You have {pendingCount} package pending approval</h4>
<p>Packages will appear to customers once approved</p>
</div>

</div>

<button
className="btn-view-packages"
onClick={()=>setActiveTab('packages')}
>
View Packages
</button>

</div>

)}

<div className="stats-grid">

<div className="stat-card">

<div className="stat-icon-wrapper bg-blue-50 text-blue-600">
<Package2 size={20}/>
</div>

<div className="stat-value">
{totalPackages}
</div>

<div className="stat-title">
Total Packages
</div>

<div className="stat-footer">
{liveCount} live
</div>

</div>


<div className="stat-card">

<div className="stat-icon-wrapper bg-green-50 text-green-600">
<Calendar size={20}/>
</div>

<div className="stat-value">
{bookings.length}
</div>

<div className="stat-title">
Total Bookings
</div>

<div className="stat-footer">
All time
</div>

</div>


<div className="stat-card">

<div className="stat-icon-wrapper bg-purple-50 text-purple-600">
<DollarSign size={20}/>
</div>

<div className="stat-value">
$0
</div>

<div className="stat-title">
Total Earnings
</div>

<div className="stat-footer">
Commission pending
</div>

</div>


<div className="stat-card">

<div className="stat-icon-wrapper bg-orange-50 text-orange-600">
<TrendingUp size={20}/>
</div>

<div className="stat-value">
+0%
</div>

<div className="stat-title">
Growth Rate
</div>

<div className="stat-footer">
vs last month
</div>

</div>

</div>


<div className="dashboard-bottom-grid">

<div className="dashboard-panel">

<div className="panel-header">
<h3>Top Packages</h3>

<button
className="btn-view-all"
onClick={()=>setActiveTab('packages')}
>
View All
</button>

</div>

<div className="package-list">

{approvedPackages.length === 0 ? (

<p style={{padding:"20px"}}>
No approved packages yet
</p>

) : (

approvedPackages.slice(0,3).map(pkg=>(

<div className="package-item" key={pkg.id}>

<div className="package-img placeholder-img"></div>

<div className="package-info">

<h4>{pkg.title}</h4>
<p>${pkg.price} per person</p>

</div>

<div className="package-stats">

<span>{pkg.destination}</span>

<span className="rating">
Approved
</span>

</div>

</div>

))

)}

</div>

</div>

</div>

</>
);



/* ---------------- PACKAGES PAGE ---------------- */

const renderPackages = ()=>(

<>
<header className="dashboard-header">

<div>
<h2>Package Management</h2>
<p>{totalPackages} total packages</p>
</div>

<button
className="btn-add-package"
onClick={()=>navigate("/add-package")}
>
<Plus size={16}/> Add New Package
</button>

</header>

<div className="pkg-stats-grid">

<div className="pkg-stat-card">
<div className="pkg-stat-value live">{liveCount}</div>
<div className="pkg-stat-label">Live Packages</div>
</div>

<div className="pkg-stat-card">
<div className="pkg-stat-value pending">{pendingCount}</div>
<div className="pkg-stat-label">Pending Approval</div>
</div>

<div className="pkg-stat-card">
<div className="pkg-stat-value rejected">{rejectedCount}</div>
<div className="pkg-stat-label">Rejected</div>
</div>

</div>

<div className="data-table-container">

<table className="data-table">

<thead>
<tr>
<th>Package</th>
<th>Destination</th>
<th>Duration</th>
<th>Price</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{loadingPackages ? (

<tr>
<td colSpan="5" style={{textAlign:'center'}}>
Loading...
</td>
</tr>

) : (

myPackages.map(pkg=>(

<tr key={pkg.id}>
<td>{pkg.title}</td>
<td>{pkg.destination}</td>
<td>{pkg.days} Days / {pkg.nights} Nights</td>
<td>${pkg.price}</td>
<td>{pkg.status}</td>

<td>

<button
onClick={()=>navigate(`/agent/update/${pkg.id}`)}
style={{
background:"#4f46e5",
color:"white",
border:"none",
padding:"5px 10px",
borderRadius:"5px",
marginRight:"5px"
}}
>
Update
</button>

<button
onClick={()=>handleDeleteRequest(pkg.id)}
style={{
background:"#ef4444",
color:"white",
border:"none",
padding:"5px 10px",
borderRadius:"5px"
}}
>
Delete
</button>

</td>
</tr>



))

)}

</tbody>

</table>

</div>

</>
);



/* ---------------- BOOKINGS PAGE ---------------- */

const renderBookings = () => (

<>
<header className="dashboard-header">
<div>
<h2>Bookings</h2>
<p>{bookings.length} total bookings</p>
</div>
</header>

<div className="data-table-container">

<table className="data-table">

<thead>
<tr>
<th>Booking ID</th>
<th>Customer</th>
<th>Package</th>
<th>Travel Date</th>
<th>Travelers</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{bookings.length === 0 ? (

<tr>
<td colSpan="6" style={{textAlign:'center',padding:'20px'}}>
No bookings yet
</td>
</tr>

) : (

bookings.map(b => (

<tr key={b.id}>

<td>book-{b.id}</td>

<td>
<div className="customer-cell">
<h4>{b.customer_name}</h4>
<span>{b.email}</span>
</div>
</td>

<td>{b.title}</td>

<td>{new Date(b.travel_date).toLocaleDateString()}</td>

<td>{b.travelers}</td>

<td>
<span className="status-badge status-live">
{b.status}
</span>
</td>

</tr>

))

)}

</tbody>

</table>

</div>
</>
);



/* ---------------- SETTINGS PAGE ---------------- */

const renderSettings = () => (

<>
<header className="dashboard-header">

<div>
<h2>Profile</h2>
<p>Manage your agency information</p>
</div>

<button
className="btn-add-package"
onClick={saveProfile}
>
Save Changes
</button>

</header>

<div className="settings-card">

<div className="settings-group">
<label>Agency Name</label>
<input
type="text"
value={profile.agency_name}
onChange={(e)=>setProfile({...profile,agency_name:e.target.value})}
/>
</div>

<div className="settings-group">
<label>Agent Name</label>
<input
type="text"
value={profile.agent_name}
onChange={(e)=>setProfile({...profile,agent_name:e.target.value})}
/>
</div>

<div className="settings-group">
<label>Phone</label>
<input
type="text"
value={profile.phone}
onChange={(e)=>setProfile({...profile,phone:e.target.value})}
/>
</div>

<div className="settings-group">
<label>Address</label>
<input
type="text"
value={profile.address}
onChange={(e)=>setProfile({...profile,address:e.target.value})}
/>
</div>

<div className="settings-group">
<label>Agent Photo</label>

<input
type="file"
accept="image/*"
onChange={(e)=>setAgentPhoto(e.target.files[0])}
/>

{agentPhoto && (
<img
src={
typeof agentPhoto === "string"
? `http://localhost:5000/uploads/${agentPhoto}`
: URL.createObjectURL(agentPhoto)
}
style={{width:"80px",marginTop:"10px",borderRadius:"6px"}}
/>
)}

</div>

<div className="settings-group">
<label>Company Logo</label>

<input
type="file"
accept="image/*"
onChange={(e)=>setCompanyLogo(e.target.files[0])}
/>

{companyLogo && (
<img
src={
typeof companyLogo === "string"
? `http://localhost:5000/uploads/${companyLogo}`
: URL.createObjectURL(companyLogo)
}
style={{width:"80px",marginTop:"10px",borderRadius:"6px"}}
/>
)}

</div>

</div>

</>
);



return(

<div className="agent-layout">

<nav className="agent-navbar">

<div className="agent-navbar-left">

<div
className="logo-icon-wrapper-small"
onClick={()=>navigate('/agent-dashboard')}
>
<Plane size={20}/>
</div>

<div className="agent-navbar-brand">
<h1>TravelHub</h1>
<span>Agent Portal</span>
</div>

</div>

<div className="agent-navbar-right">

<button
className="agent-nav-link"
onClick={()=>navigate('/')}
>
View Customer Site
</button>

<button
className="agent-nav-link"
onClick={()=>navigate('/login')}
>
<LogOut size={16}/> Logout
</button>

</div>

</nav>


<div className="agent-body">

<aside className="agent-sidebar">

<button
className={`sidebar-item ${activeTab==='dashboard'?'active':''}`}
onClick={()=>setActiveTab('dashboard')}
>
<LayoutDashboard size={18}/> Dashboard
</button>

<button
className={`sidebar-item ${activeTab==='packages'?'active':''}`}
onClick={()=>setActiveTab('packages')}
>
<Package size={18}/> My Packages 
</button>

<button
className={`sidebar-item ${activeTab==='bookings'?'active':''}`}
onClick={()=>setActiveTab('bookings')}
>
<CalendarCheck size={18}/> Bookings
</button>

<button
className={`sidebar-item ${activeTab==='settings'?'active':''}`}
onClick={()=>setActiveTab('settings')}
>
<User size={18}/> Profile
</button>

</aside>

<main className="agent-main-content">

{activeTab === 'dashboard' && renderDashboardHome()}
{activeTab === 'packages' && renderPackages()}
{activeTab === 'bookings' && renderBookings()}
{activeTab === 'settings' && renderSettings()}

{/* ADD PACKAGE MODAL */}
{isAddModalOpen && (
<div style={{
position:'fixed',
top:0,
left:0,
right:0,
bottom:0,
background:'rgba(0,0,0,0.5)',
display:'flex',
alignItems:'center',
justifyContent:'center',
zIndex:1000
}}>

<div style={{
background:'white',
padding:'25px',
borderRadius:'12px',
width:'400px'
}}>

<div style={{
display:'flex',
justifyContent:'space-between',
marginBottom:'20px'
}}>

<h3>Add New Package</h3>

<button
onClick={()=>setIsAddModalOpen(false)}
style={{
border:'none',
background:'none',
cursor:'pointer'
}}
>
<X size={20}/>
</button>

</div>

<form onSubmit={handleAddPackage}>

<input
type="text"
placeholder="Package Title"
value={newPkg.title}
onChange={(e)=>setNewPkg({...newPkg,title:e.target.value})}
required
style={{width:'100%',marginBottom:'10px',padding:'8px'}}
/>

<input
type="text"
placeholder="Destination"
value={newPkg.destination}
onChange={(e)=>setNewPkg({...newPkg,destination:e.target.value})}
required
style={{width:'100%',marginBottom:'10px',padding:'8px'}}
/>

<input
type="number"
placeholder="Duration (days)"
value={newPkg.duration}
onChange={(e)=>setNewPkg({...newPkg,duration:e.target.value})}
required
style={{width:'100%',marginBottom:'10px',padding:'8px'}}
/>

<input
type="number"
placeholder="Price"
value={newPkg.price}
onChange={(e)=>setNewPkg({...newPkg,price:e.target.value})}
required
style={{width:'100%',marginBottom:'20px',padding:'8px'}}
/>

<button
type="submit"
style={{
width:'100%',
padding:'10px',
background:'#4f46e5',
color:'white',
border:'none',
borderRadius:'6px'
}}
>

{isSubmitting ? "Adding..." : "Add Package"}

</button>

</form>

</div>

</div>
)}

</main>

</div>

</div>

);

};

export default AgentDashboard;