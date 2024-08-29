"use client";
import React from "react";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

function TextEditor() {
  const [code, setCode] = React.useState(
   ''
  );

  return (
    <div className="h-full flex items-center justify-center overflow-auto">
      <CodeEditor
        value={code}
        language="sol"
        placeholder="Please enter Solidity code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        rehypePlugins={[
          [rehypePrism, { ignoreMissing: true }],
          [
            rehypeRewrite,
            {
              rewrite: (node, index, parent) => {
                if (node.properties?.className?.includes("code-line")) {
                  if (index === 0 && node.properties?.className) {
                    node.properties.className.push("demo01");
                    // console.log("~~~", index, node.properties?.className);
                  }
                }
                if (node.type === "text" && node.value === "return" && parent.children.length === 1) {
                  parent.properties.className.push("demo123");
                }
              }
            }
          ]
        ]}
        style={{
          width: "100%",
          height: "90vh", // Keep the height to make the editor taller
          fontSize: 14,
          backgroundColor: "#ffffff",
          fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          overflowY: "auto", 
        }}
      />
    </div>
  );
}

export default TextEditor;
