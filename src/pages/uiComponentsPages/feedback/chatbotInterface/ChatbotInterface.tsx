import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import '@app/styles/styles.css';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatbotInterface: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: Message = { text: inputMessage, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3007/ai/simple-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.text();
      // Add AI response to chat
      const aiMessage: Message = { text: data, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to get response from AI');
      // Add error message to chat
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`floating-chatbot ${expanded ? 'expanded' : 'collapsed'}`}>
      <div 
        className="chatbot-header"
        onClick={() => setExpanded((prev) => !prev)}
      >
        Ai Chatbot
        <Button
          type="text"
          className="arrow-button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          aria-label={expanded ? 'Collapse chatbot' : 'Expand chatbot'}
        >
          <span role="img" aria-label="brain">🧠</span>
        </Button>
      </div>
      {expanded && (
        <>
          <div className="chat-area">
            {messages.length === 0 ? (
              <div className="chat-welcome-message">How can I help you today?</div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.isUser ? 'user' : 'bot'}`}
                >
                  <div className="chat-message-content">
                    {message.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && <div className="chat-loading-message">AI is thinking...</div>}
          </div>
          <div className="chat-input-wrapper">
            <Input
              className="chatbot-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              suffix={
                <Button
                  type="primary"
                  className="chatbot-send-button"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  Send
                </Button>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotInterface;
