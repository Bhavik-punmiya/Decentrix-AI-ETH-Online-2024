import React, { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '@/components/CodeBlock.jsx';  // Assuming CodeBlock is in a separate file


const Chat = ({ account, userPrompt, setUserPrompt, suggestions, loading, error, handleRunAgent, progressMessage }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (suggestions) {
            setMessages(prevMessages => [{ text: suggestions, type: 'bot' }, ...prevMessages]);
        }
    }, [suggestions]);

    const handleSend = async () => {
        if (!account.isConnected) {
            alert("Please connect wallet!");
            return;
        }
        if (input.trim()) {
            const userMessage = { text: input, type: 'user' };
            setMessages(prevMessages => [userMessage, ...prevMessages]);
            setUserPrompt(input);
            setInput('');
            await handleRunAgent(input);
        }
    };

    return (
        <div className="flex flex-col w-full mx-auto h-full p-5">
            <div className="bg-white rounded-lg shadow p-5">
                <div className="flex items-center my-2 text-lg">
                    <Input
                        className="flex-1 text-lg"
                        placeholder="Ask anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <Button color="success" onClick={handleSend} className="ml-2 text-white" disabled={loading}
                            isLoading={loading}
                    >
                        {loading ? <span>Loading...</span> : <FaPaperPlane className="text-lg" />}
                    </Button>
                </div>

                {loading && (
                    <div className="text-blue-500 mt-2">
                        {progressMessage || 'Processing your request...'}
                    </div>
                )}

                {error && (
                    <div className="text-red-500 mt-2">
                        Error: {error}
                    </div>
                )}

                <div className=" rounded-lg p-2 space-y-2 mt-4 ">
                    {
                        messages.length === 0 && (
                            <div className="text-center text-gray-400  text-2xl my-4">
                                Answers will apper here!
                            </div>
                        )
                    }
                    {
                        <div className="h-fit max-h-screen overflow-y-auto ">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded-lg mb-4  w-fit ${
                                        msg.type === 'user' ? 'bg-theme-green-light text-black self-end ml-auto' : 'bg-theme-purple-light text-black self-start'
                                    }`}
                                >

                                        <div>
                                            <ReactMarkdown
                                                className=" p-2 mb-2"
                                                remarkPlugins={[remarkGfm]}
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
                                                    a({ node, children, href, ...props }) {
                                                        return (
                                                            <a href={href} className="text-blue-500 underline" {...props}>
                                                                {children}
                                                            </a>
                                                        );
                                                    },
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Chat;