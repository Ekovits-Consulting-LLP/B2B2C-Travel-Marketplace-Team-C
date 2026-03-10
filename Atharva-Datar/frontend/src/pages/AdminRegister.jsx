import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {

const navigate = useNavigate();

const [form,setForm] = useState({
fullName:"",
email:"",
password:"",
confirmPassword:""
});

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleRegister = async(e)=>{
e.preventDefault();

if(form.password !== form.confirmPassword){
alert("Passwords do not match");
return;
}

try{

const res = await fetch("/api/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
fullName:form.fullName,
email:form.email,
password:form.password,
role:"admin"
})
});

if(res.ok){

alert("Admin registered successfully");
navigate("/travelhub-admin");

}else{

alert("Registration failed");

}

}catch(err){

console.error(err);
alert("Server error");

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
width:"420px",
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
Admin Register
</h2>

</div>

<form onSubmit={handleRegister}>

<div style={{marginBottom:"15px"}}>

<label style={{display:"block",marginBottom:"5px"}}>Full Name</label>

<input
type="text"
name="fullName"
placeholder="Admin Name"
value={form.fullName}
onChange={handleChange}
required
style={input}
/>

</div>


<div style={{marginBottom:"15px"}}>

<label style={{display:"block",marginBottom:"5px"}}>Email</label>

<input
type="email"
name="email"
placeholder="admin@email.com"
value={form.email}
onChange={handleChange}
required
style={input}
/>

</div>


<div style={{marginBottom:"15px"}}>

<label style={{display:"block",marginBottom:"5px"}}>Password</label>

<input
type="password"
name="password"
placeholder="Password"
value={form.password}
onChange={handleChange}
required
style={input}
/>

</div>


<div style={{marginBottom:"20px"}}>

<label style={{display:"block",marginBottom:"5px"}}>Confirm Password</label>

<input
type="password"
name="confirmPassword"
placeholder="Confirm Password"
value={form.confirmPassword}
onChange={handleChange}
required
style={input}
/>

</div>


<button
type="submit"
style={{
width:"100%",
// padding:"12px",
background:"#2563eb",
border:"none",
fontWeight:"600",
cursor:"pointer",
display:"block",
margin:"0 auto",
padding:"12px 30px",
color:"white",
borderRadius:"8px",
fontSize:"15px"
}}>
Register as Admin
</button>

</form>

<p style={{textAlign:"center",marginTop:"20px"}}>

Already have admin account?{" "}
<span
onClick={()=>navigate("/travelhub-admin")}
style={{color:"#2563eb",cursor:"pointer"}}
>
Login
</span>

</p>

</div>

</div>

);

};

const input={
width:"100%",
padding:"10px",
border:"1px solid #d1d5db",
borderRadius:"6px",
outline:"none"
};

export default AdminRegister;