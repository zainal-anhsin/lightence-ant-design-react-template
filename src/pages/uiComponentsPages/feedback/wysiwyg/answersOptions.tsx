import React, { useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface Answer {
  label: string;
  value: string;
  image?: string;
  audio?: string;
}

interface AnswersOptionsProps {
  answers: Answer[];
  correct: string;
  onAnswerChange: (idx: number, value: string) => void;
  onSetCorrect: (label: string) => void;
  onDeleteAnswer: (idx: number) => void;
  onAddAnswer: () => void;
  onAnswerMediaChange: (idx: number, media: Partial<Answer>) => void;
}

const AnswersOptions: React.FC<AnswersOptionsProps> = ({
  answers,
  correct,
  onAnswerChange,
  onSetCorrect,
  onDeleteAnswer,
  onAddAnswer,
  onAnswerMediaChange,
}) => {
  const { t } = useTranslation();
  const imageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const audioInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileUpload = (file: File, idx: number, type: 'image' | 'audio') => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onAnswerMediaChange(idx, { [type]: reader.result });
      }
    };
    reader.readAsDataURL(file); // This converts the file to base64
  };

  const triggerFileInput = (idx: number, type: 'image' | 'audio') => {
    const refs = type === 'image' ? imageInputRefs : audioInputRefs;
    if (refs.current[idx]) {
      refs.current[idx]!.value = '';
      refs.current[idx]!.click();
    }
  };

  return (
    <Form.Item label={<span style={{ color: '#3fa9f5', fontWeight: 600, fontSize: 18 }}>Edit Answers & Options</span>} style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {answers.map((ans, idx) => {
          const isCorrect = correct === ans.label;
          return (
            <div
              key={ans.label}
              className={`answer-option ${isCorrect ? 'correct' : ''}`}
            >
              <span className={`answer-label ${isCorrect ? 'correct' : ''}`}>
                {ans.label}
              </span>
              <Input
                className="answer-input"
                value={ans.value}
                onChange={(e) => onAnswerChange(idx, e.target.value)}
                placeholder={`Option ${ans.label}`}
              />
              <input
                type="file"
                accept="audio/*"
                ref={el => audioInputRefs.current[idx] = el}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, idx, 'audio');
                }}
              />
              <input
                type="file"
                accept="image/*"
                ref={el => imageInputRefs.current[idx] = el}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, idx, 'image');
                }}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => triggerFileInput(idx, 'audio')}
                className="media-upload-button"
              >
                Audio
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => triggerFileInput(idx, 'image')}
                className="media-upload-button"
              >
                Image
              </Button>
              <Button
                type={isCorrect ? 'primary' : 'default'}
                className={`correct-button ${isCorrect ? 'correct' : ''}`}
                onClick={() => onSetCorrect(ans.label)}
                icon={isCorrect ? <CheckOutlined /> : undefined}
              >
                {isCorrect ? 'Correct' : 'Set as Correct'}
              </Button>
              <Button
                type="text"
                danger
                icon={<CloseOutlined />}
                onClick={() => onDeleteAnswer(idx)}
                disabled={answers.length <= 2}
                className="delete-button"
              />
            </div>
          );
        })}
        <div className="add-answer-row">
          <p className="instruction-text">
            *Click the button to mark the correct answer and click the X button to remove it*
          </p>
          <Button
            style={{ transform: 'translateX(-65px)' }}
            type="dashed"
            className="add-answer-button"
            onClick={onAddAnswer}
          >
            + Add Answer
          </Button>
        </div>
      </div>
    </Form.Item>
  );
};

export default AnswersOptions;
