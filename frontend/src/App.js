import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Main from './main';
import Learn from './learn';
import './App.css';

function App() {
    // 获取当前路径
    const location = useLocation();
    return (
        <div className="background">
            <h1>Flashcards</h1>
            {/* 仅在根路径显示导航 */}
            {location.pathname === '/' && (
                <nav>
                    <ul>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </ul>
                </nav>
            )}
            <Routes>
                <Route path="/main" element={<Main  />} />
                <Route path="/learn" element={<Learn  />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} /> {/* 假设你有一个Home组件 */}
            </Routes>
        </div>
    );
}

function Home() {
    return <h2>Welcome to Flashcards!</h2>;
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
