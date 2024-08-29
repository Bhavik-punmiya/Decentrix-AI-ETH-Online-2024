"use client"
import React, { useState } from 'react';
import TextEditor from '../components/TextEditor'; // Ensure this path is correct
import axios from 'axios';

export default function Editor() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const compileCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/compile', { code : JSON.stringify(code) });
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4 bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to Solidity Editor</h1>
        <p className="mt-4">Compile results will appear here:</p>
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          {result ? (
            result.error ? (
              <pre className="text-red-600">{result.error}</pre>
            ) : (
              <pre>{result}</pre>
            )
          ) : (
            <p>No results yet. Write some code and hit "Compile"!</p>
          )}
        </div>
      </div>

      <div className="w-1/2 mt-20 p-4 bg-transparent">
        <button
          onClick={compileCode}
          className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600"
        >
          Compile
        </button>
        <TextEditor code={code} setCode={setCode} />
      </div>
    </div>
  );
}
