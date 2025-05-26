import React, { useState } from "react";
import { Button, Input, Select, Form, message } from "antd";
import axios from "axios";
import "@app/styles/styles.css";

interface QuizAnswer {
  option: string;
  text: string;
}

interface Quiz {
  question: string;
  answers: QuizAnswer[];
  correctAnswer: string;
}

interface FormValues {
  year: string;
  subject: string;
  topic: string;
  difficulty: string;
  additionalNotes?: string;
  }

interface AutoQuestionProps {
  right?: number;
  onAccept?: (quiz: Quiz) => void;
  }

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

const AutoQuestion: React.FC<AutoQuestionProps> = ({ right = 752, onAccept }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [form] = Form.useForm<FormValues>();

  const onFinish = async (values: unknown) => {
    const formValues = values as FormValues;
    setLoading(true);
    setQuiz(null);
    try {
      const res = await axios.post<Quiz>('http://localhost:3007/ai/generate-quiz', formValues);
      setQuiz(res.data);
    } catch (err) {
      message.error('Failed to generate quiz.');
    }
    setLoading(false);
  };

  return (
    <div 
      className={`floating-auto-question ${expanded ? 'expanded' : 'collapsed'}`}
      style={{ right: `${right}px` }}
    >
      <div 
        className="auto-question-header"
        onClick={() => setExpanded((prev) => !prev)}
      >
        Automation Quiz Generator
        <Button
          type="text"
          className="arrow-button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          aria-label={expanded ? 'Collapse auto question' : 'Expand auto question'}
        >
          <span role="img" aria-label="handwritten">✍️</span>
        </Button>
      </div>
      {expanded && (
        <>
          <div className="description-text">
            <div className="main-description">Create quiz questions in just a few clicks.</div>
            <div className="sub-description">
              Enter your requirements, and let the AI generate accurate questions instantly.
            </div>
          </div>
          <div className="auto-question-area">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="auto-question-form"
            >
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
              <Form.Item name="additionalNotes" label="Additional Notes (optional)">
                <Input.TextArea placeholder="Any extra requirements? You may also specify a particular scenario" />
              </Form.Item>
              <Form.Item style={{ marginTop: 55 }}>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Generate Question
                </Button>
              </Form.Item>
            </Form>
            {quiz && (
              <div className="quiz-preview">
                <div><b>Question:</b> {quiz.question}</div>
                <ul>
                  {quiz.answers?.map((ans) => (
                    <li key={ans.option}>
                      <b>{ans.option}:</b> {ans.text}
                    </li>
                  ))}
                </ul>
                <div><b>Correct Answer:</b> {quiz.correctAnswer}</div>
                <div className="quiz-actions">
                  <Button onClick={() => setQuiz(null)}>Decline</Button>
                  <Button
                    type="primary"
                    onClick={() => {
                    if (onAccept) onAccept(quiz);
                    setQuiz(null);
                    }}
                  >
                    Accept & Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AutoQuestion;
