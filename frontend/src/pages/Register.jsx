import React, { useState } from 'react';
import { Plane, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const [agreed, setAgreed] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (password !== confirmPassword) {
            setErrorMsg("Passwords don't match");
            return;
        }

        if (password.length < 8) {
            setErrorMsg("Password must be at least 8 characters");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setErrorMsg("Password must contain at least one uppercase letter");
            return;
        }

        if (!/[0-9]/.test(password)) {
            setErrorMsg("Password must contain at least one number");
            return;
        }

        if (!/[@,#,*,!]/.test(password)) {
            setErrorMsg("Password must contain at least one special character (@, #, *)");
            return;
        }

        setIsLoading(true);

        try {

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    role: role.toLowerCase()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            if(role === "Agent"){
            setSuccessMsg("Registration successful! Your account is waiting for admin approval.");
            }else{
            setSuccessMsg("Registration successful! You can now login.");
            }

            setTimeout(() => {
            navigate('/login');
            }, role === "Agent" ? 4000 : 2000);

        } catch (err) {

            console.error('Registration error:', err);
            setErrorMsg(err.message);

        } finally {

            setIsLoading(false);

        }
    };

    return (

        <div className="login-page">

            <div className="register-container">

                {/* Logo */}
                <div className="login-logo register-logo">
                    <div className="logo-icon-wrapper-small">
                        <Plane size={24} color="white" />
                    </div>
                    <h1>TravelHub</h1>
                </div>

                {/* Title */}
                <h2 className="login-title">Create Account</h2>

                {/* Dynamic subtitle */}
                {/* <p className="register-subtitle">
                    Join as {role === "Admin"
                        ? "an Administrator"
                        : role === "Agent"
                            ? "a Travel agent"
                            : "a Customer"}
                </p> */}

                {/* Messages */}
                {errorMsg &&
                    <div className="error-message"
                        style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                }

                {successMsg &&
                    <div className="success-message"
                        style={{ color: '#10b981', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                        {successMsg}
                    </div>
                }

                <form className="login-form-new" onSubmit={handleRegister}>

                    {/* Full Name */}
                    <div className="form-group-new">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email */}
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

                        {email.length > 0 && (
                            <div className="input-rules">
                                <p className={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'rule-met' : 'rule-unmet'}>
                                    Must be a valid email address
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Password */}
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

                        {password.length > 0 && (
                            <ul className="input-rules password-rules">
                                <li className={password.length >= 8 ? 'rule-met' : 'rule-unmet'}>
                                    At least 8 characters
                                </li>
                                <li className={/[A-Z]/.test(password) ? 'rule-met' : 'rule-unmet'}>
                                    At least 1 uppercase letter
                                </li>
                                <li className={/[0-9]/.test(password) ? 'rule-met' : 'rule-unmet'}>
                                    At least 1 number
                                </li>
                                <li className={/[@,#,*,!]/.test(password) ? 'rule-met' : 'rule-unmet'}>
                                    At least 1 special character (@, #, *, !)
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group-new">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {confirmPassword.length > 0 && (
                            <div className="input-rules">
                                <p className={password === confirmPassword ? 'rule-met' : 'rule-unmet'}>
                                    Passwords must match
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Role Dropdown */}
                    <div className="form-group-new">
                        <label htmlFor="role">Register As</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '15px',
                                outline: 'none',
                                backgroundColor: '#f8fafc'
                            }}
                        >
                            <option value="Customer">Customer</option>
                            <option value="Agent">Travel Agent</option>
                        </select>
                    </div>

                    {/* Terms */}
                    <div className="form-options register-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                required
                            />
                             <span>I agree to the Terms of Service and Privacy Policy</span>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`btn-login-new btn-register-submit ${agreed &&
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                            password.length >= 8 &&
                            /[A-Z]/.test(password) &&
                            /[0-9]/.test(password) &&
                            password === confirmPassword
                            ? 'active'
                            : ''
                            }`}
                    >
                        {isLoading ? 'Creating...' : 'Create Account'}
                    </button>

                </form>

                {/* Login link */}
                <div className="login-footer-new">
                    <p>
                        Already have an account?
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            navigate('/login');
                        }}>
                            Login
                        </a>
                    </p>
                </div>

                {/* Back button */}
                <button
                    className="btn-back register-back"
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

export default Register;