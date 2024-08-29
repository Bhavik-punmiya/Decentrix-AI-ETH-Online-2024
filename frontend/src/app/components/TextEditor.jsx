import React, { useEffect, useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';

const MonacoEditorComponent = ({ code, setCode }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.languages.register({ id: 'solidity' });
      monaco.languages.setMonarchTokensProvider('solidity', {
        keywords: [
          'pragma', 'solidity', 'contract', 'function', 'public', 'private', 
          'internal', 'external', 'pure', 'view', 'payable', 'storage', 
          'memory', 'calldata', 'var', 'bool', 'int', 'uint', 'fixed', 'ufixed', 
          'bytes', 'string', 'address', 'mapping', 'struct', 'enum', 'return', 
          'returns', 'event', 'indexed', 'using', 'library', 'modifier', 
          'assembly', 'constant', 'constructor'
        ],
        operators: [
          '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
          '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
          '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
          '%=', '<<=', '>>=', '>>>='
        ],
        symbols:  /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword',
                                         '@default': 'identifier' } }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, { cases: { '@operators': 'operator',
                                    '@default'  : '' } }],
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
          ],
          string: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
          ],
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
          comment: [
            [/[^\/*]+/, 'comment' ],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
          ],
        },
      });
    });
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  return (
    <Editor
      height="90vh"
      defaultLanguage="solidity"
      value={code}
      onChange={(value) => setCode(value)}
      onMount={handleEditorDidMount}
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
      }}
    />
  );
};

export default MonacoEditorComponent;