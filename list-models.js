import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAPmBnWyHR0JC3k152n0CLrNmpYm6B6F5Y";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
        console.error("❌ API 錯誤:", data.error.message);
        return;
    }

    console.log("=== 📜 您可使用的模型列表 ===");
    data.models.forEach(m => {
      console.log(`- 名稱: ${m.name}`);
      console.log(`  支援功能: ${m.supportedGenerationMethods.join(", ")}`);
    });
  } catch (e) {
    console.error("❌ 無法列出模型:", e.message);
  }
}

listModels();