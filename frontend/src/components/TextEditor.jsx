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

function TextEditor({ code, setCode }) {
  return (
    <div className=" flex items-center justify-center">
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
          height: "90vh",
          fontSize: 14,
          backgroundColor: "#ffffff",
          fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          overflowY: "auto",
          color: "#333",
        }}
      />
    </div>
  );
}

export default TextEditor;
