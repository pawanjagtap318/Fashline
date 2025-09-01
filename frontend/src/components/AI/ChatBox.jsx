import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoSend, IoChatbubblesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from 'react-icons/io';

export default function ChatBox({ chatBoxOpen, setChatBoxOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatBoxOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatBoxOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, { prompt: input });
      const firstLine = res.data.reply.split("\n")[0];
      const [type, productId] = firstLine.split(",").map(s => s.trim());

      if (type === "redirect" && productId) {
        setChatBoxOpen(false);
        navigate(`/product/${productId}`);
        return;
      }

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
      className={`fixed top-28 right-4 w-[90%] sm:w-[26rem] md:w-[30rem] h-[32rem] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 transform transition-all duration-500 ${chatBoxOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-2xl shadow-md">
        <IoChatbubblesOutline size={22} />
        <h2 className="text-lg font-semibold mr-[276px]">Chat with AI</h2>
        <div className='my-auto'>
          <button onClick={() => setChatBoxOpen(false)}>
            <IoMdClose className='w-6 h-6' />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10 text-sm">✨ Start chatting...</p>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-md ${msg.role === "user"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none"
                : "bg-white border border-gray-200 text-gray-900 rounded-bl-none whitespace-pre-line"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm px-3">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-150">●</span>
            <span className="animate-bounce delay-300">●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-200 px-3 py-3 bg-white rounded-b-2xl">
        <input
          value={input}
          ref={inputRef}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about products..."
          className="flex-1 p-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:opacity-90 text-white rounded-xl shadow-md transition disabled:opacity-50"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}
