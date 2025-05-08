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
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.45);
  transition: height 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s;
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

const ChatbotInterface: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <FloatingChatbotWrapper $expanded={expanded}>
      <ChatbotHeader>
        Ai Chatbot
        <ArrowButton
          type="text"
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? 'Collapse chatbot' : 'Expand chatbot'}
        >
          {expanded ? <DownOutlined /> : <UpOutlined />}
        </ArrowButton>
      </ChatbotHeader>
      {expanded && (
        <>
          <ChatArea>
            {/* Chat messages will go here */}
            <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
              How can I help you today?
            </div>
          </ChatArea>
          <ChatInputWrapper>
            <StyledInput
              placeholder="Ask anything"
              suffix={<SendButton type="primary">Send</SendButton>}
            />
          </ChatInputWrapper>
        </>
      )}
    </FloatingChatbotWrapper>
  );
};

export default ChatbotInterface; 