import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Users } from "lucide-react";

const AdminAgents = () => {

const navigate = useNavigate();

const [agents,setAgents] = useState([]);
const [loading,setLoading] = useState(true);
const [deletingId,setDeletingId] = useState(null);

useEffect(()=>{
fetchAgents();
},[]);

const fetchAgents = async () => {

try{

const res = await fetch("/api/admin/agents");

if(res.ok){

const data = await res.json();
setAgents(data);

}

}catch(err){

console.error("Failed to fetch agents",err);

}

setLoading(false);

};


// DELETE AGENT
const deleteAgent = async (id) => {

const confirmDelete = window.confirm("Are you sure you want to delete this agent?");

if(!confirmDelete) return;

try{

setDeletingId(id);

const res = await fetch(`/api/admin/agents/${id}`,{
method:"DELETE"
});

if(res.ok){

setAgents(prev => prev.filter(a => a.id !== id));

}else{

alert("Failed to delete agent");

}

}catch(err){

console.error("Delete failed",err);

}

setDeletingId(null);

};


return(

<div style={{
padding:"40px",
background:"#f8fafc",
minHeight:"100vh"
}}>

{/* BACK BUTTON */}

<button
onClick={()=>navigate("/admin-dashboard")}
style={{
display:"flex",
alignItems:"center",
gap:"6px",
marginBottom:"20px",
border:"none",
background:"transparent",
cursor:"pointer",
fontSize:"14px",
color:"#374151"
}}
>
<ArrowLeft size={16}/> Back
</button>


{/* PAGE HEADER */}

<h1 style={{
marginBottom:"8px",
fontSize:"28px",
fontWeight:"700",
color:"#111827"
}}>
Registered Agents
</h1>

<p style={{
color:"#6b7280",
marginBottom:"30px",
fontSize:"14px"
}}>
Total Agents: {agents.length}
</p>



{/* LOADING */}

{loading ? (

<p style={{color:"#6b7280"}}>Loading agents...</p>

) : agents.length === 0 ? (

<div style={{
background:"white",
padding:"40px",
borderRadius:"12px",
textAlign:"center",
boxShadow:"0 4px 15px rgba(0,0,0,0.05)"
}}>

<Users size={40} style={{marginBottom:"10px",color:"#9ca3af"}}/>

<p style={{color:"#6b7280"}}>No agents registered</p>

</div>

) : (

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
gap:"20px"
}}>

{agents.map(agent => (

<div
key={agent.id}
style={{
background:"white",
padding:"22px",
borderRadius:"12px",
boxShadow:"0 4px 15px rgba(0,0,0,0.05)",
transition:"0.2s",
position:"relative",
cursor:"default"
}}

onMouseEnter={(e)=>e.currentTarget.style.transform="translateY(-5px)"}
onMouseLeave={(e)=>e.currentTarget.style.transform="translateY(0px)"}
>

{/* DELETE BUTTON */}

<button
onClick={()=>deleteAgent(agent.id)}
disabled={deletingId === agent.id}
style={{
position:"absolute",
top:"14px",
right:"14px",
background:"#ef4444",
border:"none",
color:"white",
borderRadius:"6px",
padding:"6px 8px",
cursor:"pointer",
opacity: deletingId === agent.id ? 0.6 : 1
}}
>
<Trash2 size={14}/>
</button>


{/* AVATAR */}

<div style={{
width:"52px",
height:"52px",
borderRadius:"50%",
background:"#2563eb",
color:"white",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"bold",
marginBottom:"14px",
fontSize:"18px"
}}>
{agent.full_name.charAt(0)}
</div>


{/* NAME */}

<h3 style={{
marginBottom:"6px",
fontSize:"16px",
fontWeight:"600",
color:"#111827"
}}>
{agent.full_name}
</h3>


{/* EMAIL */}

<p style={{
color:"#6b7280",
fontSize:"14px",
marginBottom:"6px"
}}>
{agent.email}
</p>


{/* JOIN DATE */}

<p style={{
fontSize:"12px",
color:"#9ca3af"
}}>
Joined {new Date(agent.created_at).toLocaleDateString()}
</p>

</div>

))}

</div>

)}

</div>

);

};

export default AdminAgents;