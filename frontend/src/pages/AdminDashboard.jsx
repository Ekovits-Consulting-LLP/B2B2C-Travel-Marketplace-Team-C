import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Package, CalendarCheck, Coffee, Utensils, Pizza } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminRequests from "./AdminRequests";
import MealStatus from "../components/MealStatus";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({ totalAgents: 0 });
    const [agents, setAgents] = useState([]);
    const [pendingPackages, setPendingPackages] = useState([]);
    const [allPackages, setAllPackages] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const [activePage, setActivePage] = useState("overview");
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [destinationFilter, setDestinationFilter] = useState("");


    useEffect(() => {

        const userStr = localStorage.getItem("user");

        if (!userStr) {
            navigate("/login");
            return;
        }

        const user = JSON.parse(userStr);

        if (user.role.toLowerCase() !== "admin") {
            navigate("/login");
            return;
        }

        setAdminUser(user);

        fetchDashboardData();

    }, [navigate]);

    useEffect(() => {
        if (activePage === "bookings") {
            fetchBookings();
        }
    }, [activePage]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const getImageUrl = (img) => {
        if (!img) return "";
        if (typeof img !== "string") return "";
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        if (img.startsWith("/")) return `${API_BASE_URL}${img}`;
        return `${API_BASE_URL}/uploads/${img}`;
    };

    /* ---------- JSON PARSER ---------- */

    const parseJSON = (data) => {
        try {
            return typeof data === "string" ? JSON.parse(data) : data || [];
        } catch {
            return [];
        }
    };

    /* ---------- FETCH DATA ---------- */

    const fetchDashboardData = async () => {

        setLoading(true);

        try {

            const statsRes = await fetch("/api/admin/stats");
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            const agentsRes = await fetch("/api/admin/agents");
            if (agentsRes.ok) {
                const agentsData = await agentsRes.json();
                setAgents(agentsData);
            }

            const packagesRes = await fetch("/api/admin/pending-packages");
            if (packagesRes.ok) {
                const packagesData = await packagesRes.json();
                setPendingPackages(packagesData);
            }

            const allPackagesRes = await fetch("/api/admin/all-packages");
            if (allPackagesRes.ok) {
                const data = await allPackagesRes.json();
                setAllPackages(data);
            }

            const accountsRes = await fetch("/api/admin/accounts");
            if (accountsRes.ok) {
                const accData = await accountsRes.json();
                setAccounts(accData);
            }

            const bookingsRes = await fetch('/api/bookings');
            if (bookingsRes.ok) {
                const bookingsData = await bookingsRes.json();
                setBookings(bookingsData);
            }

        } catch (err) {
            console.error(err);
        }

        setLoading(false);

    };

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (err) {
            console.error('Failed to load bookings', err);
        }
    };

    /* ---------- APPROVE / REJECT ---------- */

    const handleApprove = async (id) => {

        await fetch(`/api/admin/packages/${id}/approve`, {
            method: "PUT"
        });

        fetchDashboardData();

    };

    const handleReject = async (id) => {

        await fetch(`/api/admin/packages/${id}/reject`, {
            method: "PUT"
        });

        fetchDashboardData();

    };
    /* ---------- IMAGE MANAGEMENT ---------- */

    const deleteImage = async (packageId, image) => {

        await fetch(`/api/admin/packages/${packageId}/delete-image`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image })
        });

        const res = await fetch(`/api/packages/${packageId}`);
        const data = await res.json();
        setSelectedPackage(data);
        fetchDashboardData();

    };

    const addImage = async (packageId, file) => {

        const formData = new FormData();
        formData.append("images", file);

        await fetch(`/api/admin/packages/${packageId}/add-image`, {
            method: "POST",
            body: formData
        });

        const res = await fetch(`/api/packages/${packageId}`);
        const data = await res.json();
        setSelectedPackage(data);

        fetchDashboardData();

    };

    const updateImage = async (packageId, oldImage, file) => {

        const formData = new FormData();
        formData.append("images", file);
        formData.append("oldImage", oldImage);

        await fetch(`/api/admin/packages/${packageId}/update-image`, {
            method: "PUT",
            body: formData
        });

        const res = await fetch(`/api/packages/${packageId}`);
        const data = await res.json();
        setSelectedPackage(data);


        fetchDashboardData();

    };

    const approveAccount = async (id) => {
        try {
            const response = await fetch(`/api/admin/users/${id}/approve`, {
                method: "PUT"
            });
            if (response.ok) {
                fetchDashboardData();
            } else {
                console.error("Failed to approve account");
            }
        } catch (err) {
            console.error("Error approving account:", err);
        }
    };

    const rejectAccount = async (id) => {
        try {
            const response = await fetch(`/api/admin/users/${id}/reject`, { method: "PUT" });
            if (response.ok) {
                fetchDashboardData();
            } else {
                console.error("Failed to reject account");
            }
        } catch (err) {
            console.error("Error rejecting account:", err);
        }
    };

    const handleSetOffer = async (id, offerVal) => {
        try {
            const res = await fetch(`/api/admin/packages/${id}/set-offer`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ offer_percent: offerVal })
            });
            if (res.ok) {
                const updatedRes = await fetch(`/api/packages/${id}`);
                const data = await updatedRes.json();
                setSelectedPackage(data);
                fetchDashboardData();
                alert("Discount updated!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetFeatured = async (id, isFeatured) => {
        try {
            const res = await fetch(`/api/admin/packages/${id}/feature`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_featured: isFeatured })
            });
            if (res.ok) {
                const updatedRes = await fetch(`/api/packages/${id}`);
                const data = await updatedRes.json();
                setSelectedPackage(data);
                fetchDashboardData();
                alert("Featured status updated!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePackage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this package?")) return;

        try {
            const res = await fetch(`/api/admin/packages/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                alert("Package deleted successfully");
                setSelectedPackage(null);
                fetchDashboardData();
            } else {
                alert("Failed to delete package");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (

        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

            {/* SIDEBAR */}

            <div style={{
                width: "240px",
                background: "linear-gradient(180deg,#2563eb,#1e40af)",
                color: "white",
                padding: "30px 20px",
                display: "flex",
                flexDirection: "column"
            }}>

                <h2 style={{ marginBottom: "40px" }}>AdminHub</h2>

                <button
                    onClick={() => setActivePage("overview")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        background: activePage === "overview" ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        marginBottom: "10px"
                    }}>
                    <Users size={18} /> Overview
                </button>

                <button
                    onClick={() => setActivePage("packages")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        background: activePage === "packages" ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        marginBottom: "10px"
                    }}>
                    <Package size={18} /> Packages
                </button>

                <button
                    onClick={() => setActivePage("accounts")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        background: activePage === "accounts" ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        marginBottom: "10px"
                    }}>
                    <Users size={18} /> Account Approval
                </button>

                <button
                    onClick={() => setActivePage("agents")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        background: activePage === "agents" ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        marginBottom: "10px"
                    }}>
                    <Users size={18} /> Registered Agents
                </button>

                <button
                    onClick={() => setActivePage("bookings")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        width: "100%",
                        textAlign: "left",
                        background: activePage === "bookings" ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        marginBottom: "10px",
                        cursor: "pointer"
                    }}>
                    <CalendarCheck size={18} />
                    <span>Bookings</span>
                </button>

                <button
                    onClick={() => setActivePage("requests")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        width: "100%",
                        textAlign: "left",
                        background: activePage === "requests" ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        marginBottom: "10px",
                        cursor: "pointer"
                    }}>
                    <Package size={18} />
                    <span>Package Update Requests</span>
                </button>

                <button
                    onClick={() => navigate("/")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        background: "transparent",
                        border: "none",
                        color: "white"
                    }}>
                    <ArrowLeft size={18} /> Back to Home
                </button>

                <div style={{ marginTop: "auto" }}>

                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            width: "100%",
                            background: "#ef4444",
                            border: "none",
                            padding: "10px",
                            borderRadius: "6px",
                            color: "white",
                            marginTop: "30px"
                        }}>
                        Logout
                    </button>

                </div>

            </div>

            {/* MAIN CONTENT */}

            <div style={{ flex: 1, padding: "40px" }}>

                {/* HEADER */}

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}>

                    <div>

                        <h1 style={{ fontSize: "28px" }}>Admin Dashboard</h1>

                        <p style={{ color: "#6b7280" }}>
                            Manage travel platform
                        </p>

                    </div>

                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                    }}>
                        {adminUser?.full_name?.charAt(0) || "A"}
                    </div>

                </div>

                {/* OVERVIEW */}

                {activePage === "overview" && (

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px"
                    }}>

                        <div style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "12px",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
                        }}>
                            <h2 style={{ fontSize: "30px" }}>{stats.totalAgents}</h2>
                            <p style={{ color: "#6b7280" }}>Registered Agents</p>
                        </div>

                        <div style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "12px",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
                        }}>
                            <h2 style={{ fontSize: "30px" }}>{pendingPackages.length}</h2>
                            <p style={{ color: "#6b7280" }}>Pending Packages</p>
                        </div>

                        <div style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "12px",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
                        }}>
                            <h2 style={{ fontSize: "30px" }}>{bookings.length}</h2>
                            <p style={{ color: "#6b7280" }}>Total Bookings</p>
                        </div>

                        <div style={{
                            background: "white",
                            borderRadius: "12px",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                            gridColumn: "span 2"
                        }}>

                            <div style={{
                                padding: "20px",
                                borderBottom: "1px solid #eee",
                                fontWeight: "600",
                                fontSize: "18px"
                            }}>
                                Pending Packages
                            </div>

                            {pendingPackages.length === 0 ? (

                                <div style={{ padding: "30px", textAlign: "center", color: "#6b7280" }}>
                                    No packages pending approval
                                </div>

                            ) : (

                                pendingPackages.map(pkg => (

                                    <div
                                        key={pkg.id}
                                        style={{
                                            padding: "20px",
                                            borderBottom: "1px solid #eee",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >

                                        <div>

                                            <h3>{pkg.title}</h3>
                                            <p>{pkg.destination} • {pkg.days} days</p>
                                            <p>Price: ${pkg.price}</p>
                                            <p>Agent: {pkg.agent_name || `Agent #${pkg.agent_id}`}</p>

                                        </div>

                                        <div style={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "center"
                                        }}>

                                            <button
                                                onClick={() => setSelectedPackage(pkg)}
                                                style={{
                                                    background: "#6366f1",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px"
                                                }}>
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => handleApprove(pkg.id)}
                                                style={{
                                                    background: "#10b981",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px"
                                                }}>
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => handleReject(pkg.id)}
                                                style={{
                                                    background: "#ef4444",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px"
                                                }}>
                                                Reject
                                            </button>

                                        </div>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>

                )}

                {/* PACKAGES PAGE */}

                {activePage === "packages" && (

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                             <h2 style={{ margin: 0 }}>All Packages</h2>
                             <button 
                                 onClick={() => navigate("/admin/add-package")}
                                 style={{
                                     background: "#10b981",
                                     color: "white",
                                     border: "none",
                                     padding: "10px 20px",
                                     borderRadius: "8px",
                                     cursor: "pointer",
                                     fontWeight: "600"
                                 }}
                             >
                                 + Add New Package
                             </button>
                         </div>

                        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <label htmlFor="admin-destination-filter">Destination Filter:</label>
                            <select
                                id="admin-destination-filter"
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                                value={destinationFilter}
                                onChange={(e) => setDestinationFilter(e.target.value)}
                            >
                                <option value="">All</option>
                                {[...new Set(allPackages.map((p) => p.destination.split(',')[0].trim()))].map((dest) => (
                                    <option key={dest} value={dest}>{dest}</option>
                                ))}
                            </select>
                            <button
                                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", background: "white", cursor: "pointer" }}
                                onClick={() => setDestinationFilter("")}
                            >
                                Reset
                            </button>
                        </div>

                        {(destinationFilter ? allPackages.filter(p => p.destination.split(',')[0].trim() === destinationFilter) : allPackages).map(pkg => (

                            <div key={pkg.id} style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                marginBottom: "15px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                            }}>

                                <h3>{pkg.title}</h3>
                                <p>{pkg.destination} • {pkg.days} Days / {pkg.nights} Nights</p>
                                <p>Price: ${pkg.price}</p>

                                <p>Status:
                                    <span style={{
                                        marginLeft: "6px",
                                        color:
                                            pkg.status === "approved" ? "green" :
                                                pkg.status === "rejected" ? "red" :
                                                    "orange"
                                    }}>
                                        {pkg.status}
                                    </span>
                                </p>

                                <p>Agent: {pkg.agent_name}</p>

                                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

                                    <button
                                        onClick={() => setSelectedPackage(pkg)}
                                        style={{
                                            background: "#6366f1",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        View Details
                                    </button>

                                    <button
                                        onClick={() => navigate(`/admin/edit-package/${pkg.id}`)}
                                        style={{
                                            background: "#2563eb",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDeletePackage(pkg.id)}
                                        style={{
                                            background: "#ef4444",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}


                {/* ACCOUNT APPROVAL */}

                {activePage === "accounts" && (

                    <div>

                        <h2 style={{ marginBottom: "20px" }}>Account Approval</h2>

                        {accounts.length === 0 ? (

                            <p>No pending accounts</p>

                        ) : (

                            accounts.map(acc => (

                                <div key={acc.id} style={{
                                    background: "white",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>

                                    <div>
                                        <h4>{acc.full_name}</h4>
                                        <p>{acc.email}</p>
                                        <p>Role: {acc.role}</p>
                                        <p>
                                            Status:
                                            <span style={{
                                                marginLeft: "6px",
                                                color:
                                                    acc.status === "approved" ? "green" :
                                                        acc.status === "rejected" ? "red" :
                                                            "orange"
                                            }}>
                                                {acc.role === "customer" ? "Auto Approved" : acc.status}
                                            </span>
                                        </p>
                                    </div>

                                    {acc.status === "pending" && (

                                        <div style={{ display: "flex", gap: "10px" }}>

                                            <button
                                                onClick={() => approveAccount(acc.id)}
                                                style={{
                                                    background: "#10b981",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px"
                                                }}>
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => rejectAccount(acc.id)}
                                                style={{
                                                    background: "#ef4444",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px"
                                                }}>
                                                Reject
                                            </button>

                                        </div>

                                    )}

                                </div>

                            ))

                        )}

                    </div>

                )}


                {/* AGENTS */}

                {activePage === "agents" && (

                    <div>

                        <h2 style={{ marginBottom: "20px" }}>Registered Agents</h2>

                        {/* PACKAGE UPDATE REQUESTS */}



                        {agents.map(agent => (

                            <div key={agent.id} style={{
                                background: "white",
                                padding: "15px",
                                borderRadius: "8px",
                                marginBottom: "10px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                            }}>

                                <h4>{agent.full_name}</h4>
                                <p>{agent.email}</p>
                                <p>Joined: {new Date(agent.created_at).toLocaleDateString()}</p>

                            </div>

                        ))}

                    </div>

                )}
                {/* BOOKINGS ADMIN */}

                {activePage === "bookings" && (
                    <div>
                        <h2>Bookings Overview</h2>
                        <p>{bookings.length} total bookings</p>

                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Email</th>
                                        <th>Package</th>
                                        <th>Agent</th>
                                        <th>Travel Date</th>
                                        <th>Travelers</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                                No bookings available
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map((b) => (
                                            <tr key={b.id}>
                                                <td>{b.id}</td>
                                                <td>{b.customer_name}</td>
                                                <td>{b.email}</td>
                                                <td>{b.package_title || b.package_id}</td>
                                                <td>{b.agent_name || 'N/A'}</td>
                                                <td>{b.travel_date ? new Date(b.travel_date).toLocaleDateString() : 'N/A'}</td>
                                                <td>{b.travelers}</td>
                                                <td>{b.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PACKAGE UPDATE REQUESTS */}

                {activePage === "requests" && (
                    <AdminRequests />
                )}
            </div>



            {/* ---------- PACKAGE DETAILS MODAL ---------- */}

            {selectedPackage && (

                <div style={{
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
                }}>

                    <div style={{
                        background: "white",
                        borderRadius: "14px",
                        width: "700px",
                        maxHeight: "85vh",
                        overflowY: "auto",
                        padding: "30px"
                    }}>

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
                        </div>

                        {selectedPackage.package_types && parseJSON(selectedPackage.package_types).length > 0 && (
                            <div style={{ marginTop: "15px" }}>
                                <b>Package Type :</b> {parseJSON(selectedPackage.package_types).join(", ")}
                            </div>
                        )}

                        <div style={{ marginTop: "20px", padding: "15px", background: "#fffbe6", border: "1px solid #fde047", borderRadius: "8px" }}>
                            <h3 style={{ margin: "0 0 10px 0" }}>Admin Controls</h3>
                            
                            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "600", cursor: "pointer" }}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedPackage.is_featured || false} 
                                        onChange={(e) => handleSetFeatured(selectedPackage.id, e.target.checked)} 
                                    />
                                    Mark as Featured
                                </label>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <b style={{ fontSize: "14px" }}>Discount (%):</b>
                                    <input 
                                        type="number" 
                                        defaultValue={selectedPackage.offer_percent || 0}
                                        id={`discount-${selectedPackage.id}`}
                                        style={{ padding: "6px", width: "80px", borderRadius: "4px", border: "1px solid #ccc" }}
                                    />
                                    <button 
                                        onClick={() => handleSetOffer(selectedPackage.id, document.getElementById(`discount-${selectedPackage.id}`).value)}
                                        style={{ background: "#4f46e5", color: "white", padding: "6px 12px", borderRadius: "4px", border: "none" }}
                                    >
                                        Save Discount
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                <button 
                                    onClick={() => navigate(`/admin/edit-package/${selectedPackage.id}`)}
                                    style={{
                                        flex: 1,
                                        background: "#2563eb",
                                        color: "white",
                                        border: "none",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    Edit Package Details
                                </button>
                                <button 
                                    onClick={() => handleDeletePackage(selectedPackage.id)}
                                    style={{
                                        flex: 1,
                                        background: "#ef4444",
                                        color: "white",
                                        border: "none",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    Delete Package
                                </button>
                            </div>
                        </div>

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

                            <div key={index} style={{
                                background: "#f1f5f9",
                                padding: "10px",
                                borderRadius: "6px",
                                marginBottom: "8px"
                            }}>

                                <b>Day {day.day} - {day.title}</b>
                                {selectedPackage.hotels && Array.isArray(selectedPackage.hotels) && selectedPackage.hotels.some(h => h.day_number === day.day) && (
                                    <div style={{ marginTop: "6px", fontSize: "13px", color: "#2563eb" }}>
                                        🏨 Stay: {selectedPackage.hotels.find(h => h.day_number === day.day).hotel_name}
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


                        {/* IMAGES */}

                        {selectedPackage.images && (

                            <>
                                <h3 style={{ marginTop: "20px" }}>Images</h3>

                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

                                    {parseJSON(selectedPackage.images).map((img, index) => (

                                        <div key={index} style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            marginBottom: "10px"
                                        }}>

                                            {/* IMAGE PREVIEW */}
                                            <img
                                                src={getImageUrl(img)}
                                                onClick={() => setPreviewImage(img)}
                                                style={{
                                                    width: "120px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    marginBottom: "6px"
                                                }}
                                            />

                                            {/* IMAGE ACTIONS */}
                                            <div style={{ display: "flex", gap: "5px" }}>

                                                <input
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    id={`replace-${index}`}
                                                    onChange={(e) => updateImage(selectedPackage.id, img, e.target.files[0])}
                                                />

                                                <label
                                                    htmlFor={`replace-${index}`}
                                                    style={{
                                                        background: "#6366f1",
                                                        color: "white",
                                                        padding: "3px 6px",
                                                        borderRadius: "4px",
                                                        fontSize: "11px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Update
                                                </label>

                                                <button
                                                    onClick={() => deleteImage(selectedPackage.id, img)}
                                                    style={{
                                                        background: "#ef4444",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "3px 6px",
                                                        borderRadius: "4px",
                                                        fontSize: "11px"
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                                {/* ADD NEW IMAGE */}

                                <div style={{ marginTop: "15px" }}>

                                    <input
                                    type="file"
                                    multiple
                                    id="add-image"
                                    style={{ display: "none" }}
                                    onChange={(e) => {

                                    const files = e.target.files;

                                    for(let i = 0; i < files.length; i++){
                                    addImage(selectedPackage.id, files[i]);
                                    }

                                    e.target.value = null;

                                    }}
                                    />

                                    <label
                                        htmlFor="add-image"
                                        style={{
                                            background: "#2563eb",
                                            color: "white",
                                            padding: "6px 14px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "13px"
                                        }}
                                    >
                                        + Add Image
                                    </label>

                                </div>

                            </>

                        )}



                        <button
                            onClick={() => setSelectedPackage(null)}
                            style={{
                                marginTop: "25px",
                                padding: "10px 16px",
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "8px"
                            }}>
                            Close
                        </button>

                    </div>

                </div>

            )}



            {/* IMAGE PREVIEW */}

            {previewImage && (

                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2000
                }}>

                    <img
                        src={getImageUrl(previewImage)}
                        style={{
                            maxWidth: "80%",
                            maxHeight: "80%",
                            borderRadius: "10px"
                        }}
                    />

                    <button
                        onClick={() => setPreviewImage(null)}
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "30px",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Close
                    </button>

                </div>

            )}

        </div>

    );

};

export default AdminDashboard;