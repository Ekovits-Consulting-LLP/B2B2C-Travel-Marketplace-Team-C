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
        itinerary: [{ day: 1, title: "", description: "", meals: { breakfast: false, lunch: false, dinner: false } }],
        package_types: [],
        hotels: [],
        offer_percent: "",
        is_featured: false
    });

    const [images, setImages] = useState([]);

    const [errors, setErrors] = useState({});

    const packageTypesList = ["Luxury", "Family", "Honeymoon", "Adventure", "Leisure", "Group", "Couple"];

    /* INPUT CHANGE */

    const handleChange = (e) => {
        const name = e.target.name;
        setPkg({ ...pkg, [name]: e.target.value });
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: false}));
        }
    };

    const handleTypeChange = (type) => {
        setPkg(prev => {
            const types = prev.package_types.includes(type)
                ? prev.package_types.filter(t => t !== type)
                : [...prev.package_types, type];
            const newPkg = { ...prev, package_types: types };
            if (types.length === 0) {
                setErrors(prev => ({...prev, package_types: true}));
            } else {
                setErrors(prev => ({...prev, package_types: false}));
            }
            return newPkg;
        });
    };

    const handleHotelChange = (day, name) => {
        setPkg(prev => {
            const hotels = [...prev.hotels];
            const index = hotels.findIndex(h => h.day === day);
            if (!name) {
                if (index > -1) {
                    hotels.splice(index, 1);
                }
            } else {
                if (index > -1) {
                    hotels[index].name = name;
                } else {
                    hotels.push({ day, name });
                }
            }
            const newPkg = { ...prev, hotels };
            if (hotels.length < prev.itinerary.length || hotels.some(h => !h.name)) {
                setErrors(prev => ({...prev, hotels: true}));
            } else {
                setErrors(prev => ({...prev, hotels: false}));
            }
            return newPkg;
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
                { day: pkg.itinerary.length + 1, title: "", description: "", meals: { breakfast: false, lunch: false, dinner: false } }
            ]
        });
    };


    /* IMAGE SELECT */

    const handleImages = (e) => {
        const imgs = Array.from(e.target.files);
        setImages(imgs);
        if (imgs.length === 0) {
            setErrors(prev => ({...prev, images: true}));
        } else {
            setErrors(prev => ({...prev, images: false}));
        }
    };


    /* SUBMIT PACKAGE */

    const submitPackage = async () => {

        let hasError = false;
        const fields = ['title', 'destination', 'days', 'nights', 'price', 'travelers', 'rating', 'description', 'offer_percent'];
        fields.forEach(field => {
            if (!pkg[field]) {
                setErrors(prev => ({...prev, [field]: true}));
                hasError = true;
            }
        });
        if (pkg.package_types.length === 0) {
            setErrors(prev => ({...prev, package_types: true}));
            hasError = true;
        }
        if (images.length === 0) {
            setErrors(prev => ({...prev, images: true}));
            hasError = true;
        }
        if (pkg.inclusions.length === 0 || pkg.inclusions.some(i => !i)) {
            setErrors(prev => ({...prev, inclusions: true}));
            hasError = true;
        }
        if (pkg.exclusions.length === 0 || pkg.exclusions.some(e => !e)) {
            setErrors(prev => ({...prev, exclusions: true}));
            hasError = true;
        }
        if (pkg.itinerary.some(day => !day.title || !day.description || !pkg.hotels.find(h => h.day === day.day)?.name)) {
            setErrors(prev => ({...prev, itinerary: true}));
            hasError = true;
        }
        if (hasError) return;

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
            formData.append("offer_percent", pkg.offer_percent);
            formData.append("is_featured", pkg.is_featured);

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

                    <input name="title" required placeholder="Package Title" onChange={handleChange} style={{...input, borderColor: errors.title ? 'red' : '#ddd'}} />
                    <input name="destination" required placeholder="Destination" onChange={handleChange} style={{...input, borderColor: errors.destination ? 'red' : '#ddd'}} />
                    <input name="days" type="number" min="1" required placeholder="Days" onChange={handleChange} style={{...input, borderColor: errors.days ? 'red' : '#ddd'}} />
                    <input name="nights" type="number" min="1" required placeholder="Nights" onChange={handleChange} style={{...input, borderColor: errors.nights ? 'red' : '#ddd'}} />
                    <input name="price" type="number" min="1" required placeholder="Price per Person" onChange={handleChange} style={{...input, borderColor: errors.price ? 'red' : '#ddd'}} />
                    <input name="travelers" type="number" min="1" required placeholder="Max Travelers" onChange={handleChange} style={{...input, borderColor: errors.travelers ? 'red' : '#ddd'}} />
                    <input name="rating" type="number" min="1" max="5" required placeholder="Hotel Rating" onChange={handleChange} style={{...input, borderColor: errors.rating ? 'red' : '#ddd'}} />

                    <textarea
                        name="description"
                        required placeholder="Description"
                        onChange={handleChange}
                        style={{ ...input, gridColumn: "span 4", height: "80px", borderColor: errors.description ? 'red' : '#ddd' }}
                    />

                    <input 
                        name="offer_percent" 
                        type="number" 
                        required placeholder="Discount Offer (%)" 
                        onChange={handleChange} 
                        style={{...input, borderColor: errors.offer_percent ? 'red' : '#ddd'}} 
                    />

                    <label style={{ ...input, display: "flex", alignItems: "center", gap: "10px", background: "#fff" }}>
                        <input 
                            type="checkbox" 
                            checked={pkg.is_featured} 
                            onChange={(e) => setPkg({ ...pkg, is_featured: e.target.checked })} 
                        />
                        Mark as Featured
                    </label>

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
                    {errors.package_types && <p style={{color: 'red', marginTop: '10px'}}>Please select at least one package type</p>}
                </div>

            </div>


            {/* IMAGE UPLOAD */}

            <div style={card}>

                <h3>Package Images</h3>

                <input
                    type="file"
                    multiple
                    required
                    accept="image/*"
                    onChange={handleImages}
                    style={{ marginTop: "10px" }}
                />

                {errors.images && <p style={{color: 'red'}}>Please upload at least one image</p>}

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
                        required placeholder="Example: Round Trip Flights"
                        style={{ ...input, marginTop: "10px", borderColor: errors.inclusions ? 'red' : '#ddd' }}
                        onChange={(e) => {
                            const arr = [...pkg.inclusions];
                            arr[i] = e.target.value;
                            setPkg({ ...pkg, inclusions: arr });
                            if (arr.length === 0 || arr.some(inc => !inc)) {
                                setErrors(prev => ({...prev, inclusions: true}));
                            } else {
                                setErrors(prev => ({...prev, inclusions: false}));
                            }
                        }}
                    />
                ))}

                <button onClick={addInclusion} style={addBtn}>
                    + Add Inclusion
                </button>
                {errors.inclusions && <p style={{color: 'red'}}>Please fill all inclusions</p>}

            </div>


            {/* EXCLUSIONS */}

            <div style={card}>

                <h3>Exclusions</h3>

                {pkg.exclusions.map((exc, i) => (
                    <input
                        key={i}
                        required placeholder="Example: Personal Expenses"
                        style={{ ...input, marginTop: "10px", borderColor: errors.exclusions ? 'red' : '#ddd' }}
                        onChange={(e) => {
                            const arr = [...pkg.exclusions];
                            arr[i] = e.target.value;
                            setPkg({ ...pkg, exclusions: arr });
                            if (arr.length === 0 || arr.some(exc => !exc)) {
                                setErrors(prev => ({...prev, exclusions: true}));
                            } else {
                                setErrors(prev => ({...prev, exclusions: false}));
                            }
                        }}
                    />
                ))}

                <button onClick={addExclusion} style={addBtn}>
                    + Add Exclusion
                </button>
                {errors.exclusions && <p style={{color: 'red'}}>Please fill all exclusions</p>}

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
                                required
                                placeholder="Day Title"
                                style={{...input, borderColor: errors.itinerary ? 'red' : '#ddd'}}
                                onChange={(e) => {
                                    const arr = [...pkg.itinerary];
                                    arr[i].title = e.target.value;
                                    setPkg({ ...pkg, itinerary: arr });
                                    if (arr.some(day => !day.title || !day.description)) {
                                        setErrors(prev => ({...prev, itinerary: true}));
                                    } else {
                                        setErrors(prev => ({...prev, itinerary: false}));
                                    }
                                }}
                            />
                            <input
                                required
                                placeholder="Hotel for this day"
                                style={{...input, borderColor: errors.itinerary ? 'red' : '#ddd'}}
                                onChange={(e) => handleHotelChange(day.day, e.target.value)}
                            />
                        </div>

                        <textarea
                            required
                            placeholder="Day Description"
                            style={{ ...input, marginTop: "10px", height: "60px", borderColor: errors.itinerary ? 'red' : '#ddd' }}
                            onChange={(e) => {
                                const arr = [...pkg.itinerary];
                                arr[i].description = e.target.value;
                                setPkg({ ...pkg, itinerary: arr });
                                if (arr.some(day => !day.title || !day.description)) {
                                    setErrors(prev => ({...prev, itinerary: true}));
                                } else {
                                    setErrors(prev => ({...prev, itinerary: false}));
                                }
                            }}
                        />

                        <div style={{ marginTop: "15px" }}>
                            <h5 style={{ marginBottom: "8px" }}>Meals Included</h5>
                            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input
                                        type="checkbox"
                                        checked={day.meals.breakfast || false}
                                        onChange={(e) => {
                                            const arr = [...pkg.itinerary];
                                            arr[i].meals.breakfast = e.target.checked;
                                            setPkg({ ...pkg, itinerary: arr });
                                        }}
                                    />
                                    Breakfast
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input
                                        type="checkbox"
                                        checked={day.meals.lunch || false}
                                        onChange={(e) => {
                                            const arr = [...pkg.itinerary];
                                            arr[i].meals.lunch = e.target.checked;
                                            setPkg({ ...pkg, itinerary: arr });
                                        }}
                                    />
                                    Lunch
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input
                                        type="checkbox"
                                        checked={day.meals.dinner || false}
                                        onChange={(e) => {
                                            const arr = [...pkg.itinerary];
                                            arr[i].meals.dinner = e.target.checked;
                                            setPkg({ ...pkg, itinerary: arr });
                                        }}
                                    />
                                    Dinner
                                </label>
                            </div>
                        </div>

                    </div>
                ))}

                <button onClick={addDay} style={addBtn}>
                    + Add Day
                </button>
                {errors.itinerary && <p style={{color: 'red'}}>Please fill all itinerary details</p>}

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