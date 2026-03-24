import React, { useState } from 'react';
import { Plane, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role: role.toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role.toLowerCase() === 'agent') {
                navigate('/agent-dashboard');
            } else if (data.user.role.toLowerCase() === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('Login error:', err);
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-logo">
                    <div className="logo-icon-wrapper-small">
                        <Plane size={24} color="white" />
                    </div>
                    <h1>TravelHub</h1>
                </div>

                <h2 className="login-title">Welcome Back</h2>

                {errorMsg && (
                    <div
                        className="error-message"
                        style={{
                            color: '#ef4444',
                            fontSize: '14px',
                            marginBottom: '16px',
                            textAlign: 'center',
                            backgroundColor: '#fee2e2',
                            padding: '10px',
                            borderRadius: '6px'
                        }}
                    >
                        {errorMsg}
                    </div>
                )}

                {/* ROLE TABS */}
                <div className={`role-tabs ${role.toLowerCase()}`}>
                    {['Customer', 'Agent'].map((r) => (
                        <button
                            key={r}
                            type="button"
                            className={`role-tab ${role === r ? 'active' : ''}`}
                            onClick={() => setRole(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <form className="login-form-new" onSubmit={handleLogin}>

                    <div className="form-group-new">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-new">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* ⭐ FORGOT PASSWORD LINK */}
                        <div style={{ textAlign: "right", marginTop: "5px" }}>
                            <a
                                href="#"
                                style={{ fontSize: "13px", color: "#2563eb" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/forgot-password');
                                }}
                            >
                                Forgot Password?
                            </a>
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-login-new"
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? 'Logging in...' : `Login as ${role}`}
                    </button>

                </form>

                <div className="login-footer-new">
                    <p>
                        Don't have an account?{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/register');
                            }}
                        >
                            Register
                        </a>
                    </p>
                </div>

                <button
                    className="btn-back"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}
                >
                    <ArrowLeft size={14} /> Back to Home
                </button>

            </div>
        </div>
    );
};

export default Login;