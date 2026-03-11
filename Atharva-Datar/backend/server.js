require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
if(!fs.existsSync('uploads')){
fs.mkdirSync('uploads', { recursive: true });
}

const storage = multer.diskStorage({

destination: function(req,file,cb){
cb(null,'uploads/');
},

filename: function(req,file,cb){
cb(null,Date.now() + "-" + file.originalname);
}

});

const upload = multer({storage:storage});

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ status: 'ok', db_time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 🔒 PASSWORD VALIDATION
        if(password.length < 8){
            return res.status(400).json({message:"Password must be at least 8 characters"});
        }

        if(!/[A-Z]/.test(password)){
            return res.status(400).json({message:"Password must contain at least one uppercase letter"});
        }

        if(!/[0-9]/.test(password)){
            return res.status(400).json({message:"Password must contain at least one number"});
        }

        if(!/[@,#,*,!]/.test(password)){
            return res.status(400).json({message:"Password must contain at least one special character (@, #, *, !)"});
        }

        // Check if user already exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        
        //--------------------------------Customer Account Approval------------------
        // const role = req.body.role || 'agent';

        // const newUser = await db.query(
        // 'INSERT INTO users (full_name, email, password, role, status) VALUES ($1,$2,$3,$4,$5) RETURNING id, full_name, email, role',
        // [fullName, email, passwordHash, role, 'pending']
        // );


        const role = req.body.role || 'customer';

        let status = 'pending';

        if(role === 'customer'){
        status = 'approved';
        }

        const newUser = await db.query(
        'INSERT INTO users (full_name, email, password, role, status) VALUES ($1,$2,$3,$4,$5) RETURNING id, full_name, email, role',
        [fullName, email, passwordHash, role, status]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
        } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        if(user.role === "agent" && user.status !== "approved"){
        return res.status(403).json({
        message:"Your account is waiting for admin approval"
        });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify role (case-insensitive for UI match check if needed, but db stores exactly)
        if (role && user.role.toLowerCase() !== role.toLowerCase()) {
            return res.status(403).json({ message: `Access denied. Registered role is ${user.role}` });
        }

        // Remove password before sending
        delete user.password;
        res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Add a package (Agent)
app.post("/api/packages", upload.array('images',5), async (req,res)=>{

try{

const pkg = req.body;

// get uploaded images
const images = req.files ? req.files.map(file => file.filename) : [];

await db.query(
`INSERT INTO packages
(title,destination,days,nights,price,travelers,rating,description,
inclusions,exclusions,itinerary,status,agent_id,images)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending',$12,$13)`,
[
pkg.title,
pkg.destination,
Number(pkg.days || pkg.duration || 1),
Number(pkg.nights || 1),
Number(pkg.price || 0),
Number(pkg.travelers || 1),
Number(pkg.rating || 3),
pkg.description || '',
JSON.stringify(pkg.inclusions || []),
JSON.stringify(pkg.exclusions || []),
JSON.stringify(pkg.itinerary || []),
pkg.agent_id || 1,
JSON.stringify(images)
]);

res.json({success:true});

}catch(err){

console.error(err);
res.status(500).json({message:"Package creation failed"});

}

});

// Get agent packages
app.get('/api/agent/packages', async (req, res) => {
    try {

        const agent_id = req.query.agent_id;

        if(!agent_id){
            return res.status(400).json({ message: "agent_id is required" });
        }

        const agentPackages = await db.query(
            `SELECT *
             FROM packages
             WHERE agent_id = $1
             ORDER BY id DESC`,
            [agent_id]
        );

        res.json(agentPackages.rows);

    } catch (err) {

        console.error("Error fetching agent packages:", err);
        res.status(500).json({ message: 'Server error fetching agent packages' });

    }
});

// Admin Dashboard stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const agents = await db.query("SELECT COUNT(*) FROM users WHERE role = 'agent'");
        res.json({ totalAgents: parseInt(agents.rows[0].count) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// Get all registered agents (Admin)
app.get('/api/admin/agents', async (req, res) => {
    try {

        const agents = await db.query(`
            SELECT id, full_name, email, created_at
            FROM users
            WHERE role = 'agent'
            ORDER BY created_at DESC
        `);

        res.json(agents.rows);

    } catch (err) {

        console.error("Error fetching agents:", err.message);
        res.status(500).json({ message: 'Server error fetching agents' });

    }
});

// Get pending packages for Admin
app.get('/api/admin/pending-packages', async (req, res) => {
    try {
        const pendingPackages = await db.query(
            "SELECT p.*, u.full_name as agent_name FROM packages p LEFT JOIN users u ON p.agent_id = u.id WHERE p.status = 'pending' ORDER BY p.created_at DESC"
        );
        res.json(pendingPackages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error fetching pending packages' });
    }
});

// Approve a package
// app.put('/api/admin/packages/:id/approve', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatePackage = await db.query(
//             "UPDATE packages SET status = 'approved' WHERE id = $1 RETURNING *",
//             [id]
//         );

//         if (updatePackage.rows.length === 0) {
//             return res.status(404).json({ message: 'Package not found' });
//         }
//         res.json({ message: 'Package approved', package: updatePackage.rows[0] });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server error approving package' });
//     }
// });

// Reject a package
// app.put('/api/admin/packages/:id/reject', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatePackage = await db.query(
//             "UPDATE packages SET status = 'rejected' WHERE id = $1 RETURNING *",
//             [id]
//         );

//         if (updatePackage.rows.length === 0) {
//             return res.status(404).json({ message: 'Package not found' });
//         }
//         res.json({ message: 'Package rejected', package: updatePackage.rows[0] });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server error rejecting package' });
//     }
// });

app.get("/api/packages/:id", async (req,res)=>{

try{

const result = await db.query(
"SELECT * FROM packages WHERE id=$1",
[req.params.id]
);

if(result.rows.length === 0){
return res.status(404).json({message:"Package not found"});
}

res.json(result.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching package"});

}

});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} and available on your local network`);
});

app.post("/api/admin/packages/:id/add-image", upload.single("image"), async (req,res)=>{

try{

const { id } = req.params;
const newImage = req.file.filename;

const pkg = await db.query(
"SELECT images FROM packages WHERE id=$1",
[id]
);

let images = pkg.rows[0].images || [];

if(typeof images === "string"){
   images = JSON.parse(images);
}

images.push(newImage);

await db.query(
"UPDATE packages SET images=$1 WHERE id=$2",
[JSON.stringify(images), id]
);

res.json({message:"Image added",images});

}catch(err){

console.error(err);
res.status(500).json({message:"Image upload failed"});

}

});

app.delete("/api/admin/packages/:id/delete-image", async (req,res)=>{

try{

const { id } = req.params;
const { image } = req.body;

const pkg = await db.query(
"SELECT images FROM packages WHERE id=$1",
[id]
);

let images = pkg.rows[0].images || [];

if(typeof images === "string"){
images = JSON.parse(images);
}

images = images.filter(img => img !== image);

await db.query(
"UPDATE packages SET images=$1 WHERE id=$2",
[JSON.stringify(images), id]
);

res.json({message:"Image deleted",images});

}catch(err){

console.error(err);
res.status(500).json({message:"Delete failed"});

}

});

app.put("/api/admin/packages/:id/update-image", upload.single("image"), async (req,res)=>{

try{

const { id } = req.params;
const { oldImage } = req.body;
const newImage = req.file.filename;

const pkg = await db.query(
"SELECT images FROM packages WHERE id=$1",
[id]
);

let images = pkg.rows[0].images || [];

if(typeof images === "string"){
images = JSON.parse(images);
}

images = images.map(img => img === oldImage ? newImage : img);

await db.query(
"UPDATE packages SET images=$1 WHERE id=$2",
[JSON.stringify(images), id]
);

res.json({message:"Image updated",images});

}catch(err){

console.error(err);
res.status(500).json({message:"Update failed"});

}

});

// Delete Agent (Admin)
app.delete('/api/admin/agents/:id', async (req, res) => {
    try {

        const { id } = req.params;

        // prevent deleting admin users
        const userCheck = await db.query(
            "SELECT role FROM users WHERE id = $1",
            [id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userCheck.rows[0].role !== 'agent') {
            return res.status(403).json({ message: "Only agents can be deleted" });
        }

        await db.query(
            "DELETE FROM users WHERE id = $1",
            [id]
        );

        res.json({ message: "Agent deleted successfully" });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Server error deleting agent" });

    }

});

app.post('/api/bookings', async (req, res) => {
    try {

        const { package_id, customer_name, email, travelers } = req.body;

        const booking = await db.query(
            `INSERT INTO bookings 
            (package_id, customer_name, email, travelers, status) 
            VALUES ($1,$2,$3,$4,'confirmed')
            RETURNING *`,
            [package_id, customer_name, email, travelers]
        );

        res.json(booking.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Booking failed"});
    }
    });

// app.get('/api/agent/bookings', async (req,res)=>{
//     try{

//         const { agent_id } = req.query;

//         const bookings = await db.query(`
//             SELECT b.*, p.title
//             FROM bookings b
//             JOIN packages p ON b.package_id = p.id
//             WHERE p.agent_id = $1
//             ORDER BY b.created_at DESC
//         `,[agent_id]);

//         res.json(bookings.rows);

//     }catch(err){
//         console.error(err);
//         res.status(500).json({message:"Error fetching bookings"});
//     }
// });

// app.post('/api/bookings', async (req, res) => {

// try {

// const { package_id, customer_name, email, travelers, travel_date } = req.body;

// const pkg = await db.query(
// 'SELECT * FROM packages WHERE id=$1 AND status=$2',
// [package_id, 'approved']
// );

// if(pkg.rows.length === 0){
// return res.status(404).json({ message: "Package not available" });
// }

// const newBooking = await db.query(
// `INSERT INTO bookings
// (package_id, customer_name, email, travelers, travel_date, status)
// VALUES ($1,$2,$3,$4,$5,'confirmed')
// RETURNING *`,
// [package_id, customer_name, email, travelers, travel_date]
// );

// res.json(newBooking.rows[0]);

// }catch(err){
// console.error(err);
// res.status(500).json({ message:'Booking failed' });
// }

// });

// app.get('/api/agent/bookings', async (req,res)=>{

// try{

// const { agent_id } = req.query;

// const bookings = await db.query(

// `SELECT b.*, p.title
// FROM bookings b
// JOIN packages p ON b.package_id = p.id
// WHERE p.agent_id = $1
// ORDER BY b.created_at DESC`,

// [agent_id]

// );

// res.json(bookings.rows);

// }catch(err){

// console.error(err);
// res.status(500).json({message:"Error fetching bookings"});

// }

// });

app.put(
'/api/agent/profile/:id',
upload.fields([
{ name: 'agent_photo', maxCount: 1 },
{ name: 'company_logo', maxCount: 1 }
]),
async (req,res)=>{

try{

const agency_name = req.body?.agency_name || '';
const agent_name = req.body?.agent_name || '';
const phone = req.body?.phone || '';
const address = req.body?.address || '';

const agentPhoto =
req.files?.agent_photo ? req.files.agent_photo[0].filename : null;

const companyLogo =
req.files?.company_logo ? req.files.company_logo[0].filename : null;

const updated = await db.query(
`UPDATE users
SET agency_name=$1,
full_name=$2,
phone=$3,
address=$4,
agent_photo = COALESCE($5, agent_photo),
company_logo = COALESCE($6, company_logo)
WHERE id=$7
RETURNING *`,

[
agency_name,
agent_name,
phone,
address,
agentPhoto,
companyLogo,
req.params.id
]

);

res.json(updated.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({message:"Update failed"});

}

});

app.get('/api/packages/approved', async(req,res)=>{

try{

const result = await db.query(
"SELECT * FROM packages WHERE status='approved' ORDER BY created_at DESC"
);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({message:"Server error"});

}

});

// app.post('/api/bookings', async(req,res)=>{

// try{

// const {customer_name,package_id,travelers,travel_date} = req.body;

// const result = await db.query(

// `INSERT INTO bookings 
// (customer_name,package_id,travelers,travel_date,status)
// VALUES ($1,$2,$3,$4,'confirmed') RETURNING *`,

// [customer_name,package_id,travelers,travel_date]

// );

// res.json(result.rows[0]);

// }catch(err){

// console.error(err);
// res.status(500).json({message:"Booking error"});

// }

// });

// app.get('/api/agent/bookings', async(req,res)=>{

// try{

// const {agent_id} = req.query;

// const result = await db.query(

// `SELECT b.*,p.title 
// FROM bookings b
// JOIN packages p ON b.package_id = p.id
// WHERE p.agent_id=$1
// ORDER BY b.id DESC`,

// [agent_id]

// );

// res.json(result.rows);

// }catch(err){

// console.error(err);
// res.status(500).json({message:"Server error"});

// }

// });

app.get('/api/admin/all-packages', async (req,res)=>{

try{

const result = await db.query(`
SELECT p.*, u.full_name as agent_name
FROM packages p
LEFT JOIN users u ON p.agent_id = u.id
ORDER BY p.created_at DESC
`);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching packages"});

}

});

app.get('/api/customer/profile/:id', async (req,res)=>{

try{

const result = await db.query(
"SELECT id, full_name, email, phone, address FROM users WHERE id=$1",
[req.params.id]
);

res.json(result.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching profile"});

}

});

app.put('/api/customer/profile/:id', async (req,res)=>{

try{

const { full_name, phone, address } = req.body;

const updated = await db.query(

`UPDATE users
SET full_name=$1,
phone=$2,
address=$3
WHERE id=$4
RETURNING *`,

[
full_name,
phone,
address,
req.params.id
]

);

res.json(updated.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({message:"Update failed"});

}

});

app.get('/api/admin/pending-users', async(req,res)=>{

try{

const result = await db.query(
"SELECT id, full_name, email, role FROM users WHERE status='pending'"
);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching users"});

}

});

app.put('/api/admin/users/:id/approve', async(req,res)=>{

await db.query(
"UPDATE users SET status='approved' WHERE id=$1",
[req.params.id]
);

res.json({message:"User approved"});

});

app.put('/api/admin/users/:id/reject', async(req,res)=>{

await db.query(
"UPDATE users SET status='rejected' WHERE id=$1",
[req.params.id]
);

res.json({message:"User rejected"});

});

app.get('/api/admin/accounts', async(req,res)=>{

try{

const result = await db.query(
"SELECT id, full_name, email, role, status FROM users ORDER BY created_at DESC"
);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching accounts"});

}

});

app.post('/api/forgot-password', async(req,res)=>{

try{

const {email,password} = req.body;

const user = await db.query(
"SELECT * FROM users WHERE email=$1",
[email]
);

if(user.rows.length === 0){
return res.status(404).json({message:"Email not found"});
}

const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password,salt);

await db.query(
"UPDATE users SET password=$1 WHERE email=$2",
[passwordHash,email]
);

res.json({message:"Password updated successfully"});

}catch(err){

console.error(err);
res.status(500).json({message:"Server error"});

}

});

app.post("/api/agent/update-package", upload.array("images",5), async (req, res) => {

try{

const {
package_id,
agent_id,
title,
destination,
days,
nights,
travelers,
price,
description,
inclusions,
exclusions,
itinerary
} = req.body;

if(!package_id || !agent_id){
return res.status(400).json({message:"Missing package or agent id"});
}

/* uploaded images */

const images = req.files ? req.files.map(file => file.filename) : [];

await db.query(
`INSERT INTO package_requests
(package_id, agent_id, request_type, new_data)
VALUES ($1,$2,'UPDATE',$3)`,
[
package_id,
agent_id,
JSON.stringify(req.body)
]
);

res.json({message:"Update request sent to admin"});

}catch(err){

console.error(err);
res.status(500).json({message:"Update request failed"});

}

});

app.post("/api/agent/delete-package", async (req,res)=>{

const { package_id, agent_id } = req.body;

if(!package_id || !agent_id){
return res.status(400).json({message:"Missing data"});
}

await db.query(
`INSERT INTO package_requests
(package_id, agent_id, request_type)
VALUES ($1,$2,'DELETE')`,
[package_id,agent_id]
);

res.json({message:"Delete request sent to admin"});
});

app.get("/admin/package-requests", async (req,res)=>{

try{

const result = await db.query(`
SELECT 
pr.request_id,
pr.package_id,
pr.request_type,
pr.status,
pr.agent_id,
u.full_name as agent_name,

-- NEW DATA FROM REQUEST JSON
(pr.new_data->>'title') AS title,
(pr.new_data->>'destination') AS destination,
(pr.new_data->>'days')::int AS days,
(pr.new_data->>'nights')::int AS nights,
(pr.new_data->>'travelers')::int AS travelers,
(pr.new_data->>'rating')::int AS rating,
(pr.new_data->>'price')::numeric AS price,
(pr.new_data->>'description') AS description,
(pr.new_data->>'inclusions') AS inclusions,
(pr.new_data->>'exclusions') AS exclusions,
(pr.new_data->>'itinerary') AS itinerary

FROM package_requests pr
LEFT JOIN users u ON pr.agent_id = u.id
WHERE LOWER(pr.status) = 'pending'
ORDER BY pr.request_id DESC
`);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching requests"});

}

});

app.post("/admin/approve-request", async (req,res)=>{

try{

const { request_id } = req.body;

/* get request */

const request = await db.query(
`SELECT * FROM package_requests WHERE request_id=$1`,
[request_id]
);

if(request.rows.length === 0){
return res.status(404).json({message:"Request not found"});
}

const r = request.rows[0];

/* UPDATE request status FIRST */

await db.query(
`UPDATE package_requests SET status='approved' WHERE request_id=$1`,
[request_id]
);

/* handle UPDATE request */

if(r.request_type === "UPDATE"){

const data = typeof r.new_data === "string"
? JSON.parse(r.new_data)
: r.new_data;

await db.query(
`UPDATE packages SET
title=$1,
destination=$2,
days=$3,
nights=$4,
travelers=$5,
price=$6,
rating=$7,
description=$8,
inclusions=$9,
exclusions=$10,
itinerary=$11,
status='approved'
WHERE id=$12`,
[
data.title,
data.destination,
data.days,
data.nights,
data.travelers,
data.price,
data.rating,
data.description,
JSON.stringify(data.inclusions),
JSON.stringify(data.exclusions),
JSON.stringify(data.itinerary),
r.package_id
]
);

}

/* handle DELETE request */

if(r.request_type === "DELETE"){

await db.query(
`DELETE FROM packages WHERE id=$1`,
[r.package_id]
);

}

res.json({message:"Request approved"});

}catch(err){

console.error(err);
res.status(500).json({message:"Approval failed"});

}

});

app.post("/admin/reject-request", async (req,res)=>{

try{

const { request_id } = req.body;

await db.query(
`UPDATE package_requests
SET status='rejected'
WHERE request_id=$1`,
[request_id]
);

res.json({message:"Request rejected"});

}catch(err){

console.error(err);
res.status(500).json({message:"Reject failed"});

}

});

app.put('/api/admin/packages/:id/approve', async (req, res) => {
try {

const { id } = req.params;

await db.query(
"UPDATE packages SET status='approved' WHERE id=$1",
[id]
);

res.json({message:"Package approved"});

} catch(err){
console.error(err);
res.status(500).json({message:"Approval failed"});
}
});


app.put('/api/admin/packages/:id/reject', async (req, res) => {
try {

const { id } = req.params;

await db.query(
"UPDATE packages SET status='rejected' WHERE id=$1",
[id]
);

res.json({message:"Package rejected"});

} catch(err){
console.error(err);
res.status(500).json({message:"Reject failed"});
}
});