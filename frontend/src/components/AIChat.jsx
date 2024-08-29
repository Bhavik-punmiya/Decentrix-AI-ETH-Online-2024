"use client"

import React, { useState } from 'react';
import { Input, Button, Card, Text, Spacer } from '@nextui-org/react';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: 'user' },
      ]);
      setInput('');

      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'This is a response from AI.', sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  return (
    <Card css={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card.Body css={{ overflowY: 'auto', height: '100%' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <Text
              css={{
                color: msg.sender === 'user' ? '$blue600' : '$gray800',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '$blue200' : '$gray200',
                borderRadius: '10px',
                padding: '10px',
                maxWidth: '70%',
              }}
            >
              {msg.text}
            </Text>
          </div>
        ))}
      </Card.Body>
      <Card.Footer>
        <form onSubmit={handleSend} style={{ display: 'flex', width: '100%' }}>
          <Input
            clearable
            underlined
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            css={{ flex: 1 }}
          />
          <Spacer x={0.5} />
          <Button type="submit" auto>
            Send
          </Button>
        </form>
      </Card.Footer>
    </Card>
  );
};

export default AIChat;