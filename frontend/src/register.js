// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(''); // 添加email状态
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/register', { username, password, email },{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response object:', response);
            if (response.status === 201 || response.status === 200) {
                console.log('Registration successful:', response.data);
                navigate('/login');
            } else {
                setError('Unexpected response from server');
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='form-container'>
            <h2>Register</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
