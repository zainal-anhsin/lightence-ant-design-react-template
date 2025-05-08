import React, { useState } from "react";
import styled from "styled-components";
import { BaseButton } from "@app/components/common/BaseButton/BaseButton";
import { Input, Select, Form, message } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const FloatingAutoQuestionWrapper = styled.div<{ $expanded: boolean; $right?: number }>`
  position: fixed;
  bottom: 0px;
  right: ${({ $right }) => ($right !== undefined ? `${$right}px` : '32px')};
  z-index: 1000;
  width: 500px;
  background: #111216;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.45);
  transition: height 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s;
  height: ${({ $expanded }) => ($expanded ? '700px' : '56px')};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: ${({ $expanded }) => ($expanded ? 'default' : 'pointer')};
`;

const AutoQuestionHeader = styled.div`
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

const AutoQuestionArea = styled.div`
  flex: 1;
  background: #111216;
  padding: 18px 20px 0 20px;
  overflow-y: auto;
  color: #fff;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: #fff;
  }
  .ant-input, .ant-select-selector, .ant-input-textarea {
    background: #23243a !important;
    color: #fff !important;
    border-radius: 8px;
    border: none;
  }
  .ant-input::placeholder, .ant-select-selection-placeholder, .ant-input-textarea::placeholder {
    color: #888 !important;
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

const yearOptions = [
  { label: "Year 4", value: "year 4" },
  { label: "Year 5", value: "year 5" },
  { label: "Year 6", value: "year 6" },
];

const subjectOptions = [
  { label: "English", value: "english" },
  { label: "Bahasa Melayu", value: "Bahasa Melayu" },
];

const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Normal", value: "normal" },
  { label: "Hard", value: "hard" },
];

interface AutoQuestionProps {
  right?: number;
  onAccept?: (quiz: any) => void;
}
const AutoQuestion: React.FC<AutoQuestionProps> = ({ right = 752, onAccept }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    setQuiz(null);
    try {
      const res = await axios.post("http://localhost:3007/ai/generate-quiz", values);
      setQuiz(res.data);
    } catch (err) {
      message.error("Failed to generate quiz.");
    }
    setLoading(false);
  };

  return (
    <FloatingAutoQuestionWrapper
      $expanded={expanded}
      $right={right}
    >
      <AutoQuestionHeader
        onClick={() => setExpanded((prev) => !prev)}
        style={{ cursor: 'pointer' }}
      >
        Auto Generate Question
        <ArrowButton
          type="text"
          onClick={e => { e.stopPropagation(); setExpanded((prev) => !prev); }}
          aria-label={expanded ? 'Collapse auto question' : 'Expand auto question'}
        >
          <span role="img" aria-label="handwritten">✍️</span>
        </ArrowButton>
      </AutoQuestionHeader>
      {expanded && (
        <AutoQuestionArea>
          <StyledForm layout="vertical" onFinish={onFinish}>
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <Select options={yearOptions} placeholder="Select year" />
            </Form.Item>
            <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
              <Select options={subjectOptions} placeholder="Select subject" />
            </Form.Item>
            <Form.Item name="topic" label="Topic" rules={[{ required: true }]}>
              <Input placeholder="Enter topic" />
            </Form.Item>
            <Form.Item name="difficulty" label="Difficulty" rules={[{ required: true }]}>
              <Select options={difficultyOptions} placeholder="Select difficulty" />
            </Form.Item>
            <Form.Item name="additionalNotes" label="Additional Notes (optional)" >
              <Input.TextArea placeholder="Any extra requirements? You may also specify a particular scenario" />
            </Form.Item>
            <Form.Item style={{ marginTop: 55 }}>
              <BaseButton type="primary" htmlType="submit" loading={loading} block>
                Generate Question
              </BaseButton>
            </Form.Item>
          </StyledForm>
          {quiz && (
            <div style={{ marginTop: 16, background: "#23243a", borderRadius: 8, padding: 16 }}>
              <div><b>Question:</b> {quiz.question}</div>
              <ul>
                {quiz.answers?.map((ans: any) => (
                  <li key={ans.option}>
                    <b>{ans.option}:</b> {ans.text}
                  </li>
                ))}
              </ul>
              <div><b>Correct Answer:</b> {quiz.correctAnswer}</div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <BaseButton onClick={() => setQuiz(null)}>
                  Decline
                </BaseButton>
                <BaseButton type="primary" onClick={() => {
                  if (onAccept) onAccept(quiz);
                  setQuiz(null);
                }}>
                  Accept & Apply
                </BaseButton>
              </div>
            </div>
          )}
        </AutoQuestionArea>
      )}
    </FloatingAutoQuestionWrapper>
  );
};

export default AutoQuestion;
