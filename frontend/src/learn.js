import React, { useState, useEffect, useCallback } from 'react';
import { getImages } from './api';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Learn = () => {
  const [wordData, setWordData] = useState(null); // 用于存储当前单词及其图片数据
  const [nextWordData, setNextWordData] = useState(null); // 用于预加载下一组单词及其图片数据
  const [isCorrect, setIsCorrect] = useState(null); // 用于跟踪用户选择的正确性状态
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  const fetchUnlearnedWords = useCallback(async () => {
    try {
      console.log('userId:', userId);
      const response = await axios.get(`http://localhost:5000/unlearned_words/${userId}`);
      if (response.status !== 200) {
        console.error('Error: Non-200 status code');
        return;
      }
      const words = response.data;

      const generateWordData = async () => {
        // 随机选择一个正确的单词
        const correctWordIndex = Math.floor(Math.random() * words.length);
        const correctWord = words[correctWordIndex].word;

        // 随机选择三个干扰单词
        const otherWords = words
          .filter((_, index) => index !== correctWordIndex)
          .map(word => word.word);
        const shuffledOtherWords = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);

        // 获取图片
        const images = await getImages(correctWord, shuffledOtherWords);
        console.log('Images:', images);
        const correctImage = images[0];
        const shuffledImages = images.sort(() => 0.5 - Math.random());

        return {
          word: correctWord,
          images: shuffledImages.map(url => ({
            url,
            isCorrect: url === correctImage
          }))
        };
      };

      const initialWordData = await generateWordData();
      const nextWordData = await generateWordData();
      console.log('Initial word data:', initialWordData);
      setWordData(initialWordData);
      setNextWordData(nextWordData);
    } catch (error) {
      console.error('Error fetching unlearned words:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUnlearnedWords();
    }
  }, [userId, fetchUnlearnedWords]);

  if (!wordData) return <p>Loading...</p>;

  const handleImageClick = async (isCorrect) => {
    if (isCorrect) {
      setIsCorrect(true);
  
      // 标记单词为已学过
      try {
        await axios.post('http://localhost:5000/mark_as_learned', {
          user_id: userId,
          word: wordData.word  // 使用单词的 ID 标识符来标记已学过
        });
      } catch (error) {
        console.error('Error marking word as learned:', error);
      }
  
      setTimeout(async () => {
        setIsCorrect(null);
        setWordData(nextWordData); // 显示预加载的单词数据
        const newNextWordData = await fetchUnlearnedWords(); // 预加载新的单词数据
        setNextWordData(newNextWordData);
      }, 1000); // 1秒后显示下一个单词
    } else {
      setIsCorrect(false); // 用户选择了错误的图片
    }
  };
  

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{wordData.word}</h1>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {wordData.images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt=""
            style={{ width: '120px', height: '120px', margin: '10px', cursor: 'pointer' }}
            onClick={() => handleImageClick(img.isCorrect)}
          />
        ))}
      </div>
      {isCorrect === false && <p style={{ textAlign: 'center', color: 'red' }}>Incorrect, try again!</p>}
      {isCorrect === true && <p style={{ textAlign: 'center', color: 'green' }}>Correct!</p>}
    </div>
  );
};

export default Learn;
