import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AdminEditPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [packageData, setPackageData] = useState({
        title: "",
        destination: "",
        days: "",
        nights: "",
        travelers: "",
        price: "",
        rating: "",
        description: "",
        inclusions: "",
        exclusions: "",
        package_types: [],
        hotels: [],
        offer_percent: "",
        is_featured: false
    });

    const [itinerary, setItinerary] = useState([]);
    const [images, setImages] = useState([]);
    const packageTypesList = ["Luxury", "Family", "Honeymoon", "Adventure", "Leisure", "Group", "Couple"];

    useEffect(() => {
        fetchPackage();
    }, [id]);

    const fetchPackage = async () => {
        try {
            const res = await fetch(`/api/packages/${id}`);
            if (res.ok) {
                const data = await res.json();
                setPackageData({
                    title: data.title || "",
                    destination: data.destination || "",
                    days: data.days || "",
                    nights: data.nights || "",
                    travelers: data.travelers || "",
                    price: data.price || "",
                    rating: data.rating || "",
                    description: data.description || "",
                    inclusions: Array.isArray(data.inclusions) ? data.inclusions.join(", ") : "",
                    exclusions: Array.isArray(data.exclusions) ? data.exclusions.join(", ") : "",
                    package_types: Array.isArray(data.package_types) ? data.package_types : [],
                    hotels: Array.isArray(data.hotels) ? data.hotels : [],
                    offer_percent: data.offer_percent || "",
                    is_featured: data.is_featured || false
                });
                setItinerary(Array.isArray(data.itinerary) ? data.itinerary : []);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleTypeChange = (type) => {
        setPackageData(prev => {
            const types = prev.package_types.includes(type)
                ? prev.package_types.filter(t => t !== type)
                : [...prev.package_types, type];
            return { ...prev, package_types: types };
        });
    };

    const addDay = () => {
        setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "", meals: { breakfast: false, lunch: false, dinner: false } }]);
    };

    const removeDay = (index) => {
        setItinerary(itinerary.filter((_, i) => i !== index));
    };

    const handleImages = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", packageData.title);
            formData.append("destination", packageData.destination);
            formData.append("days", packageData.days);
            formData.append("nights", packageData.nights);
            formData.append("travelers", packageData.travelers);
            formData.append("price", packageData.price);
            formData.append("rating", packageData.rating);
            formData.append("description", packageData.description);
            formData.append("inclusions", JSON.stringify(packageData.inclusions.split(",").map(i => i.trim())));
            formData.append("exclusions", JSON.stringify(packageData.exclusions.split(",").map(i => i.trim())));
            formData.append("itinerary", JSON.stringify(itinerary));
            formData.append("package_types", JSON.stringify(packageData.package_types));
            formData.append("hotels", JSON.stringify(packageData.hotels));
            formData.append("offer_percent", packageData.offer_percent);
            formData.append("is_featured", packageData.is_featured);

            images.forEach(img => {
                formData.append("images", img);
            });

            const res = await fetch(`/api/admin/packages/${id}`, {
                method: "PUT",
                body: formData
            });

            if (res.ok) {
                alert("Package updated successfully!");
                navigate("/admin-dashboard");
            } else {
                alert("Update failed");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

    return (
        <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
            <button onClick={() => navigate("/admin-dashboard")} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: "#2563eb", marginBottom: "20px" }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <h2 style={{ marginBottom: "20px" }}>Admin: Edit Package</h2>

            <form onSubmit={handleUpdate} style={{ maxWidth: "1000px", margin: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <input type="text" placeholder="Title" value={packageData.title} onChange={(e) => setPackageData({ ...packageData, title: e.target.value })} style={inputStyle} />
                <input type="text" placeholder="Destination" value={packageData.destination} onChange={(e) => setPackageData({ ...packageData, destination: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="Days" value={packageData.days} onChange={(e) => setPackageData({ ...packageData, days: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="Nights" value={packageData.nights} onChange={(e) => setPackageData({ ...packageData, nights: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="Travelers" value={packageData.travelers} onChange={(e) => setPackageData({ ...packageData, travelers: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="Price" value={packageData.price} onChange={(e) => setPackageData({ ...packageData, price: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="Rating" value={packageData.rating} onChange={(e) => setPackageData({ ...packageData, rating: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="Discount %" value={packageData.offer_percent} onChange={(e) => setPackageData({ ...packageData, offer_percent: e.target.value })} style={inputStyle} />

                <textarea placeholder="Description" value={packageData.description} onChange={(e) => setPackageData({ ...packageData, description: e.target.value })} style={{ ...inputStyle, gridColumn: "span 2", height: "100px" }} />

                <label style={{ display: "flex", alignItems: "center", gap: "10px", gridColumn: "span 2" }}>
                    <input type="checkbox" checked={packageData.is_featured} onChange={(e) => setPackageData({ ...packageData, is_featured: e.target.checked })} />
                    Mark as Featured
                </label>

                <div style={{ gridColumn: "span 2" }}>
                    <h4>Package Types</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                        {packageTypesList.map(type => (
                            <label key={type} style={{ fontSize: "14px" }}>
                                <input type="checkbox" checked={packageData.package_types.includes(type)} onChange={() => handleTypeChange(type)} /> {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                    <h4>Inclusions (comma separated)</h4>
                    <textarea value={packageData.inclusions} onChange={(e) => setPackageData({ ...packageData, inclusions: e.target.value })} style={{ ...inputStyle, width: "100%", height: "60px" }} />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                    <h4>Exclusions (comma separated)</h4>
                    <textarea value={packageData.exclusions} onChange={(e) => setPackageData({ ...packageData, exclusions: e.target.value })} style={{ ...inputStyle, width: "100%", height: "60px" }} />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                    <h4>Add More Images</h4>
                    <input type="file" multiple onChange={handleImages} />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                    <h3>Itinerary</h3>
                    {itinerary.map((day, idx) => (
                        <div key={idx} style={{ border: "1px solid #eee", padding: "15px", marginBottom: "15px", borderRadius: "8px" }}>
                            <h5>Day {idx + 1}</h5>
                            <input placeholder="Title" value={day.title} onChange={(e) => {
                                const updated = [...itinerary];
                                updated[idx].title = e.target.value;
                                setItinerary(updated);
                            }} style={{ ...inputStyle, marginBottom: "10px" }} />
                            <textarea placeholder="Description" value={day.description} onChange={(e) => {
                                const updated = [...itinerary];
                                updated[idx].description = e.target.value;
                                setItinerary(updated);
                            }} style={{ ...inputStyle, height: "60px", marginBottom: "10px" }} />
                            
                            <div style={{ display: "flex", gap: "15px" }}>
                                {["breakfast", "lunch", "dinner"].map(meal => (
                                    <label key={meal} style={{ fontSize: "14px" }}>
                                        <input type="checkbox" checked={day.meals?.[meal]} onChange={(e) => {
                                            const updated = [...itinerary];
                                            if (!updated[idx].meals) updated[idx].meals = {};
                                            updated[idx].meals[meal] = e.target.checked;
                                            setItinerary(updated);
                                        }} /> {meal}
                                    </label>
                                ))}
                            </div>

                            <input placeholder="Hotel" value={packageData.hotels.find(h => h.day_number === (idx + 1))?.hotel_name || ""} onChange={(e) => {
                                const updatedHotels = [...packageData.hotels];
                                const hIdx = updatedHotels.findIndex(h => h.day_number === (idx + 1));
                                if (hIdx > -1) updatedHotels[hIdx].hotel_name = e.target.value;
                                else updatedHotels.push({ day_number: idx + 1, hotel_name: e.target.value });
                                setPackageData({ ...packageData, hotels: updatedHotels });
                            }} style={{ ...inputStyle, marginTop: "10px" }} />

                            <button type="button" onClick={() => removeDay(idx)} style={{ marginTop: "10px", color: "red", border: "none", background: "none", cursor: "pointer" }}>Remove Day</button>
                        </div>
                    ))}
                    <button type="button" onClick={addDay} style={{ padding: "8px 15px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>+ Add Day</button>
                </div>

                <button type="submit" style={{ gridColumn: "span 2", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Update Package</button>
            </form>
        </div>
    );
};

const inputStyle = { padding: "10px", border: "1px solid #ddd", borderRadius: "6px", width: "100%" };

export default AdminEditPackage;
