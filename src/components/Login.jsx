import React, { useState } from 'react';
import '../style/Login.scss';
import Cookies from 'js-cookie';
import axios from 'axios';
import FormField from './forms/FormField';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = ({ setLoadLogInForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showRegistration, setShowRegistration] = useState(false);
    const [language, setLanguage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(`${API_BASE_URL}/login`, { email, password });
            if (response.status === 202) {
                Cookies.set('token', response.headers.authorization, { expires: 7 });
                Cookies.set('userId', response.data.userId, { expires: 365 });
                Cookies.set('plan', response.data.plan, { expires: 365 });
                Cookies.set('languageId', response.data.languageId, { expires: 365 });
                setLoadLogInForm(false);
            }
        } catch (error) {
            setMessage('Incorrect email or password!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long!');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password, language });
            if (response.status === 201) {
                const data = response.data;
                Cookies.set('languageId', data.id, { expires: 365 });
                Cookies.set('plan', data.plan, { expires: 365 });
                setShowRegistration(false);
                setMessage('Registration successful! Please log in.');
            }
        } catch (error) {
            setMessage('User with this email is already registered!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            {showRegistration ? (
                <form id="registrationForm" onSubmit={handleRegistrationSubmit}>
                    <h2>Create an Account</h2>
                    <p>Please register to continue</p>
                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <FormField
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <FormField
                        id="language"
                        label="Enter your first language you want to learn"
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <div className="footer-links">
                        <p id="message" aria-live="polite">{message}</p>
                        <a href="#" onClick={() => setShowRegistration(false)}>Back to Login</a>
                    </div>
                </form>
            ) : (
                <form id="loginForm" onSubmit={handleLoginSubmit}>
                    <h2>Welcome Back</h2>
                    <p>Please log in to your account</p>
                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <FormField
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                    <div className="footer-links">
                        <p id="message" aria-live="polite">{message}</p>
                        <a href="#" onClick={() => setShowRegistration(true)}>Create an Account</a>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Login;