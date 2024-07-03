import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './main.css';
import { useNavigate,useLocation } from 'react-router-dom';
import BackgroundImage from './assets/Background_4.jpg';  // 导入本地图片

const Main = () => {
  const [stats, setStats] = useState({ learned: 0, notLearned: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  useEffect(() => {
    axios.get(`http://localhost:5000/words/${userId}`)
      .then(response => {
        setStats(response.data);
        console.log("Stats:", response.data)
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, [userId]);

  return (
    <div className="home">
      <header className="home-header">
        <h1>百词斩</h1>
        <nav>
          <ul>
            <li><a href="/main">Main</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </nav>
      </header>
      <main className="home-main">
        <div className="stats">
          <h2>统计信息</h2>
          <p>已背单词数量: {stats.learned}</p>
          <p>未背单词数量: {stats.not_learned}</p>
          <button onClick={() => navigate(`/learn?userId=${userId}`)}>开始背单词</button>
        </div>
        <div className="card">
          <img src={BackgroundImage} alt="Example" />
          <h2>Example Word</h2>
          <p>This is an example sentence using the word.</p>
        </div>
        <div className="card">
          <img src={BackgroundImage} alt="Example" />
          <h2>Example Word</h2>
          <p>This is an example sentence using the word.</p>
        </div>
        {/* 添加更多卡片 */}
      </main>
    </div>
  );
};

export default Main;
