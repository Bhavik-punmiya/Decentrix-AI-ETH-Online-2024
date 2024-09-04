"use client";
import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import dark theme
import 'highlight.js/styles/github.css'; // Syntax highlighting theme

const CodeBlock = ({ children, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
    });
  };

  return (
    <div className="relative">
      <button
        className="absolute right-2 top-2 text-sm bg-gray-800 text-white py-1 px-2 rounded"
        onClick={handleCopy}
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter language={language} style={atomDark}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, type: 'user' };

      // Hardcoded AI response with a larger message in Markdown format
      const botMessage = {
        text: `Hello! I'm an AI chatbot. Here’s a code snippet for you:\n\n\`\`\`javascript\nconst greet = (name) => {\n  return \`Hello, \${name}!\`;\n};\n\nconsole.log(greet('World'));\n\`\`\``,
        type: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col p-4 w-[35%] mx-auto h-[90vh] bg-transparent shadow-lg rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg mb-4 max-w-[80%] ${
              msg.type === 'user' ? 'bg-[rgb(247,247,245)] text-black self-end ml-auto' : 'bg-[#e4e0d0] text-black self-start'
            }`}
          >
            {/* Render user messages as plain text */}
            {msg.type === 'user' ? (
              <div>
                <pre className="whitespace-pre-wrap">{msg.text}</pre>
              </div>
            ) : (
              <div>
                <ReactMarkdown
                  className="whitespace-pre-wrap p-2 mb-2"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            )}
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
