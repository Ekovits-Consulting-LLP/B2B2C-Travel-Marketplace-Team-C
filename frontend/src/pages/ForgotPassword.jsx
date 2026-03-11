import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [message,setMessage] = useState("");

const navigate = useNavigate();

const resetPassword = async(e)=>{

e.preventDefault();

const res = await fetch("/api/forgot-password",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})
});

const data = await res.json();

setMessage(data.message);

if(res.ok){
setTimeout(()=>{
navigate("/login");
},2000);
}

};

return(

<div style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"#f1f5f9"
}}>

<form
onSubmit={resetPassword}
style={{
background:"white",
padding:"40px",
borderRadius:"10px",
width:"350px"
}}
>

<h2 style={{marginBottom:"20px"}}>Reset Password</h2>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
style={{width:"100%",padding:"10px",marginBottom:"15px"}}
/>

<input
type="password"
placeholder="New password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
style={{width:"100%",padding:"10px",marginBottom:"15px"}}
/>

<button
type="submit"
style={{
width:"100%",
padding:"10px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"6px"
}}
>
Reset Password
</button>

{message && (
<p style={{marginTop:"15px",textAlign:"center"}}>
{message}
</p>
)}

</form>

</div>

);

};

export default ForgotPassword;