import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

// Ensure you have the following CSS in your project:
// import 'monaco-editor/min/vs/editor/editor.main.css';

function registerCairoLanguageSupport() {
    const languageId = 'cairo';

    monaco.languages.register({ id: languageId });

    monaco.languages.setLanguageConfiguration(languageId, {
        comments: {
            lineComment: '#',
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
            ['%{', '%}'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '%{', close: '%}' },
            { open: "'", close: "'", notIn: ['string', 'comment'] },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '%{', close: '%}' },
            { open: "'", close: "'" },
        ],
    });

    monaco.languages.setMonarchTokensProvider(languageId, {
        defaultToken: '',
        tokenPostfix: '.cairo',
        brackets: [
            { token: 'delimiter.curly', open: '{', close: '}' },
            { token: 'delimiter.parenthesis', open: '(', close: ')' },
            { token: 'delimiter.square', open: '[', close: ']' },
            { token: 'delimiter.curly', open: '%{', close: '%}' },
        ],
        keywords: [
            'if', 'else', 'end', 'alloc_locals', 'as', 'assert', 'cast', 'const',
            'dw', 'felt', 'from', 'func', 'import', 'let', 'local', 'member',
            'nondet', 'return', 'static_assert', 'struct', 'tempvar', 'with_attr',
            'with', 'ap', 'fp', 'call', 'jmp', 'ret', 'abs', 'rel',
        ],
        operators: ['=', ':', '==', '++', '+', '-', '*', '**', '/', '&', '%', '_'],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        numberDecimal: /[+-]?[0-9]+/,
        numberHex: /[+-]?0x[0-9a-fA-F]+/,
        tokenizer: {
            root: [
                [
                    /[a-zA-Z_]\w*/,
                    {
                        cases: {
                            '@keywords': { token: 'keyword.$0' },
                            '@default': 'identifier',
                        },
                    },
                ],
                { include: '@whitespace' },
                [/^%[a-zA-Z]\w*/, 'tag'],
                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [
                    /@symbols/,
                    {
                        cases: {
                            '@operators': 'delimiter',
                            '@default': '',
                        },
                    },
                ],
                [/(@numberHex)/, 'number.hex'],
                [/(@numberDecimal)/, 'number'],
                [/'[^']*'/, 'string'],
            ],
            whitespace: [
                [/\s+/, 'white'],
                [/(^#.*$)/, 'comment'],
            ],
        },
    });

    // Add formatting provider
    monaco.languages.registerDocumentFormattingEditProvider('cairo', {
        provideDocumentFormattingEdits(model, options, token) {
            const text = model.getValue();
            const formatted = formatCairoCode(text);
            return [
                {
                    range: model.getFullModelRange(),
                    text: formatted,
                },
            ];
        },
    });

    // Define custom theme
    monaco.editor.defineTheme('cairoDarkTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '#569CD6' },
            { token: 'string', foreground: '#CE9178' },
            { token: 'comment', foreground: '#6A9955' },
            { token: 'number', foreground: '#B5CEA8' },
            { token: 'tag', foreground: '#D7BA7D' },
        ],
        colors: {
            'editor.background': '#1E1E1E',
        }
    });
}

// A simple Cairo code formatter (you should replace this with a more robust implementation)
function formatCairoCode(code) {
    let formatted = '';
    let indentLevel = 0;
    const lines = code.split('\n');

    lines.forEach(line => {
        line = line.trim();
        if (line.endsWith('{')) {
            formatted += '    '.repeat(indentLevel) + line + '\n';
            indentLevel++;
        } else if (line.startsWith('}')) {
            indentLevel = Math.max(0, indentLevel - 1);
            formatted += '    '.repeat(indentLevel) + line + '\n';
        } else {
            formatted += '    '.repeat(indentLevel) + line + '\n';
        }
    });

    return formatted;
}

export default function CairoEditor({ initialCode = '# Cairo code will appear here' }) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            registerCairoLanguageSupport();

            editorRef.current = monaco.editor.create(document.getElementById('cairo-editor-container'), {
                value: initialCode,
                language: 'cairo',
                theme: 'cairoDarkTheme',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
            });

            // Add command for formatting
            editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
                editorRef.current.getAction('editor.action.formatDocument').run();
            });
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
                editorRef.current = null;
            }
        };
    }, [initialCode]);

    return <div id="cairo-editor-container" style={{ width: '100%', height: '500px' }}></div>;
}