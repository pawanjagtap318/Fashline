import axios from "axios";

export const sendPrompt = async (prompt) => {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, { prompt });
  return res.data.reply;
};
