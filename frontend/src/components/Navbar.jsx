import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plane, User, Sparkles } from 'lucide-react';
import './../index.css';

const Navbar = () => {
    const navigate = useNavigate();

    /* ADD THIS */
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo Section */}
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <div className="logo-icon-wrapper">
                        <div className="logo-icon">
                            <Plane size={24} color="white" />
                        </div>
                        <div className="logo-badge">
                            <Sparkles size={10} color="white" />
                        </div>
                    </div>
                    <div className="logo-text">
                        <h1>TravelHub</h1>
                        <span>Premium Marketplace</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/destination"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        Destinations
                    </NavLink>
                    <NavLink
                        to="/deals"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        Deals
                    </NavLink>
                </div>

                {/* User Actions */}
                <div className="navbar-actions">

                    {/* My Account */}
                    <button
                        className="btn-account"
                        onClick={() => user ? navigate('/account') : navigate('/login')}
                    >
                        <User size={18} />
                        {user ? (user.full_name || user.name || (user.email && user.email.split('@')[0]) || "My Account") : "My Account"}
                    </button>

                    {!user && (
                        <button className="btn-agent" onClick={() => navigate('/register')}>
                            <Sparkles size={16} />
                            Become Agent
                        </button>
                    )}

                    {/* Login / Logout */}
                    {!user ? (

                        <button
                            className="btn-login"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>

                    ) : (

                        <button
                            className="btn-login"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;