import React, { useEffect, useState } from "react";

const CustomerAccount = () => {

const user = JSON.parse(localStorage.getItem("user"));

const [profile,setProfile] = useState({
full_name:"",
email:"",
phone:"",
address:""
});

useEffect(()=>{

fetch(`/api/customer/profile/${user.id}`)
.then(res=>res.json())
.then(data=>{
setProfile(data);
});

},[]);


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