"use client";
import React, { useState } from 'react';
import TextEditor from '@/components/TextEditor'; // Ensure this path is correct
import axios from 'axios';

export default function Editor() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const compileCode = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', new Blob([code], { type: 'text/plain' }), 'Contract.sol');
  
      // Send the file using FormData
      const response = await axios.post('http://localhost:8080/api/compile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      console.log(response.data);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  const renderResult = () => {
    if (!result) {
      return <div>No results yet. Write some code and hit "Compile"!</div>;
    }

    if (result.errors && result.errors.length > 0) {
      // Extract the first error message
      const error = result.errors[0];
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <h3 className="font-bold">Compilation Error:</h3>
          <p>{error.message}</p>
        </div>
      );
    }

    if (result.status === 'success') {
      // Render compilation success result
      return (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
          <h3 className="font-bold">Compilation Successful!</h3>
          <h4>Bytecode:</h4>
          <pre>{result.bytecode}</pre>
          <h4>ABI:</h4>
          <pre>{JSON.stringify(result.abi, null, 2)}</pre>
        </div>
      );
    }

    // Fallback for unexpected cases
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded">
        Unexpected result format.
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Welcome to Solidity Editor</h2>
        <TextEditor code={code} setCode={setCode} />
        <button 
          onClick={compileCode} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Compile
        </button>
      </div>
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Compile results will appear here:</h2>
        {renderResult()}
      </div>
    </div>
  );
}