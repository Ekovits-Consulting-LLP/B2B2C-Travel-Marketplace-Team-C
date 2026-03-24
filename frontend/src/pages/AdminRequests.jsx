import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Coffee, Utensils, Pizza } from "lucide-react";
import MealStatus from "../components/MealStatus";

function AdminRequests() {

    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const getImageUrl = (img) => {
        if (!img) return "";
        if (typeof img !== "string") return "";
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        if (img.startsWith("/")) return `${API_BASE_URL}${img}`;
        return `${API_BASE_URL}/uploads/${img}`;
    };

    const [requests, setRequests] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const [offerPercent, setOfferPercent] = useState(0);
    const [offerExpiry, setOfferExpiry] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);

    useEffect(() => {
        if (selectedPackage) {
            setOfferPercent(selectedPackage.offer_percent || 0);
            setIsFeatured(selectedPackage.is_featured || false);
            if (selectedPackage.offer_expiry) {
                try {
                    setOfferExpiry(new Date(selectedPackage.offer_expiry).toISOString().split('T')[0]);
                } catch(e) {
                    setOfferExpiry("");
                }
            } else {
                setOfferExpiry("");
            }
        }
    }, [selectedPackage]);


    /* SAFE JSON PARSER */

    const parseJSON = (data) => {
        try {
            return typeof data === "string" ? JSON.parse(data) : data || [];
        } catch {
            return [];
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {

        try {

            const res = await axios.get("http://localhost:5000/admin/package-requests");
            setRequests(res.data);

        } catch (err) {
            console.error(err);
        }

    };

    /* APPROVE */

    const approveRequest = async (id) => {

        try {

            await axios.post("http://localhost:5000/admin/approve-request", {
                request_id: id
            });

            setSelectedPackage(null);
            fetchRequests();

        } catch (err) {
            console.error(err);
        }

    };

    /* REJECT */

    const rejectRequest = async (id) => {

    try {

        await axios.post("http://localhost:5000/admin/reject-request", {
            request_id: id
        });

        setSelectedPackage(null);
        fetchRequests();

    } catch (err) {

        console.error(err);

    }

};


/* SET OFFER */

const setOffer = async (packageId) => {

    try{

        await axios.put(
            `http://localhost:5000/api/admin/packages/${packageId}/set-offer`,
            {
                offer_percent: offerPercent,
                offer_expiry: offerExpiry
            }
        );

        alert("Offer updated");

    }catch(err){
        console.error(err);
    }

};

/* APPROVE OFFER */

const approveOffer = async (packageId) => {

    try{

        await axios.put(
            `http://localhost:5000/api/admin/packages/${packageId}/approve-offer`
        );

        alert("Offer approved");

    }catch(err){
        console.error(err);
    }

};

/* FEATURE PACKAGE */

const featurePackage = async (packageId) => {

    try{

        await axios.put(
            `http://localhost:5000/api/admin/packages/${packageId}/feature`,
            { is_featured: !isFeatured }
        );

        setIsFeatured(!isFeatured);

        alert("Feature updated");

    }catch(err){
        console.error(err);
    }

};


    //         /* REJECT */

    //         const rejectRequest = async (id) => {

    //             try {

    //                 await axios.post("http://localhost:5000/admin/reject-request", {
    //                     request_id: id
    //                 });

    //                 setSelectedPackage(null);
    //                 fetchRequests();

    //             } catch (err) {
    //                 console.error(err);
    //             }

    //         };

    //     } catch (err) {
    //         console.error(err);
    //     }

    // };

    /* VIEW DETAILS */

    // const viewDetails = async(requestId)=>{

    // try{

    // const res = await fetch(`http://localhost:5000/admin/package-request-details/${requestId}`);

    // if(res.ok){

    // const data = await res.json();
    // setSelectedPackage(data);

    // }

    // }catch(err){
    // console.error(err);
    // }

    // };

    const viewDetails = async (requestId) => {

        try {

            const req = requests.find(r => r.request_id === requestId);
            if (!req) return;

            /* fetch current package */
            const res = await fetch(`http://localhost:5000/api/packages/${req.package_id}`);

            if (res.ok) {

                const pkg = await res.json();

                /* merge request data if present */
                const merged = req.request_type === 'DELETE' ? {
                    ...pkg,
                    request_id: req.request_id,
                    request_type: req.request_type,
                    status: req.status || pkg.status
                } : {
                    ...pkg,
                    ...Object.fromEntries(Object.entries(req).filter(([_, v]) => v != null)),
                    status: req.status || pkg.status
                };
                setSelectedPackage(merged);

            }

        } catch (err) {
            console.error(err);
        }

    };
    /* IMAGE DELETE */

    const deleteImage = async (packageId, image) => {

        await fetch(`/api/admin/packages/${packageId}/delete-image`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image })
        });

        viewDetails(selectedPackage.request_id);

    };

    /* IMAGE ADD */

    const addImage = async (packageId, files) => {

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
    }

    await fetch(`/api/admin/packages/${packageId}/add-image`, {
        method: "POST",
        body: formData
    });

    viewDetails(selectedPackage.request_id);
};

    /* IMAGE UPDATE */

    const updateImage = async (packageId, oldImage, file) => {

        const formData = new FormData();
        formData.append("images", file);
        formData.append("oldImage", oldImage);

        await fetch(`/api/admin/packages/${packageId}/update-image`, {
            method: "PUT",
            body: formData
        });

        viewDetails(selectedPackage.request_id);

    };

    return (

        <div style={{ padding: "40px" }}>

            <h2 style={{ marginBottom: "20px" }}>Package Update Requests</h2>

            {requests.length === 0 ? (

                <p>No pending requests</p>

            ) : (

                requests.map(req => (

                    <div key={req.request_id} style={cardStyle}>

                        <div>

                            <h4>{req.agent_name || `Agent #${req.agent_id}`}</h4>
                            <p>Package ID: {req.package_id}</p>
                            <p>Request Type: {req.request_type}</p>
                            <p>Status: {req.status}</p>

                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>

                            <button
                                onClick={() => viewDetails(req.request_id)}
                                style={viewBtn}
                            >
                                View Details
                            </button>

                            <button
                                onClick={() => approveRequest(req.request_id)}
                                style={approveBtn}
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => rejectRequest(req.request_id)}
                                style={rejectBtn}
                            >
                                Reject
                            </button>

                        </div>

                    </div>

                ))

            )}

            {/* MODAL */}

            {selectedPackage && (

                <div style={modalOverlay}>

                    <div style={modalBox}>

                        <h2>{selectedPackage.title}</h2>
                        <p style={{ color: "#6b7280" }}>{selectedPackage.destination}</p>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "10px",
                            marginTop: "10px"
                        }}>
                            <div><b>Days:</b> {selectedPackage.days}</div>
                            <div><b>Nights:</b> {selectedPackage.nights}</div>
                            <div><b>Travelers:</b> {selectedPackage.travelers}</div>
                            <div><b>Rating:</b> ⭐ {selectedPackage.rating}</div>
                            <h3 style={{ marginTop: "20px" }}>Price: ${selectedPackage.price}</h3>

                            {/* OFFER MANAGEMENT */}

                            <div style={{ marginTop:"20px", padding:"10px", background:"#f9fafb", borderRadius:"8px" }}>

                            <h3>Offers & Featured</h3>

                            <div style={{ display:"flex", gap:"10px", marginTop:"10px" }}>

                            <input
                            type="number"
                            placeholder="Discount %"
                            value={offerPercent}
                            onChange={(e)=>setOfferPercent(e.target.value)}
                            style={{ padding:"6px" }}
                            />

                            <input
                            type="date"
                            value={offerExpiry}
                            onChange={(e)=>setOfferExpiry(e.target.value)}
                            style={{ padding:"6px" }}
                            />

                            <button
                            onClick={()=>setOffer(selectedPackage.package_id)}
                            style={{ background:"#2563eb", color:"white", border:"none", padding:"6px 10px", borderRadius:"6px" }}
                            >
                            Set Offer
                            </button>

                            </div>

                            <div style={{ marginTop:"10px", display:"flex", gap:"10px" }}>

                            <button
                            onClick={()=>approveOffer(selectedPackage.package_id)}
                            style={{ background:"#10b981", color:"white", border:"none", padding:"6px 10px", borderRadius:"6px" }}
                            >
                            Approve Offer
                            </button>

                            <button
                            onClick={()=>featurePackage(selectedPackage.package_id)}
                            style={{ background:"#f59e0b", color:"white", border:"none", padding:"6px 10px", borderRadius:"6px" }}
                            >
                            Toggle Featured
                            </button>

                            </div>

                            </div>
                        </div>

                        {selectedPackage.package_types && parseJSON(selectedPackage.package_types).length > 0 && (
                            <div style={{ marginTop: "15px" }}>
                                <b>Package Types:</b> {parseJSON(selectedPackage.package_types).join(", ")}
                            </div>
                        )}

                        <h3 style={{ marginTop: "20px" }}>Description</h3>
                        <p>{selectedPackage.description}</p>

                        <h3 style={{ marginTop: "20px" }}>Inclusions</h3>
                        <ul>
                            {parseJSON(selectedPackage.inclusions).map((i, index) => (
                                <li key={index}>{i}</li>
                            ))}
                        </ul>

                        <h3 style={{ marginTop: "20px" }}>Exclusions</h3>
                        <ul>
                            {parseJSON(selectedPackage.exclusions).map((i, index) => (
                                <li key={index}>{i}</li>
                            ))}
                        </ul>

                        <h3 style={{ marginTop: "20px" }}>Itinerary</h3>

                        {parseJSON(selectedPackage.itinerary).map((day, index) => (

                            <div key={index} style={itineraryBox}>

                                <b>Day {day.day} - {day.title}</b>
                                {selectedPackage.hotels && parseJSON(selectedPackage.hotels).some(h => h.day_number === day.day) && (
                                    <div style={{ marginTop: "6px", fontSize: "13px", color: "#2563eb" }}>
                                        🏨 Stay: {parseJSON(selectedPackage.hotels).find(h => h.day_number === day.day).hotel_name}
                                    </div>
                                )}
                                <p>{day.description}</p>
                                {day.meals && (
                                    <div style={{ marginTop: "8px", fontSize: "13px" }}>
                                        <strong>Meals:</strong>
                                        <MealStatus icon={<Coffee size={18} />} label="Breakfast" available={day.meals.breakfast} />
                                        <MealStatus icon={<Utensils size={18} />} label="Lunch" available={day.meals.lunch} />
                                        <MealStatus icon={<Pizza size={18} />} label="Dinner" available={day.meals.dinner} />
                                    </div>
                                )}

                            </div>

                        ))}

                        <h3 style={{ marginTop: "20px" }}>Images</h3>

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

                            {parseJSON(selectedPackage.images) && parseJSON(selectedPackage.images).length > 0 ? (
                                parseJSON(selectedPackage.images).map((img, index) => (

                                    <div key={index} style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}>

                                        <img
                                            src={getImageUrl(img)}
                                            alt={`Package-${index}`}
                                            style={{
                                                width: "120px",
                                                height: "80px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                                marginBottom: "6px",
                                                border: "1px solid #ddd"
                                            }}
                                            onError={(e) => {
                                                console.error(`Image failed to load: ${getImageUrl(img)}`);
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect fill='%23f0f0f0' width='120' height='80'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='12'%3EImage not found%3C/text%3E%3C/svg%3E";
                                            }}
                                        />

                                    <div style={{ display: "flex", gap: "5px" }}>

                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            id={`replace-${index}`}
                                            onChange={(e) => updateImage(selectedPackage.package_id, img, e.target.files[0])}
                                        />

                                        <label
                                            htmlFor={`replace-${index}`}
                                            style={updateBtn}
                                        >
                                            Update
                                        </label>

                                        <button
                                            onClick={() => deleteImage(selectedPackage.package_id, img)}
                                            style={deleteBtn}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            ))
                            ) : null}

                        </div>

                        <div style={{ marginTop: "15px" }}>

                            <input
                            type="file"
                            id="add-image"
                            multiple
                            style={{ display: "none" }}
                            onChange={(e) => addImage(selectedPackage.package_id, e.target.files)}
                            />

                            <label
                                htmlFor="add-image"
                                style={addBtn}
                            >
                                + Add Image
                            </label>

                        </div>

                        <button
                            onClick={() => setSelectedPackage(null)}
                            style={closeBtn}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}

/* STYLES */

const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const viewBtn = { background: "#6366f1", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" };
const approveBtn = { background: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" };
const rejectBtn = { background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" };

const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const modalBox = {
    background: "white",
    borderRadius: "14px",
    width: "700px",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "30px"
};

const itineraryBox = {
    background: "#f1f5f9",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "8px"
};

const updateBtn = { background: "#6366f1", color: "white", padding: "3px 6px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" };
const deleteBtn = { background: "#ef4444", color: "white", border: "none", padding: "3px 6px", borderRadius: "4px", fontSize: "11px" };
const addBtn = { background: "#2563eb", color: "white", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" };
const closeBtn = { marginTop: "25px", padding: "10px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px" };

export default AdminRequests;