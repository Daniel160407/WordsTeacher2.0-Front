import React, { useState } from 'react';
import '../style/Login.scss';
import Cookies from "js-cookie";
import axios from 'axios';

const Login = ({ setLoadLogInForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showRegistration, setShowRegistration] = useState(false);

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        const user = {
            email: email,
            password: password
        };
        axios.put('http://localhost:8080/login', user)
            .then(response => {
                if (response.status === 202) {
                    console.log(response.data);
                    Cookies.set('token', response.headers.authorization, { expires: 7 });
                    Cookies.set('userId', response.data)
                    setLoadLogInForm(false);
                }
            })
            .catch(() => {
                setMessage('Incorrect email or password!');
            });
    };

    const handleRegistrationSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            email: email,
            password: password
        };
        axios.post('http://localhost:8080/login', newUser)
            .then(response => {
                if (response.status === 201) {
                    setShowRegistration(false);
                }
            })
            .catch(() => {
                setMessage('User with this email is already registered!');
            });
    };

    return (
        <div className="login">
            {showRegistration ? (
                <form id="registrationForm" onSubmit={handleRegistrationSubmit}>
                    <h2>Create an Account</h2>
                    <p>Please register to continue</p>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Register</button>
                    <div className="footer-links">
                        <p id='message'>{message}</p>
                        <a href="#" onClick={() => setShowRegistration(false)}>Back to Login</a>
                    </div>
                </form>
            ) : (
                <form id="loginForm" onSubmit={handleLoginSubmit}>
                    <h2>Welcome Back</h2>
                    <p>Please log in to your account</p>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                    <div className="footer-links">
                        <p id='message'>{message}</p>
                        <a href="#" onClick={() => setShowRegistration(true)}>Create an Account</a>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Login;