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
const [bookedPackages, setBookedPackages] = useState([]);
const [bookedPackageDetails, setBookedPackageDetails] = useState([]);
const [activeSection, setActiveSection] = useState('account');
const [receiptStatus, setReceiptStatus] = useState({}); // track per-booking receipt download state

useEffect(()=>{
  fetch(`/api/customer/profile/${user.id}`)
    .then(res=>res.json())
    .then(data=>setProfile(data));
}, [user.id]);

useEffect(()=>{
  async function loadBookings(){
    try{
      const emailParam = encodeURIComponent(user?.email?.trim() || '');
      const r = await fetch(`/api/bookings?email=${emailParam}`);
      let bookings = await r.json();

      if (!bookings || bookings.length === 0){
        const nameParam = encodeURIComponent(user?.full_name?.trim() || '');
        const r2 = await fetch(`/api/bookings?customer_name=${nameParam}`);
        bookings = await r2.json();
      }

      console.log('customer bookings from API', bookings);
      setBookedPackages(bookings);

      const details = await Promise.all(bookings.map(async b => {
        const pkgR = await fetch(`/api/packages/${b.package_id}`);
        if (pkgR.ok){
          const pkg = await pkgR.json();
          return {...b, package: pkg};
        }
        return {...b, package: null};
      }));
      setBookedPackageDetails(details.filter(d => d.package));
    } catch(e){
      console.error('Booking load error', e);
    }
  }

  loadBookings();
}, [user.email]);
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
maxWidth:"1200px",
margin:"40px auto",
background:"#f8fafc",
padding:"20px",
borderRadius:"14px"
}}>

<div style={{display:'flex', gap:'24px'}}>

