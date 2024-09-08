"use client";
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

// Ensure you have the following CSS in your project:
// import 'monaco-editor/min/vs/editor/editor.main.css';

function registerCairoLanguageSupport() {
    const languageId = 'cairo';

    monaco.languages.register({ id: languageId });

    monaco.languages.setLanguageConfiguration(languageId, {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/'],
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
            ['<', '>'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '<', close: '>' },
            { open: "'", close: "'", notIn: ['string', 'comment'] },
            { open: '"', close: '"', notIn: ['string'] },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '<', close: '>' },
            { open: "'", close: "'" },
            { open: '"', close: '"' },
        ],
    });

    monaco.languages.setMonarchTokensProvider(languageId, {
        defaultToken: '',
        tokenPostfix: '.cairo',
        brackets: [
            { token: 'delimiter.curly', open: '{', close: '}' },
            { token: 'delimiter.parenthesis', open: '(', close: ')' },
            { token: 'delimiter.square', open: '[', close: ']' },
            { token: 'delimiter.angle', open: '<', close: '>' },
        ],
        keywords: [
            'use', 'mod', 'fn', 'struct', 'enum', 'trait', 'impl', 'self', 'pub',
            'let', 'mut', 'ref', 'const', 'static', 'if', 'else', 'match', 'for',
            'while', 'loop', 'return', 'break', 'continue', 'in', 'extern', 'crate',
            'super', 'where', 'move', 'unsafe', 'as', 'type', 'dyn', 'async', 'await',
            'try', 'use', 'mod', 'pub', 'impl', 'trait', 'contract', 'storage',
            'constructor', 'event', 'abi'
        ],
        typeKeywords: [
            'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'usize', 'i8', 'i16', 'i32',
            'i64', 'i128', 'isize', 'f32', 'f64', 'bool', 'char', 'str', 'ContractAddress'
        ],
        operators: [
            '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
            '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
            '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
            '%=', '<<=', '>>=', '>>>='
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer: {
            root: [
                [/[a-z_$][\w$]*/, {
                    cases: {
                        '@typeKeywords': 'keyword.type',
                        '@keywords': 'keyword',
                        '@default': 'identifier'
                    }
                }],
                [/[A-Z][\w$]*/, 'type.identifier'],
                { include: '@whitespace' },
                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],
                [/[;,.]/, 'delimiter'],
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                [/'[^\\']'/, 'string'],
                [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                [/'/, 'string.invalid']
            ],
            comment: [
                [/[^\/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'],
                ["\\*/", 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],
            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],
            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    });

    // Add formatting provider (you may want to implement a more sophisticated formatter)
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
            { token: 'keyword.type', foreground: '#4EC9B0' },
            { token: 'string', foreground: '#CE9178' },
            { token: 'comment', foreground: '#6A9955' },
            { token: 'number', foreground: '#B5CEA8' },
            { token: 'operator', foreground: '#D4D4D4' },
            { token: 'type.identifier', foreground: '#4EC9B0' },
            { token: 'identifier', foreground: '#9CDCFE' },
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
        if (line.endsWith('{') || line.endsWith('(')) {
            formatted += '    '.repeat(indentLevel) + line + '\n';
            indentLevel++;
        } else if (line.startsWith('}') || line.startsWith(')')) {
            indentLevel = Math.max(0, indentLevel - 1);
            formatted += '    '.repeat(indentLevel) + line + '\n';
        } else {
            formatted += '    '.repeat(indentLevel) + line + '\n';
        }
    });

    return formatted;
}

export default function CairoEditor({code, onChange , defaultValue}) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            registerCairoLanguageSupport();

            editorRef.current = monaco.editor.create(document.getElementById('cairo-editor-container'), {
                value: code ,
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
    }, [code]); // Add defaultValue to the dependency array

    return <div id="cairo-editor-container" style={{ width: '100%', height: '500px' }}></div>;
}