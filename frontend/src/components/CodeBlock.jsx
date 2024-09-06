import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import Prism from 'prismjs';
import 'prismjs/components/prism-solidity';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-rust';

// Define Solidity language for Prism (if not already defined by the Prism plugin)
if (!Prism.languages.solidity) {
    Prism.languages.solidity = Prism.languages.extend('clike', {
        keyword: /\b(?:contract|library|interface|is|function|constructor|event|modifier|using|struct|enum|mapping|address|string|uint|int|bool|bytes|public|private|external|internal|payable|view|pure|virtual|override|returns)\b/,
        operator: /=>|->|:=|=:|\*\*|\+\+|--|\|\||&&|<<=?|>>=?|[-+*/%&|^!=<>]=?|[~?]/,
        number: /\b0x[\da-f]+\b|\b\d+\.?\d*(?:e[+-]?\d+)?/i,
    });
}

const CodeBlock = ({ children, language }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    // Normalize language identifier
    const normalizedLanguage = language === 'ts' ? 'typescript' : (language || 'javascript');

    return (
        <Highlight
            theme={themes.nightOwl}  // You can change this to any theme you prefer
            code={children}
            language={normalizedLanguage}
            prism={Prism}  // Pass the extended Prism object
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={`${className} relative overflow-auto p-4 rounded-md`} style={style}>
                    <button
                        className="absolute right-2 top-2 text-sm bg-gray-700 text-white py-1 px-2 rounded hover:bg-gray-600 transition-colors"
                        onClick={handleCopy}
                    >
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })} className="table-row">
                            <span className="table-cell text-right pr-4 select-none opacity-50">{i + 1}</span>
                            <span className="table-cell">
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                ))}
                            </span>
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};

export default CodeBlock;