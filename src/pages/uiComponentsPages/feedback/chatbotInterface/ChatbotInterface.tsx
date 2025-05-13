import React, { useState } from 'react';
import styled from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Input } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const FloatingChatbotWrapper = styled.div<{ $expanded: boolean }>`
  position: fixed;
  bottom: 0px;
  right: 32px;
  z-index: 1000;
  width: 500px;
  background: #111216;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.45);
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
  height: ${({ $expanded }) => ($expanded ? '420px' : '56px')};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChatbotHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0 20px;
  height: 56px;
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid #23243a;
  font-family: 'Inter', 'Poppins', 'Roboto', Arial, sans-serif;
`;

const ChatArea = styled.div`
  flex: 1;
  background: #111216;
  padding: 18px 20px 0 20px;
  overflow-y: auto;
  color: #fff;
`;

const ChatInputWrapper = styled.div`
  padding: 12px 20px 18px 20px;
  background: #111216;
  border-top: 1px solid #23243a;
`;

const StyledInput = styled(Input)`
  background: #23243a !important;
  color: #fff !important;
  border-radius: 8px;
  border: none;
  &::placeholder {
    color: #888;
  }
`;

const ArrowButton = styled(BaseButton)`
  background: transparent;
  border: none;
  color: #fff;
  box-shadow: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #23243a;
  }
`;

const SendButton = styled(BaseButton)`
  background: black;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  padding: 0 18px;
  height: 36px;
  margin-left: 8px;
  box-shadow: none;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1d4173;
    color: #fff;
  }
`;

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
    <FloatingChatbotWrapper $expanded={expanded}>
      <ChatbotHeader onClick={() => setExpanded((prev) => !prev)} style={{ cursor: 'pointer' }}>
        Ai Chatbot
        <ArrowButton
          type="text"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          aria-label={expanded ? 'Collapse chatbot' : 'Expand chatbot'}
        >
          <span role="img" aria-label="brain">
            🧠
          </span>
        </ArrowButton>
      </ChatbotHeader>
      {expanded && (
        <>
          <ChatArea>
            {messages.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>How can I help you today?</div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '12px',
                    textAlign: message.isUser ? 'right' : 'left',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      background: '#111216',
                      color: '#fff',
                      maxWidth: '80%',
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && <div style={{ color: '#888', textAlign: 'center', marginTop: 12 }}>AI is thinking...</div>}
          </ChatArea>
          <ChatInputWrapper>
            <StyledInput
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              suffix={
                <SendButton type="primary" onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  Send
                </SendButton>
              }
            />
          </ChatInputWrapper>
        </>
      )}
    </FloatingChatbotWrapper>
  );
};

export default ChatbotInterface;
