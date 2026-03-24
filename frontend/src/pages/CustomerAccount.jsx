import React, { useEffect, useState } from "react";
import { Heart, MapPin, Calendar, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomerAccount = () => {

const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));

const [profile,setProfile] = useState({
full_name:"",
email:"",
phone:"",
address:""
});

const [savedPackages, setSavedPackages] = useState([]);
const [savedPackageDetails, setSavedPackageDetails] = useState([]);

useEffect(()=>{

fetch(`/api/customer/profile/${user.id}`)
.then(res=>res.json())
.then(data=>{
setProfile(data);
});

},[]);

useEffect(() => {
  const storedSaved = localStorage.getItem('savedPackages');
  if (storedSaved) {
    try {
      setSavedPackages(JSON.parse(storedSaved));
    } catch (e) {
      setSavedPackages([]);
    }
  }
}, []);

useEffect(() => {
  if (savedPackages.length > 0) {
    Promise.all(
      savedPackages.map(id =>
        fetch(`http://localhost:5000/api/packages/${id}`)
          .then(res => res.json())
          .catch(err => {
            console.error('Error fetching package:', err);
            return null;
          })
      )
    ).then(results => {
      setSavedPackageDetails(results.filter(pkg => pkg !== null));
    });
  } else {
    setSavedPackageDetails([]);
  }
}, [savedPackages]);

const toggleSave = (id) => {
  const updated = savedPackages.filter(pid => pid !== id);
  setSavedPackages(updated);
  localStorage.setItem('savedPackages', JSON.stringify(updated));
};

const saveProfile = async()=>{

const res = await fetch(`/api/customer/profile/${user.id}`,{

method:"PUT",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(profile)

});

if(res.ok){

alert("Profile updated successfully");

}else{

alert("Failed to update profile");

}

};


return(

<div style={{
maxWidth:"900px",
margin:"60px auto",
background:"white",
padding:"40px",
borderRadius:"12px",
boxShadow:"0 4px 20px rgba(0,0,0,0.08)"
}}>

<h2 style={{
fontSize:"28px",
marginBottom:"30px"
}}>
My Account
</h2>


<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px"
}}>

<div>
<label>Name</label>
<input
style={input}
value={profile.full_name || ""}
onChange={(e)=>setProfile({...profile,full_name:e.target.value})}
/>
</div>

<div>
<label>Email</label>
<input
style={input}
value={profile.email || ""}
disabled
/>
</div>

<div>
<label>Phone</label>
<input
style={input}
value={profile.phone || ""}
onChange={(e)=>setProfile({...profile,phone:e.target.value})}
/>
</div>

<div>
<label>Address</label>
<input
style={input}
value={profile.address || ""}
onChange={(e)=>setProfile({...profile,address:e.target.value})}
/>
</div>

</div>


<button
onClick={saveProfile}
style={{
marginTop:"30px",
padding:"12px 20px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"500"
}}
>
Save Changes
</button>

<hr style={{ margin: '40px 0', borderColor: '#e5e7eb' }} />

<h3 style={{ fontSize: '22px', marginBottom: '20px', marginTop: '40px' }}>
💖 Saved Packages
</h3>

{savedPackageDetails.length === 0 ? (
  <p style={{ color: '#6b7280' }}>No saved packages yet. Start saving your favorite travel packages!</p>
) : (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
    {savedPackageDetails.map(pkg => (
      <div key={pkg.id} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <img 
          src={pkg.images && pkg.images.length > 0 ? `/uploads/${pkg.images[0]}` : '/images/placeholder.jpg'}
          alt={pkg.title}
          style={{ width: '100%', height: '160px', objectFit: 'cover' }}
        />
        <div style={{ padding: '12px' }}>
          <h4 style={{ 
            margin: '0 0 6px 0', 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#2563eb',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '50px',
            maxHeight: '50px'
          }}>
            {pkg.title}
          </h4>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> {pkg.destination}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> {pkg.days}D/{pkg.nights}N
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: '700', color: '#2563eb' }}>
            ₹{Number(pkg.final_price || pkg.price).toLocaleString('en-IN')}
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              onClick={() => navigate(`/package/${pkg.id}`)}
              className="book-btn"
              style={{ flex: 1 }}
            >
              Book Now
            </button>
            <button
              onClick={() => toggleSave(pkg.id)}
              style={{
                padding: '8px 12px',
                background: '#fee2e2',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <Heart size={18} color='#e11d48' fill='#e11d48' />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

</div>

);

};

const input={
width:"100%",
padding:"10px",
marginTop:"6px",
border:"1px solid #ddd",
borderRadius:"6px"
};

export default CustomerAccount;