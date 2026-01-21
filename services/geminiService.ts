import { GoogleGenAI } from "@google/genai";
import { GameStats } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSimulationResults = async (stats: GameStats) => {
  const ai = getClient();
  if (!ai) return "Vui lòng cấu hình API Key để sử dụng tính năng phân tích AI.";

  const greenSurvivalRate = ((stats.totalGreen - stats.caughtGreen) / stats.totalGreen * 100).toFixed(1);
  const otherSurvivalRate = ((stats.totalOthers - stats.caughtOthers) / stats.totalOthers * 100).toFixed(1);

  const prompt = `
    Bạn là một giáo viên sinh học đang giải thích về cơ chế Chọn lọc Tự nhiên và Ngụy trang (Camouflage).
    Học sinh vừa chơi một trò chơi mô phỏng với kết quả sau:

    - Số lượng quần thể sâu xanh (ngụy trang trên lá): ${stats.totalGreen} con. Bị bắt: ${stats.caughtGreen}. Tỷ lệ sống sót: ${greenSurvivalRate}%.
    - Số lượng quần thể sâu màu nổi bật (đỏ/vàng): ${stats.totalOthers} con. Bị bắt: ${stats.caughtOthers}. Tỷ lệ sống sót: ${otherSurvivalRate}%.
    - Tổng số lượt chơi giả lập (số người tham gia): ${stats.roundsPlayed}.

    Hãy đưa ra một lời giải thích ngắn gọn, súc tích (khoảng 3-4 câu) cho học sinh về tại sao kết quả lại như vậy. 
    Nhấn mạnh vào việc màu sắc ảnh hưởng đến khả năng sinh tồn như thế nào trước kẻ săn mồi. 
    Sử dụng giọng văn khuyến khích và khoa học.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Không thể kết nối với giáo sư AI lúc này. Hãy thử lại sau.";
  }
};