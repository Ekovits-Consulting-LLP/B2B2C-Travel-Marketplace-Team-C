import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPackage = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [pkg, setPkg] = useState({
        title: "",
        destination: "",
        days: "",
        nights: "",
        price: "",
        travelers: "",
        rating: "",
        description: "",
        inclusions: [],
        exclusions: [],
        itinerary: [{ day: 1, title: "", description: "" }],
        package_types: [],
        hotels: []
    });

    const [images, setImages] = useState([]);

    const packageTypesList = ["Luxury", "Family", "Honeymoon", "Adventure", "Leisure", "Group", "Couple"];

    /* INPUT CHANGE */

    const handleChange = (e) => {
        setPkg({ ...pkg, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (type) => {
        setPkg(prev => {
            const types = prev.package_types.includes(type)
                ? prev.package_types.filter(t => t !== type)
                : [...prev.package_types, type];
            return { ...prev, package_types: types };
        });
    };

    const handleHotelChange = (day, name) => {
        setPkg(prev => {
            const hotels = [...prev.hotels];
            const index = hotels.findIndex(h => h.day === day);
            if (index > -1) {
                hotels[index].name = name;
            } else {
                hotels.push({ day, name });
            }
            return { ...prev, hotels };
        });
    };


    /* INCLUSION */

    const addInclusion = () => {
        setPkg({ ...pkg, inclusions: [...pkg.inclusions, ""] });
    };


    /* EXCLUSION */

    const addExclusion = () => {
        setPkg({ ...pkg, exclusions: [...pkg.exclusions, ""] });
    };


    /* ITINERARY */

    const addDay = () => {
        setPkg({
            ...pkg,
            itinerary: [
                ...pkg.itinerary,
                { day: pkg.itinerary.length + 1, title: "", description: "" }
            ]
        });
    };


    /* IMAGE SELECT */

    const handleImages = (e) => {
    setImages(Array.from(e.target.files));
    };


    /* SUBMIT PACKAGE */

    const submitPackage = async () => {

        try {

            const formData = new FormData();

            formData.append("title", pkg.title);
            formData.append("destination", pkg.destination);
            formData.append("days", pkg.days);
            formData.append("nights", pkg.nights);
            formData.append("price", pkg.price);
            formData.append("travelers", pkg.travelers);
            formData.append("rating", pkg.rating);
            formData.append("description", pkg.description);

            formData.append("inclusions", JSON.stringify(pkg.inclusions));
            formData.append("exclusions", JSON.stringify(pkg.exclusions));
            formData.append("itinerary", JSON.stringify(pkg.itinerary));
            formData.append("package_types", JSON.stringify(pkg.package_types));
            formData.append("hotels", JSON.stringify(pkg.hotels));

            formData.append("agent_id", user.id);

            images.forEach(img=>{
            formData.append("images", img);
            });
            const res = await fetch("http://localhost:5000/api/packages", {
                method: "POST",
                body: formData
            });

            if (res.ok) {

                alert("Package submitted for approval");
                navigate("/agent-dashboard");

            } else {

                alert("Failed to submit package");

            }

        } catch (err) {

            console.error(err);
            alert("Server error");

        }

    };


    return (

        <div style={{
            padding: "40px",
            background: "#f8fafc",
            minHeight: "100vh"
        }}>

            <h1 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "20px"
            }}>
                Add New Package
            </h1>


            {/* BASIC INFO */}

            <div style={card}>

                <h3 style={{ marginBottom: "20px" }}>Basic Information</h3>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: "15px"
                }}>

                    <input name="title" placeholder="Package Title" onChange={handleChange} style={input} />
                    <input name="destination" placeholder="Destination" onChange={handleChange} style={input} />
                    <input name="days" type="number" placeholder="Days" onChange={handleChange} style={input} />
                    <input name="nights" type="number" placeholder="Nights" onChange={handleChange} style={input} />
                    <input name="price" type="number" placeholder="Price per Person" onChange={handleChange} style={input} />
                    <input name="travelers" type="number" placeholder="Max Travelers" onChange={handleChange} style={input} />
                    <input name="rating" type="number" placeholder="Hotel Rating" onChange={handleChange} style={input} />

                    <textarea
                        name="description"
                        placeholder="Description"
                        onChange={handleChange}
                        style={{ ...input, gridColumn: "span 4", height: "80px" }}
                    />

                </div>

                {/* PACKAGE TYPE SECTION */}
                <div style={{ marginTop: "20px" }}>
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
                                    checked={pkg.package_types.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

            </div>


            {/* IMAGE UPLOAD */}

            <div style={card}>

                <h3>Package Images</h3>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImages}
                    style={{ marginTop: "10px" }}
                />

                {/* IMAGE PREVIEW */}

                <div style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap"
                }}>

                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(img)}
                            alt=""
                            style={{
                                width: "120px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "6px"
                            }}
                        />
                    ))}

                </div>

            </div>


            {/* INCLUSIONS */}

            <div style={card}>

                <h3>Inclusions</h3>

                {pkg.inclusions.map((inc, i) => (
                    <input
                        key={i}
                        placeholder="Example: Round Trip Flights"
                        style={{ ...input, marginTop: "10px" }}
                        onChange={(e) => {
                            const arr = [...pkg.inclusions];
                            arr[i] = e.target.value;
                            setPkg({ ...pkg, inclusions: arr });
                        }}
                    />
                ))}

                <button onClick={addInclusion} style={addBtn}>
                    + Add Inclusion
                </button>

            </div>


            {/* EXCLUSIONS */}

            <div style={card}>

                <h3>Exclusions</h3>

                {pkg.exclusions.map((exc, i) => (
                    <input
                        key={i}
                        placeholder="Example: Personal Expenses"
                        style={{ ...input, marginTop: "10px" }}
                        onChange={(e) => {
                            const arr = [...pkg.exclusions];
                            arr[i] = e.target.value;
                            setPkg({ ...pkg, exclusions: arr });
                        }}
                    />
                ))}

                <button onClick={addExclusion} style={addBtn}>
                    + Add Exclusion
                </button>

            </div>


            {/* ITINERARY */}

            <div style={card}>

                <h3>Day-wise Itinerary</h3>

                {pkg.itinerary.map((day, i) => (
                    <div key={i} style={{
                        borderLeft: "4px solid #3b82f6",
                        paddingLeft: "15px",
                        marginTop: "15px"
                    }}>

                        <h4>Day {day.day}</h4>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px" }}>
                            <input
                                placeholder="Day Title"
                                style={input}
                                onChange={(e) => {
                                    const arr = [...pkg.itinerary];
                                    arr[i].title = e.target.value;
                                    setPkg({ ...pkg, itinerary: arr });
                                }}
                            />
                            <input
                                placeholder="Hotel for this day"
                                style={input}
                                onChange={(e) => handleHotelChange(day.day, e.target.value)}
                            />
                        </div>

                        <textarea
                            placeholder="Day Description"
                            style={{ ...input, marginTop: "10px", height: "60px" }}
                            onChange={(e) => {
                                const arr = [...pkg.itinerary];
                                arr[i].description = e.target.value;
                                setPkg({ ...pkg, itinerary: arr });
                            }}
                        />

                    </div>
                ))}

                <button onClick={addDay} style={addBtn}>
                    + Add Day
                </button>

            </div>


            {/* BUTTONS */}

            <div style={{ display: "flex", gap: "15px" }}>

                <button
                    onClick={() => navigate("/agent-dashboard")}
                    style={{
                        padding: "10px 20px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        background: "white",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>

                <button
                    onClick={submitPackage}
                    style={{
                        padding: "10px 20px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Submit for Approval
                </button>

            </div>

        </div>

    );
};

const input = {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    width: "100%"
};

const card = {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "25px"
};

const addBtn = {
    marginTop: "15px",
    padding: "8px 15px",
    background: "#e2e8f0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

export default AddPackage;