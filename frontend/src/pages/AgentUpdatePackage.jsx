import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AgentUpdatePackage = () => {

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
        hotels: []
    });

    const packageTypesList = ["Luxury", "Family", "Honeymoon", "Adventure", "Leisure", "Group", "Couple"];

    const [itinerary, setItinerary] = useState([
        { title: "", description: "" }
    ]);

    const [images, setImages] = useState([]);

    /* ---------- FETCH PACKAGE ---------- */

    useEffect(() => {

        fetchPackage();

    }, []);

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
                    inclusions: (data.inclusions || []).join(", "),
                    exclusions: (data.exclusions || []).join(", "),
                    package_types: Array.isArray(data.package_types) ? data.package_types : [],
                    hotels: data.hotels || []
                });

                setItinerary(data.itinerary || [{ title: "", description: "" }]);

            }

        } catch (err) {
            console.error(err);
        }

        setLoading(false);

    };

    /* ---------- ITINERARY FUNCTIONS ---------- */

    const handleTypeChange = (type) => {
        setPackageData(prev => {
            const types = prev.package_types.includes(type)
                ? prev.package_types.filter(t => t !== type)
                : [...prev.package_types, type];
            return { ...prev, package_types: types };
        });
    };

    const addDay = () => {

        setItinerary([
            ...itinerary,
            { title: "", description: "" }
        ]);

    };

    const removeDay = (index) => {

        setItinerary(itinerary.filter((_, i) => i !== index));

    };

    /* ---------- IMAGE HANDLING ---------- */

    const handleImages = (e) => {

        setImages(Array.from(e.target.files));

    };

    const removeImage = (index) => {

        setImages(images.filter((_, i) => i !== index));

    };

    /* ---------- SEND UPDATE REQUEST ---------- */

    const sendUpdateRequest = async (e) => {

        e.preventDefault();

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const itineraryFormatted = itinerary.map((day, index) => ({
                day: index + 1,
                title: day.title,
                description: day.description
            }));

            const formData = new FormData();

            formData.append("package_id", id);
            formData.append("agent_id", user.id);

            formData.append("title", packageData.title);
            formData.append("destination", packageData.destination);

            formData.append("days", Number(packageData.days));
            formData.append("nights", Number(packageData.nights));
            formData.append("travelers", Number(packageData.travelers));
            formData.append("price", Number(packageData.price));
            formData.append("rating", Number(packageData.rating));

            formData.append("description", packageData.description);

            formData.append(
                "inclusions",
                JSON.stringify(packageData.inclusions.split(",").map(i => i.trim()))
            );

            formData.append(
                "exclusions",
                JSON.stringify(packageData.exclusions.split(",").map(i => i.trim()))
            );

            formData.append("itinerary", JSON.stringify(itineraryFormatted));
            formData.append("package_types", JSON.stringify(packageData.package_types));
            formData.append("hotels", JSON.stringify(packageData.hotels));

            images.forEach(img => {
                formData.append("images", img);
            });

            const res = await fetch("/api/agent/update-package", {
                method: "POST",
                body: formData
            });

            if (res.ok) {

                alert("Update request sent to admin");
                navigate("/agent-dashboard");

            } else {

                alert("Update failed");

            }

        } catch (err) {
            console.error(err);
        }

    };

    /* ---------- LOADING ---------- */

    if (loading) {

        return <p style={{ padding: "40px" }}>Loading package...</p>;

    }

    /* ---------- UI ---------- */

    return (

        <div style={{ padding: "40px" }}>

            <h2 style={{ marginBottom: "20px" }}>Update Package</h2>

            <form
                onSubmit={sendUpdateRequest}
                style={{
                    maxWidth: "1000px",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                }}
            >

                <input
                    type="text"
                    placeholder="Package Title"
                    value={packageData.title}
                    onChange={(e) => setPackageData({ ...packageData, title: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Destination"
                    value={packageData.destination}
                    onChange={(e) => setPackageData({ ...packageData, destination: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Days"
                    value={packageData.days}
                    onChange={(e) => setPackageData({ ...packageData, days: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Nights"
                    value={packageData.nights}
                    onChange={(e) => setPackageData({ ...packageData, nights: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Travelers"
                    value={packageData.travelers}
                    onChange={(e) => setPackageData({ ...packageData, travelers: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={packageData.price}
                    onChange={(e) => setPackageData({ ...packageData, price: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Hotel Rating"
                    value={packageData.rating}
                    onChange={(e) => setPackageData({ ...packageData, rating: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    style={{ gridColumn: "span 2" }}
                    value={packageData.description}
                    onChange={(e) => setPackageData({ ...packageData, description: e.target.value })}
                />

                <textarea
                    placeholder="Inclusions (comma separated)"
                    value={packageData.inclusions}
                    onChange={(e) => setPackageData({ ...packageData, inclusions: e.target.value })}
                />

                {/* PACKAGE TYPE SECTION */}
                <div style={{ gridColumn: "span 2", marginTop: "10px", marginBottom: "10px" }}>
                    <h4 style={{ marginBottom: "10px" }}>Package Type *</h4>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "10px"
                    }}>
                        {packageTypesList.map(type => (
                            <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={packageData.package_types.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <textarea
                    placeholder="Exclusions (comma separated)"
                    value={packageData.exclusions}
                    onChange={(e) => setPackageData({ ...packageData, exclusions: e.target.value })}
                />

                {/* ---------- IMAGE SECTION ---------- */}

                <div style={{ gridColumn: "span 2" }}>

                    <h3>Package Images</h3>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImages}
                    />

                    {images.length > 0 && (

                        <div style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                            flexWrap: "wrap"
                        }}>

                            {images.map((img, index) => (

                                <div key={index} style={{ position: "relative" }}>

                                    <img
                                        src={URL.createObjectURL(img)}
                                        style={{
                                            width: "120px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "6px"
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: "absolute",
                                            top: "-6px",
                                            right: "-6px",
                                            background: "#ef4444",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "18px",
                                            height: "18px",
                                            fontSize: "10px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ×
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                {/* ---------- ITINERARY ---------- */}

                <div style={{ gridColumn: "span 2" }}>

                    <h3>Itinerary</h3>

                    {itinerary.map((day, index) => (

                        <div
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "6px"
                            }}
                        >

                            <h4>Day {index + 1}</h4>

                            <input
                                type="text"
                                placeholder="Title"
                                value={day.title}
                                onChange={(e) => {
                                    const updated = [...itinerary];
                                    updated[index].title = e.target.value;
                                    setItinerary(updated);
                                }}
                            />

                            <textarea
                                placeholder="Description"
                                value={day.description}
                                onChange={(e) => {
                                    const updated = [...itinerary];
                                    updated[index].description = e.target.value;
                                    setItinerary(updated);
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Hotel for this day"
                                value={packageData.hotels.find(h => h.day_number === (index + 1))?.hotel_name || ""}
                                onChange={(e) => {
                                    const updatedHotels = [...packageData.hotels];
                                    const hIndex = updatedHotels.findIndex(h => h.day_number === (index + 1));
                                    if (hIndex > -1) {
                                        updatedHotels[hIndex].hotel_name = e.target.value;
                                    } else {
                                        updatedHotels.push({ day_number: index + 1, hotel_name: e.target.value });
                                    }
                                    setPackageData({ ...packageData, hotels: updatedHotels });
                                }}
                                style={{ marginTop: "10px", width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                            />

                            <button
                                type="button"
                                onClick={() => removeDay(index)}
                                style={{
                                    marginTop: "10px",
                                    background: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Remove Day
                            </button>

                        </div>

                    ))}

                    <button
                        type="button"
                        onClick={addDay}
                        style={{
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px"
                        }}
                    >
                        Add Day
                    </button>

                </div>

                <button
                    type="submit"
                    style={{
                        gridColumn: "span 2",
                        background: "#4f46e5",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    Send Update Request
                </button>

            </form>

        </div>

    );

};

export default AgentUpdatePackage;