{/* SIDEBAR */}
<div style={{width:'270px', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'14px', padding:'20px', boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
<h3 style={{marginBottom:'18px', color:'#1f2937'}}>Account Menu</h3>
<button onClick={()=>setActiveSection('account')} style={{width:'100%', marginBottom:'10px', padding:'12px', textAlign:'left', border:'none', borderRadius:'8px', background: activeSection==='account' ? '#2563eb' : '#f3f4f6', color: activeSection==='account'?'#fff':'#1f2937', cursor:'pointer'}}>My Account</button>
<button onClick={()=>setActiveSection('saved')} style={{width:'100%', marginBottom:'10px', padding:'12px', textAlign:'left', border:'none', borderRadius:'8px', background: activeSection==='saved' ? '#2563eb' : '#f3f4f6', color: activeSection==='saved'?'#fff':'#1f2937', cursor:'pointer'}}>Saved Packages</button>
<button onClick={()=>setActiveSection('booked')} style={{width:'100%', padding:'12px', textAlign:'left', border:'none', borderRadius:'8px', background: activeSection==='booked' ? '#2563eb' : '#f3f4f6', color: activeSection==='booked'?'#fff':'#1f2937', cursor:'pointer'}}>Booked Packages</button>
</div>

{/* MAIN CONTENT */}
<div style={{flex:1, background:'#fff', border:'1px solid #e5e7eb', borderRadius:'14px', padding:'24px', boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
<h2 style={{fontSize:'26px', marginBottom:'20px'}}>{activeSection === 'account' ? 'My Account' : activeSection==='saved' ? 'Saved Packages' : 'Booked Packages'}</h2>

{activeSection === 'account' && (
  <>
    <div style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:'20px'}}>
      <div><label>Name</label><input style={input} value={profile.full_name || ''} onChange={e=>setProfile({...profile, full_name:e.target.value})}/></div>
      <div><label>Email</label><input style={input} value={profile.email || ''} disabled /></div>
      <div><label>Phone</label><input style={input} value={profile.phone || ''} onChange={e=>setProfile({...profile, phone:e.target.value})}/></div>
      <div><label>Address</label><input style={input} value={profile.address || ''} onChange={e=>setProfile({...profile, address:e.target.value})}/></div>
    </div>
    <button onClick={saveProfile} style={{marginTop:'24px', padding:'12px 24px', background:'#2563eb', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600'}}>Save Changes</button>
  </>
)}

{activeSection === 'saved' && (
  <>{savedPackageDetails.length === 0 ? <p style={{color:'#6b7280'}}>No saved packages yet.</p> : (<div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'18px'}}>{savedPackageDetails.map(pkg => (
    <div key={pkg.id} style={{border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden', background:'#fff'}}>
      <img src={pkg.images && pkg.images.length > 0 ? `/uploads/${pkg.images[0]}` : '/images/placeholder.jpg'} alt={pkg.title} style={{width:'100%', height:'160px', objectFit:'cover'}} />
      <div style={{padding:'12px'}}>
        <h4 style={{margin:'0 0 6px 0', color:'#1f2937'}}>{pkg.title}</h4>
        <p style={{margin:'4px 0', color:'#6b7280', fontSize:'13px'}}>{pkg.destination}</p>
        <div style={{display:'flex', gap:'8px', marginTop:'10px'}}>
          <button onClick={()=>navigate(`/package/${pkg.id}`)} style={{flex:1, padding:'8px', background:'#2563eb', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer'}}>View</button>
          <button onClick={()=>toggleSave(pkg.id)} style={{padding:'8px', background:'#fee2e2', border:'none', borderRadius:'8px', color:'#b91c1c', cursor:'pointer'}}>Remove</button>
        </div>
      </div>
    </div>
  ))}</div>)}</>
)}

{activeSection === 'booked' && (
  <>{bookedPackageDetails.length === 0 ? <p style={{color:'#6b7280'}}>No booked packages yet.</p> : (<div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'18px'}}>{bookedPackageDetails.map((bk, idx) => (
    <div key={`${bk.package_id}-${idx}`} style={{border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden', background:'#fff'}}>
      <img src={bk.package.images && bk.package.images.length > 0 ? `/uploads/${bk.package.images[0]}` : '/images/placeholder.jpg'} alt={bk.package.title} style={{width:'100%', height:'160px', objectFit:'cover'}} />
      <div style={{padding:'12px'}}>
        <h4 style={{margin:'0 0 6px 0', color:'#1f2937'}}>{bk.package.title}</h4>
        <p style={{margin:'4px 0', color:'#6b7280', fontSize:'13px'}}>Travel Date: {new Date(bk.travel_date).toLocaleDateString()}</p>
        <p style={{margin:'4px 0', color:'#6b7280', fontSize:'13px'}}>Travelers: {bk.travelers}</p>
        <span style={{fontWeight:'600', color:'#2563eb'}}>{bk.status}</span>
        <div style={{marginTop:'12px'}}>
          <button onClick={async () => {
            setReceiptStatus(prev => ({ ...prev, [bk.id]: { status: 'downloading', message: 'Downloading...' }}));
            try {
              const res = await fetch(`/api/bookings/${bk.id}/receipt`);
              if (res.status === 404) {
                setReceiptStatus(prev => ({ ...prev, [bk.id]: { status: 'no-receipt', message: 'No receipts available for this booking.' }}));
                return;
              }
              if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
              }
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `receipt.pdf`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              setReceiptStatus(prev => ({ ...prev, [bk.id]: { status: 'saved', message: 'Receipt saved.' }}));
            } catch (err) {
              console.error('Receipt download error', err);
              setReceiptStatus(prev => ({ ...prev, [bk.id]: { status: 'error', message: 'Could not download receipt. Please try again.' }}));
            }
          }}
          disabled={receiptStatus[bk.id]?.status === 'downloading'}
          style={{marginTop:'10px', background:'#2563eb', color:'#fff', border:'none', borderRadius:'8px', padding:'8px 12px', cursor:'pointer'}}>Download Receipt</button>
          <div style={{marginTop:'8px', color:'#374151', fontSize:'13px'}}>{receiptStatus[bk.id]?.message || ''}</div>
        </div>
      </div>
    </div>
  ))}</div>)}</>
)}

</div>
</div>
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