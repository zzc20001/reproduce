import axios from 'axios';

const API_KEY = '44744371-d64b9247d9ec11befc508b06d'; // 使用您获取的 API 密钥

async function getSingleImage(query) {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`);
    return response.data.hits[0]?.webformatURL;
  } catch (error) {
    console.error(`Error fetching image for ${query}:`, error);
    return null;
  }
}

export async function getImages(word, otherWords) {
  try {
    // 获取与目标单词相关的图片
    const correctImage = await getSingleImage(word);

    if (!correctImage) {
      console.error('No images found for the word.');
      return [];
    }

    // 从其他单词中获取错误的图片
    const incorrectImagesPromises = otherWords.map(otherWord => getSingleImage(otherWord));
    const incorrectImages = (await Promise.all(incorrectImagesPromises)).filter(Boolean).slice(0, 3);

    // 返回一个数组，其中包含一个正确图片和三个错误图片
    return [correctImage, ...incorrectImages];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}
