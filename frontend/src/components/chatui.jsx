import React, {useState, useEffect} from 'react';
import {Input, Button} from '@nextui-org/react';
import {FaPaperPlane} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'highlight.js/styles/github.css';

const CodeBlock = ({children, language}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
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

const Chat = ({account, userPrompt, setUserPrompt, suggestions, loading, error, handleRunAgent, progressMessage}) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        if (suggestions) {
            setMessages(prevMessages => [{text: suggestions, type: 'bot'}, ...prevMessages]);
        }
    }, [suggestions]);

    const handleSend = async () => {
        if(!account.isConnected) {
            return;
        }
        if (input.trim()) {
            const userMessage = {text: input, type: 'user'};
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
                            isLoading={loading} // Use isLoading to show the loading state
                    >
                        {
                            loading ? (
                                <span>Loading...</span>
                            ) : (
                                <FaPaperPlane className="text-lg"/>
                            )

                        }
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

                <div className="flex-1 h-screen overflow-y-auto rounded-lg p-2 space-y-2 mt-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg mb-4 max-w-[80%] ${
                                msg.type === 'user' ? 'bg-theme-green-light text-black self-end ml-auto' : 'bg-theme-purple-light text-black self-start'
                            }`}
                        >
                            {msg.type === 'user' ? (
                                <div className="">
                                    <pre className="whitespace-pre-wrap">{msg.text}</pre>
                                </div>
                            ) : (
                                <div>
                                    <ReactMarkdown
                                        className="whitespace-pre-wrap p-2 mb-2"
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{
                                            code({node, inline, className, children, ...props}) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <CodeBlock
                                                        language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            a({node, children, href, ...props}) {
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
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chat;