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

const upload = multer({
storage,
limits:{ fileSize: 5 * 1024 * 1024 } // 5MB
});

const app = express();
const PORT = process.env.PORT || 5000;

// Helper function to parse images consistently across all endpoints
const serializePackage = (pkg) => {
   if (!pkg) return pkg;
    return {
        ...pkg,
        images: (() => {
            try {
                if (!pkg.images) return [];
                if (Array.isArray(pkg.images)) return pkg.images;
                if (typeof pkg.images === 'string') {
                    const parsed = JSON.parse(pkg.images);
                    return Array.isArray(parsed) ? parsed : [];
                }
                return [];
            } catch (e) {
                console.warn('Error parsing images for package', pkg.id, ':', e.message);
                return [];
            }
        })()
    };
};

const serializePackages = (packages) => {
    if (!Array.isArray(packages)) return [];
    return packages.map(serializePackage);
};

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
app.post("/api/packages", upload.any(), async (req,res)=>{

console.log("BODY:", req.body);
console.log("FILES:", req.files);

try{

    console.log("FILES RECEIVED:", req.files);  

    let pkg = req.body;
    
    // FormData sends arrays/objects as JSON strings, so we need to parse them
    try { if (typeof pkg.inclusions === 'string') pkg.inclusions = JSON.parse(pkg.inclusions); } catch(e) {}
    try { if (typeof pkg.exclusions === 'string') pkg.exclusions = JSON.parse(pkg.exclusions); } catch(e) {}
    try { if (typeof pkg.itinerary === 'string') pkg.itinerary = JSON.parse(pkg.itinerary); } catch(e) {}
    try { if (typeof pkg.package_types === 'string') pkg.package_types = JSON.parse(pkg.package_types); } catch(e) {}
    try { if (typeof pkg.hotels === 'string') pkg.hotels = JSON.parse(pkg.hotels); } catch(e) {}

    // get uploaded images
    const images = req.files ? req.files.map(file => file.filename) : [];

const result = await db.query(
`INSERT INTO packages
(title,destination,days,nights,price,travelers,rating,description,
inclusions,exclusions,itinerary,status,agent_id,images,package_types,hotels,
offer_percent,offer_status,offer_expiry,is_featured)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending',$12,$13,$14,$15,$16,$17,NULL,$18) RETURNING id`,
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
JSON.stringify(images),
JSON.stringify(pkg.package_types || []),
JSON.stringify(pkg.hotels || []),
Number(pkg.offer_percent || 0),
pkg.offer_percent > 0 ? 'pending' : 'none',
pkg.is_featured === 'true' || pkg.is_featured === true
]);

const newPackageId = result.rows[0].id;

// Handle hotels if provided
// if (pkg.hotels && Array.isArray(pkg.hotels)) {
//     for (const hotel of pkg.hotels) {
//         await db.query(
//             "INSERT INTO hotels (package_id, day_number, hotel_name) VALUES ($1, $2, $3)",
//             [newPackageId, hotel.day, hotel.name]
//         );
//     }
// }

res.json({success:true});

}catch(err){

console.error(err);
res.status(500).json({message:"Package creation failed"});

}

});

// app.post("/api/agent/update-package", upload.array('images', 5), async (req, res) => {
//     try {
//         let { package_id, agent_id, ...newData } = req.body;

//         // Parse JSON strings from FormData
//         try { if (typeof newData.inclusions === 'string') newData.inclusions = JSON.parse(newData.inclusions); } catch (e) {}
//         try { if (typeof newData.exclusions === 'string') newData.exclusions = JSON.parse(newData.exclusions); } catch (e) {}
//         try { if (typeof newData.itinerary === 'string') newData.itinerary = JSON.parse(newData.itinerary); } catch (e) {}
//         try { if (typeof newData.package_types === 'string') newData.package_types = JSON.parse(newData.package_types); } catch (e) {}

//         const images = req.files ? req.files.map(file => file.filename) : [];
        
