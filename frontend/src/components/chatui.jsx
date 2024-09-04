"use client";
import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, type: 'user' };
      const botMessage = { text: "This is a hardcoded response.", type: 'bot' };

      setMessages([...messages, userMessage, botMessage]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col p-4 w-1/2 mx-auto h-[90vh] bg-white shadow-lg rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded-lg max-w-[80%] ${msg.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <Input
          className="flex-1"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleSend} className="ml-2" icon={<FaPaperPlane />}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;