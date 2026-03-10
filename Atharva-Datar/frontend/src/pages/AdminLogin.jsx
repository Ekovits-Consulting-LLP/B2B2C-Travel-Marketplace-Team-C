import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleLogin = async(e)=>{

e.preventDefault();

try{

const res = await fetch("/api/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password,
role:"admin"
})
});

if(res.ok){

const data = await res.json();

/* save only user object */
localStorage.setItem("user", JSON.stringify(data.user));

navigate("/admin-dashboard");

}else{

alert("Invalid admin credentials");

}

}catch(err){

console.error("Login error:",err);
alert("Server error while logging in");

}

};

return(

<div style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"linear-gradient(135deg,#1d4ed8,#06b6d4)"
}}>

<div style={{
width:"380px",
background:"white",
padding:"40px",
borderRadius:"12px",
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}}>

<div style={{textAlign:"center",marginBottom:"25px"}}>

<div style={{
width:"50px",
height:"50px",
background:"#2563eb",
borderRadius:"12px",
display:"flex",
alignItems:"center",
justifyContent:"center",
margin:"0 auto 10px auto",
color:"white",
fontSize:"20px"
}}>
✈
</div>

<h1 style={{margin:"0",fontSize:"28px"}}>TravelHub</h1>

<h2 style={{
marginTop:"10px",
fontSize:"18px",
fontWeight:"500",
color:"#374151"
}}>
Admin Login
</h2>

</div>

<form onSubmit={handleLogin}>

<div style={{marginBottom:"15px"}}>

<label style={{
display:"block",
marginBottom:"5px",
fontWeight:"500"
}}>
Email
</label>

<input
type="email"
placeholder="admin@email.com"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
border:"1px solid #d1d5db",
borderRadius:"6px",
outline:"none"
}}
/>

</div>

<div style={{marginBottom:"20px"}}>

<label style={{
display:"block",
marginBottom:"5px",
fontWeight:"500"
}}>
Password
</label>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
border:"1px solid #d1d5db",
borderRadius:"6px",
outline:"none"
}}
/>

</div>

<button
type="submit"
style={{
display:"block",
margin:"0 auto",
padding:"12px 30px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"8px",
fontWeight:"600",
cursor:"pointer",
fontSize:"15px"
}}
>

Login as Admin

</button>

</form>

<div style={{
marginTop:"20px",
textAlign:"center"
}}>

{/* <p>
Don't have an account?{" "}
<a
href="#"
onClick={(e)=>{
e.preventDefault();
navigate('/travelhub-admin-register');
}}
style={{
color:"#2563eb",
fontWeight:"500",
textDecoration:"none"
}}
>
Register
</a>
</p> */}

</div>

</div>

</div>

);

};

export default AdminLogin;