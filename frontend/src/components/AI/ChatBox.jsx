import { useState } from "react";
import axios from "axios";
import { IoSend, IoChatbubblesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ChatBox({ chatBoxOpen, setChatBoxOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:9000/api/chat", { prompt: input });
      const firstLine = res.data.reply.split("\n")[0]; // Take only the first line
      const [type, productId] = firstLine.split(",").map(s => s.trim());

      // If backend sends redirect instruction
      if (type === "redirect" && productId) {
        setChatBoxOpen(false);
        navigate(`/product/${productId}`);
        return;
      }

      // Otherwise just display bot message
      const botMessage = { role: "bot", text: res.data.message || res.data.reply || "No response from AI." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error: Could not connect to assistant." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-28 right-0 w-[22rem] sm:w-[26rem] md:w-[30rem] h-[32rem] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 transition-transform duration-300 ${chatBoxOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-t-2xl shadow-md">
        <IoChatbubblesOutline size={22} />
        <h2 className="text-lg font-semibold">Chat with AI</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">Start chatting...</p>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow ${msg.role === "user"
                ? "bg-sky-500 text-white rounded-br-none"
                : "bg-gray-200 text-gray-900 rounded-bl-none whitespace-pre-line"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-center text-sm">AI is typing...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-200 px-3 py-2 bg-white rounded-b-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about products..."
          className="flex-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-md transition disabled:opacity-50"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}
