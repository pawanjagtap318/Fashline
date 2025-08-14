import axios from "axios";

export const sendPrompt = async (prompt) => {
  const res = await axios.post("http://localhost:9000/api/chat", { prompt });
  return res.data.reply;
};
