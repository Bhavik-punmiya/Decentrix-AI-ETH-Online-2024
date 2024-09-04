import React, { useEffect } from "react";
import MonacoEditor, { loader } from "@monaco-editor/react";

export default function SolidityEditor({ code, onChange, defaultValue }) {
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.languages.registerCompletionItemProvider("sol", {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = [{}];
          return { suggestions: suggestions };
        },
      });
    });
  }, []);

  return (
    <MonacoEditor
      defaultLanguage="sol"
      value={code}
      onChange={onChange}
      theme="vs-dark"
      defaultValue={defaultValue}
    />
  );
}