//         await db.query(
//             `INSERT INTO package_requests (package_id, agent_id, request_type, new_title, new_price, new_description, new_images, new_data)
//              VALUES ($1, $2, 'UPDATE', $3, $4, $5, $6, $7)`,
//             [
//                 package_id,
//                 agent_id,
//                 newData.title,
//                 newData.price,
//                 newData.description,
//                 JSON.stringify(images),
//                 JSON.stringify(newData)
//             ]
//         );

//         res.json({ success: true, message: "Update request submitted for approval" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to submit update request" });
//     }
// });

// Get agent packages
app.get('/api/agent/packages', async (req, res) => {
    try {

        const requestedAgentId = req.query.agent_id;

        // If no agent_id is provided, return all packages (for agents to view all)
        if (!requestedAgentId) {
            const allPackages = await db.query(`SELECT * FROM packages ORDER BY id DESC`);
            return res.json(serializePackages(allPackages.rows));
        }

        const agentId = Number(requestedAgentId);

        // Ensure all packages are mapped to an agent; if missing, assign default agent.
        await db.query(
            `UPDATE packages SET agent_id = $1 WHERE agent_id IS NULL OR agent_id = 0`,
            [1] // default agent
        );

        const agentPackages = await db.query(
            `SELECT * FROM packages WHERE agent_id = $1 ORDER BY id DESC`,
            [agentId]
        );

        res.json(serializePackages(agentPackages.rows));

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
            `SELECT p.*, u.full_name as agent_name
            FROM packages p 
            LEFT JOIN users u ON p.agent_id = u.id 
            WHERE p.status = 'pending' 
            ORDER BY p.created_at DESC`
        );
        res.json(serializePackages(pendingPackages.rows));
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
app.get('/api/packages/approved', async(req,res)=>{
    try{
        const { destination } = req.query;
        let query = `SELECT *,
            (price::numeric - (price::numeric * COALESCE(offer_percent::numeric,0) / 100)) AS final_price
            FROM packages
            WHERE status='approved'`;
        
        let params = [];
        if (destination) {
            query += ` AND destination ILIKE $1`;
            params.push(`%${destination}%`);
        }

        const result = await db.query(query, params);
        res.json(serializePackages(result.rows));
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
});

app.get("/api/packages/:id", async (req,res)=>{

try{

const result = await db.query(
`SELECT p.*, u.full_name as agent_name, u.email as agent_email, u.phone as agent_phone, 
u.agency_name, u.agent_photo, u.company_logo,
(p.price::numeric - (p.price::numeric * COALESCE(p.offer_percent::numeric,0) / 100)) AS final_price
FROM packages p
LEFT JOIN users u ON p.agent_id = u.id
WHERE p.id=$1`,
[req.params.id]
);

if(result.rows.length === 0){
return res.status(404).json({message:"Package not found"});
}

const pkg = result.rows[0];
pkg.images = typeof pkg.images === 'string' ? JSON.parse(pkg.images || '[]') : (pkg.images || []);

res.json(pkg);

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching package"});

}

});

// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on port ${PORT} and available on your local network`);
// });

app.post("/api/admin/packages/:id/add-image", upload.any(), async (req,res)=>{

try{

const { id } = req.params;

/* get uploaded images */
const newImages = (req.files || [])
.filter(f => f.fieldname === "images")
.map(f => f.filename);

const pkg = await db.query(
"SELECT images FROM packages WHERE id=$1",
[id]
);

let images = pkg.rows[0].images || [];

if(typeof images === "string"){
images = JSON.parse(images);
}

/* merge old and new images */
images = [...images, ...newImages];

await db.query(
`UPDATE packages SET images=$1 WHERE id=$2`,
[JSON.stringify(images), id]
);

res.json({message:"Images added",images});

}catch(err){

console.error(err);
res.status(500).json({message:"Image upload failed"});

}

});

app.put("/api/admin/packages/:id/update-image", upload.single("images"), async (req,res)=>{

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
`UPDATE packages SET images=$1 WHERE id=$2`,
[JSON.stringify(images), id]
);

res.json({message:"Image updated",images});

}catch(err){

console.error(err);
res.status(500).json({message:"Update failed"});

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
`UPDATE packages SET images=$1 WHERE id=$2`,
[JSON.stringify(images), id]
);

res.json({message:"Image deleted", images});

}catch(err){

console.error(err);
res.status(500).json({message:"Delete failed"});

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
        const { package_id, customer_name, email, phone, address, city, country, age, travelers, travel_date, additional_travelers } = req.body;

        const booking = await db.query(
            `INSERT INTO bookings 
            (package_id, customer_name, email, phone, address, city, country, age, travelers, travel_date, additional_travelers, status) 
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'confirmed')
            RETURNING *`,
            [
              package_id,
              customer_name,
              email,
              phone || null,
              address || null,
              city || null,
              country || null,
              age || null,
              travelers || 1,
              travel_date || null,
              additional_travelers ? JSON.stringify(additional_travelers) : null
            ]
        );

        res.json(booking.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Booking failed"});
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const { email, customer_name, package_id } = req.query;

        let query = `
            SELECT b.*, p.title as package_title, p.agent_id, u.full_name AS agent_name 
            FROM bookings b
            JOIN packages p ON b.package_id = p.id
            LEFT JOIN users u ON p.agent_id = u.id
        `;

        const conditions = [];
        const params = [];

        if (email) {
            params.push(email.toLowerCase().trim());
            conditions.push(`LOWER(b.email) = $${params.length}`);
        }

        if (customer_name) {
            params.push(customer_name.toLowerCase().trim());
            conditions.push(`LOWER(b.customer_name) = $${params.length}`);
        }

        if (package_id) {
            params.push(package_id);
            conditions.push(`b.package_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY b.created_at DESC`;

        const result = await db.query(query, params);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

app.get('/api/agent/bookings', async (req,res)=>{
    try{
        const { agent_id, package_id, status } = req.query;

        let query = `
            SELECT b.*, p.title as package_title
            FROM bookings b
            JOIN packages p ON b.package_id = p.id
        `;

        const conditions = [];
        const params = [];

        if (agent_id) {
            params.push(agent_id);
            conditions.push(`p.agent_id = $${params.length}`);
        }

        if (package_id) {
            params.push(package_id);
            conditions.push(`b.package_id = $${params.length}`);
        }

        if (status) {
            params.push(status);
            conditions.push(`b.status = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY b.created_at DESC`;

        const bookings = await db.query(query, params);

        res.json(bookings.rows);

    } catch(err){
        console.error(err);
        res.status(500).json({message:"Error fetching bookings"});
    }
});

console.log('Registering route GET /api/bookings/:id/receipt');
app.get('/api/bookings/:id/receipt', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const bookingRes = await db.query(`SELECT b.*, p.title as package_title, p.destination, p.days, p.nights, p.price as package_price FROM bookings b JOIN packages p ON b.package_id = p.id WHERE b.id = $1`, [bookingId]);

        if (bookingRes.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookingRes.rows[0];

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="receipt.pdf"`);
        doc.pipe(res);

        doc.fontSize(20).text('TravelHub Booking Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);

        doc.text(`Booking ID: ${booking.id}`);
        doc.text(`Customer Name: ${booking.customer_name}`);
        doc.text(`Email: ${booking.email || 'N/A'}`);
        doc.text(`Phone: ${booking.phone || 'N/A'}`);
        doc.text(`Address: ${booking.address || 'N/A'}`);
        doc.text(`City: ${booking.city || 'N/A'}`);
        doc.text(`Country: ${booking.country || 'N/A'}`);
        doc.text(`Customer Age: ${booking.age || 'N/A'}`);
        
        doc.moveDown();
        doc.fontSize(16).text('Package Information');
        doc.fontSize(12);
        doc.text(`Package: ${booking.package_title}`);
        doc.text(`Destination: ${booking.destination}`);
        doc.text(`Duration: ${booking.days || 'N/A'} days / ${booking.nights || 'N/A'} nights`);
        doc.text(`Travel Date: ${booking.travel_date ? new Date(booking.travel_date).toLocaleDateString() : 'N/A'}`);
        doc.text(`Total Travelers: ${booking.travelers || 1}`);

        if (booking.additional_travelers) {
            try {
                const add = JSON.parse(booking.additional_travelers);
                if (add && add.length > 0) {
                    doc.moveDown();
                    doc.text('Additional Travelers:');
                    add.forEach((t, i) => {
                        doc.text(` ${i+2}. ${t.firstName} ${t.lastName} (Age: ${t.age})`);
                    });
                }
            } catch (e) {}
        }
        
        doc.moveDown();
        doc.fontSize(16).text('Payment Details');
        doc.fontSize(12);
        doc.text(`Status: ${booking.status}`);
        doc.text(`Package Price (per person): INR ${booking.package_price}`);
        doc.text(`Total Amount: ${Number(booking.package_price) * Number(booking.travelers || 1)}`);
        
        doc.moveDown(2);
        doc.text(`Generated at: ${new Date().toLocaleString()}`);

        doc.end();

    } catch (err) {
        console.error('Receipt error', err);
        res.status(500).json({ message: 'Error generating receipt' });
    }
});

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



//---------------------------Deals & Offers---------------------------
app.get('/api/deals', async(req,res)=>{

try{

const result = await db.query(
`SELECT *,
(price - (price * offer_percent / 100)) AS final_price
FROM packages
WHERE status='approved'
AND offer_percent > 0
AND offer_status='approved'
AND (offer_expiry IS NULL OR offer_expiry >= CURRENT_DATE)
ORDER BY offer_percent DESC`
);

res.json(serializePackages(result.rows));

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching deals"});

}

});

// Reviews endpoints
app.get('/api/reviews', async(req,res)=>{
    try{
        const { package_id, agent_id, review_type } = req.query;
        let query = `SELECT r.*, u.full_name as consumer_name, p.title as package_title, a.full_name as agent_name
                     FROM reviews r
                     JOIN users u ON r.consumer_id = u.id
                     JOIN packages p ON r.package_id = p.id
                     JOIN users a ON r.agent_id = a.id`;
        const conditions = [];
        const params = [];

        if(package_id){ params.push(package_id); conditions.push(`r.package_id=$${params.length}`); }
        if(agent_id){ params.push(agent_id); conditions.push(`r.agent_id=$${params.length}`); }
        if(review_type){ params.push(review_type); conditions.push(`r.review_type=$${params.length}`); }

        if(conditions.length){
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY r.created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Error fetching reviews"});
    }
});

app.post('/api/reviews', async(req,res)=>{
    try{
        const { consumer_id, package_id, agent_id, review_type, rating, description } = req.body;

        if(!consumer_id || !package_id || !agent_id || !review_type || !rating){
            return res.status(400).json({message: 'Missing required fields'});
        }

        const allowedReviewTypes = ['package','agent'];
        if(!allowedReviewTypes.includes(review_type)){
            return res.status(400).json({message:'Invalid review type'});
        }

        if(rating < 1 || rating > 5){
            return res.status(400).json({message:'Rating must be between 1 and 5'});
        }

        const result = await db.query(
            `INSERT INTO reviews (consumer_id, package_id, agent_id, review_type, rating, description)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [consumer_id, package_id, agent_id, review_type, rating, description || '']
        );

        res.status(201).json(result.rows[0]);
    } catch(err){
        console.error(err);
        if(err.code === '23505'){
            return res.status(409).json({message:'You already submitted this review for this package/type.'});
        }
        res.status(500).json({message:'Error saving review'});
    }
});

app.get('/api/packages/:id/reviews', async(req,res)=>{
    try{
        const result = await db.query(
            `SELECT r.*, u.full_name as consumer_name, a.full_name as agent_name
             FROM reviews r
             JOIN users u ON r.consumer_id = u.id
             JOIN users a ON r.agent_id = a.id
             WHERE r.package_id = $1
             ORDER BY r.created_at DESC`,
            [req.params.id]
        );

        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({message:'Error fetching package reviews'});
    }
});

app.get('/api/featured-packages', async(req,res)=>{

try{

const result = await db.query(
`SELECT *
FROM packages
WHERE status='approved'
AND is_featured = true
ORDER BY created_at DESC`
);

res.json(serializePackages(result.rows));

}catch(err){

console.error(err);
res.status(500).json({message:"Error fetching featured packages"});

}

});

app.put('/api/admin/packages/:id/set-offer', async(req,res)=>{

try{

const { offer_percent, offer_expiry } = req.body;

await db.query(
`UPDATE packages
SET offer_percent=$1,
offer_status='approved',
offer_expiry=$2
WHERE id=$3`,
[
offer_percent,
offer_expiry,
req.params.id
]
);

res.json({message:"Offer updated"});

}catch(err){

console.error(err);
res.status(500).json({message:"Offer update failed"});

}

});

app.put('/api/agent/packages/:id/request-offer', async(req,res)=>{

try{

const { offer_percent, offer_expiry } = req.body;

await db.query(
`UPDATE packages
SET offer_percent=$1,
offer_status='pending',
offer_expiry=$2
WHERE id=$3`,
[
offer_percent,
offer_expiry,
req.params.id
]
);

res.json({message:"Offer request sent to admin"});

}catch(err){

console.error(err);
res.status(500).json({message:"Offer request failed"});

}

});

app.put('/api/admin/packages/:id/approve-offer', async(req,res)=>{

await db.query(
`UPDATE packages
SET offer_status='approved'
WHERE id=$1`,
[req.params.id]
);

res.json({message:"Offer approved"});

});

// app.put('/api/admin/packages/:id/feature', async(req,res)=>{

// await db.query(
// `UPDATE packages
// SET is_featured=true
// WHERE id=$1`,
// [req.params.id]
// );

// res.json({message:"Package featured"});

// });

app.put('/api/admin/packages/:id/feature', async(req,res)=>{

try{

const { is_featured } = req.body;

await db.query(
`UPDATE packages
SET is_featured=$1
WHERE id=$2`,
[is_featured, req.params.id]
);

res.json({message:"Featured status updated"});

}catch(err){

console.error(err);
res.status(500).json({message:"Update failed"});

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

const rows = result.rows.map(pkg => ({
  ...pkg,
  images: typeof pkg.images === 'string' ? JSON.parse(pkg.images || '[]') : (pkg.images || [])
}));
res.json(rows);

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

// app.post("/api/agent/update-package", upload.array("images",5), async (req, res) => {

// try{

// const {
// package_id,
// agent_id,
// title,
// destination,
// days,
// nights,
// travelers,
// price,
// description,
// inclusions,
// exclusions,
// itinerary
// } = req.body;

// if(!package_id || !agent_id){
// return res.status(400).json({message:"Missing package or agent id"});
// }

// /* uploaded images */

// const images = req.files ? req.files.map(file => file.filename) : [];

// await db.query(
// `INSERT INTO package_requests
// (package_id, agent_id, request_type, new_data)
// VALUES ($1,$2,'UPDATE',$3)`,
// [
// package_id,
// agent_id,
// JSON.stringify(req.body)
// ]
// );

// res.json({message:"Update request sent to admin"});

// }catch(err){

// console.error(err);
// res.status(500).json({message:"Update request failed"});

// }

// });

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

app.put('/api/admin/packages/:id/approve', async (req, res) => {
try {

const { id } = req.params;

await db.query(
`UPDATE packages SET status='approved' WHERE id=$1`,
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
`UPDATE packages SET status='rejected' WHERE id=$1`,
[id]
);

res.json({message:"Package rejected"});

} catch(err){
console.error(err);
res.status(500).json({message:"Reject failed"});
}
});


/* =========================================================
   AGENT: SEND UPDATE REQUEST
   ========================================================= */

app.post('/api/agent/update-package', upload.any(), async (req, res) => {
    try {
        const {
            package_id, agent_id,
            title, destination,
            days, nights, travelers, price, rating,
            description,
            inclusions, exclusions,
            itinerary, package_types, hotels
        } = req.body;

        const parseField = (val) => {
            if (!val) return [];
            try { return typeof val === 'string' ? JSON.parse(val) : val; }
            catch { return []; }
        };

        const imageFilenames = (req.files || [])
        .filter(f => f.fieldname === "images")
        .map(f => f.filename);

        const newData = {
            title, destination,
            days: Number(days), nights: Number(nights),
            travelers: Number(travelers), price: Number(price),
            rating: Number(rating),
            description,
            inclusions: parseField(inclusions),
            exclusions: parseField(exclusions),
            itinerary: parseField(itinerary),
            package_types: parseField(package_types),
            hotels: parseField(hotels),
            images: imageFilenames,
            offer_percent: Number(req.body.offer_percent || 0),
            is_featured: req.body.is_featured === 'true' || req.body.is_featured === true
        };

        await db.query(
            `INSERT INTO package_requests
             (package_id, agent_id, request_type, new_title, new_price, new_description, new_images, new_data, status)
             VALUES ($1, $2, 'UPDATE', $3, $4, $5, $6, $7, 'PENDING')`,
            [
                package_id, agent_id,
                title, Number(price), description,
                JSON.stringify(imageFilenames),
                JSON.stringify(newData)
            ]
        );

        res.json({ message: 'Update request submitted successfully' });

    } catch (err) {
        console.error('update-package error:', err);
        res.status(500).json({ message: 'Failed to submit update request', error: err.message });
    }
});


/* =========================================================
   ADMIN: GET ALL PENDING PACKAGE UPDATE REQUESTS
   ========================================================= */

app.get('/admin/package-requests', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                pr.request_id,
                pr.package_id,
                pr.request_type,
                pr.status,
                pr.agent_id,
                u.full_name as agent_name,
                p.title as current_title,
                
                -- EXTRACT NEW DATA
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
                (pr.new_data->>'itinerary') AS itinerary,
                (pr.new_data->>'package_types') AS package_types,
                (pr.new_data->>'hotels') AS hotels,
                (pr.new_data->>'offer_percent')::numeric AS offer_percent,
                (pr.new_data->>'is_featured')::boolean AS is_featured,
                pr.new_data,
                pr.created_at
             FROM package_requests pr
             JOIN users u ON pr.agent_id = u.id
             JOIN packages p ON pr.package_id = p.id
             WHERE pr.status = 'PENDING'
             ORDER BY pr.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
});


/* =========================================================
   ADMIN: APPROVE AN UPDATE REQUEST
   ========================================================= */

app.post('/admin/approve-request', async (req, res) => {
    try {
        const { request_id } = req.body;

        // Get the request
        const reqResult = await db.query(
            'SELECT * FROM package_requests WHERE request_id = $1',
            [request_id]
        );

        if (reqResult.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const request = reqResult.rows[0];

        if (request.request_type === 'DELETE') {
            // Delete the package
            await db.query('DELETE FROM packages WHERE id = $1', [request.package_id]);
            // Update request status (if ON DELETE CASCADE is NOT enabled)
            await db.query("UPDATE package_requests SET status = 'APPROVED' WHERE request_id = $1", [request_id]).catch(e => null);
            return res.json({ message: 'Delete request approved and package deleted' });
        }

        let newData = request.new_data;

        if (typeof newData === 'string') {
            try {
                newData = JSON.parse(newData);
            } catch (e) {
                console.error("Error parsing new_data in approval:", e);
            }
        }

        // Apply update to the packages table
        await db.query(
            `UPDATE packages SET
                title = $1, destination = $2, days = $3, nights = $4,
                travelers = $5, price = $6, rating = $7, description = $8,
                inclusions = $9, exclusions = $10, itinerary = $11,
                package_types = $12,
                images = COALESCE($13, images),
                hotels = $14,
                offer_percent = $16,
                is_featured = $17,
                offer_status = 'approved'
                WHERE id = $15`,
            [
                newData.title, newData.destination,
                newData.days, newData.nights,
                newData.travelers, newData.price, newData.rating,
                newData.description,
                JSON.stringify(newData.inclusions),
                JSON.stringify(newData.exclusions),
                JSON.stringify(newData.itinerary),
                JSON.stringify(newData.package_types),
                newData.images && newData.images.length > 0 ? JSON.stringify(newData.images) : null,
                JSON.stringify(newData.hotels || []),
                request.package_id,
                newData.offer_percent || 0,
                newData.is_featured || false
            ]
        );

        // // Update hotels
        // if (newData.hotels && newData.hotels.length > 0) {
        //     await db.query('DELETE FROM hotels WHERE package_id = $1', [request.package_id]);
        //     for (const hotel of newData.hotels) {
        //         if (hotel.hotel_name && hotel.hotel_name.trim()) {
        //             await db.query(
        //                 'INSERT INTO hotels (package_id, day_number, hotel_name) VALUES ($1, $2, $3)',
        //                 [request.package_id, hotel.day_number, hotel.hotel_name]
        //             );
        //         }
        //     }
        // }

        // Mark request as APPROVED
        await db.query(
            "UPDATE package_requests SET status = 'APPROVED' WHERE request_id = $1",
            [request_id]
        );

        res.json({ message: 'Request approved and package updated' });

    } catch (err) {
        console.error('approve-request error:', err);
        res.status(500).json({ message: 'Approval failed', error: err.message });
    }
});


/* =========================================================
   ADMIN: REJECT AN UPDATE REQUEST
   ========================================================= */


app.post('/admin/reject-request', async (req, res) => {
    try {
        const { request_id } = req.body;

        await db.query(
            "UPDATE package_requests SET status = 'REJECTED' WHERE request_id = $1",
            [request_id]
        );

        res.json({ message: 'Request rejected' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Reject failed' });
    }
});

// Admin Direct Delete Package
app.delete('/api/admin/packages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM packages WHERE id = $1', [id]);
        res.json({ message: 'Package deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete package' });
    }
});

// Admin Direct Update Package
app.put('/api/admin/packages/:id', upload.any(), async (req, res) => {
    try {
        const { id } = req.params;
        const pkg = req.body;

        const parseField = (val) => {
            if (!val) return [];
            try { return typeof val === 'string' ? JSON.parse(val) : val; }
            catch { return []; }
        };

        const newImages = (req.files || [])
            .filter(f => f.fieldname === "images")
            .map(f => f.filename);

        // Get current images
        const currentPkg = await db.query("SELECT images FROM packages WHERE id=$1", [id]);
        let images = currentPkg.rows[0].images || [];
        if (typeof images === "string") images = JSON.parse(images);

        // If new images provided, we might want to replace or append. 
        // For simplicity in direct edit, let's append if any, or keep old if none.
        if (newImages.length > 0) {
            images = [...images, ...newImages];
        }

        await db.query(
            `UPDATE packages SET
                title = $1, destination = $2, days = $3, nights = $4,
                travelers = $5, price = $6, rating = $7, description = $8,
                inclusions = $9, exclusions = $10, itinerary = $11,
                package_types = $12, images = $13, hotels = $14,
                offer_percent = $15, is_featured = $16, status = 'approved',
                offer_status = 'approved'
                WHERE id = $17`,
            [
                pkg.title, pkg.destination, Number(pkg.days), Number(pkg.nights),
                Number(pkg.travelers), Number(pkg.price), Number(pkg.rating),
                pkg.description || '',
                JSON.stringify(parseField(pkg.inclusions)),
                JSON.stringify(parseField(pkg.exclusions)),
                JSON.stringify(parseField(pkg.itinerary)),
                JSON.stringify(parseField(pkg.package_types)),
                JSON.stringify(images),
                JSON.stringify(parseField(pkg.hotels)),
                Number(pkg.offer_percent || 0),
                pkg.is_featured === 'true' || pkg.is_featured === true,
                id
            ]
        );

        res.json({ message: 'Package updated successfully' });
    } catch (err) {
        console.error('ADMIN EDIT PACKAGE ERROR:', err);
        res.status(500).json({ message: 'Failed to update package', error: err.message });
    }
});

// Admin Add Package (Directly Approved)
app.post("/api/admin/packages", upload.any(), async (req, res) => {
    try {
        let pkg = req.body;
        const parseField = (val) => {
            if (!val) return [];
            try { return typeof val === 'string' ? JSON.parse(val) : val; }
            catch { return []; }
        };

        const images = req.files ? req.files.map(file => file.filename) : [];

        await db.query(
            `INSERT INTO packages 
            (title,destination,days,nights,price,travelers,rating,description,
            inclusions,exclusions,itinerary,status,agent_id,images,package_types,hotels,
            offer_percent,offer_status,offer_expiry,is_featured)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'approved',$12,$13,$14,$15,$16,'approved',NULL,$17) RETURNING id`,
            [
                pkg.title, pkg.destination, Number(pkg.days || 1), Number(pkg.nights || 0),
                Number(pkg.price || 0), Number(pkg.travelers || 1), Number(pkg.rating || 3),
                pkg.description || '',
                JSON.stringify(parseField(pkg.inclusions)),
                JSON.stringify(parseField(pkg.exclusions)),
                JSON.stringify(parseField(pkg.itinerary)),
                Number(pkg.agent_id || 1), 
                JSON.stringify(images),
                JSON.stringify(parseField(pkg.package_types)),
                JSON.stringify(parseField(pkg.hotels)),
                Number(pkg.offer_percent || 0),
                pkg.is_featured === 'true' || pkg.is_featured === true
            ]
        );

        res.json({ success: true, message: "Package created and approved" });
    } catch (err) {
        console.error('ADMIN ADD PACKAGE ERROR:', err);
        res.status(500).json({ message: "Package creation failed", error: err.message });
    }
});

// Diagnostic endpoint to check images in database
app.get('/api/diagnostic/packages-images', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, title, images, status, is_featured FROM packages ORDER BY id DESC LIMIT 20`
        );
        
        const parsed = result.rows.map(pkg => ({
            id: pkg.id,
            title: pkg.title,
            status: pkg.status,
            is_featured: pkg.is_featured,
            images_raw_type: typeof pkg.images,
            images_raw_value: pkg.images,
            images_parsed: serializePackage(pkg).images,
            images_count: serializePackage(pkg).images.length
        }));
        
        res.json({  
            total: result.rows.length,
            packages: parsed
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Diagnostic failed', error: err.message });
    }
});

// Diagnostic endpoint to check files in uploads directory
app.get('/api/diagnostic/uploads-files', async (req, res) => {
    try {
        const files = fs.readdirSync('uploads');
        res.json({ 
            uploads_folder_exists: true,
            file_count: files.length, 
            files: files.slice(0, 50) 
        });
    } catch (err) {
        res.json({ 
            uploads_folder_exists: false, 
            error: err.message 
        });
    }
});

console.log('app._router exists:', !!app._router);
console.log('app._router.stack length:', app._router?.stack?.length);
if (app._router?.stack) {
    app._router.stack.forEach((layer, idx) => {
        const path = layer.route ? layer.route.path : (layer.name || 'unknown');
        const methods = layer.route ? Object.keys(layer.route.methods).join(', ') : '';
        console.log(`route[${idx}]`, path, methods);
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

