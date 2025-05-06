/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles';
import { media } from '@app/styles/themes/constants';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import WysiwygEditor from './wysiwyg/WysiwygEditor';

type Size = 'default' | 'large' | 'small';

const FormItem = styled(BaseForm.Item)`
  @media only screen and ${media.xs} {
    max-width: fit-content;
  }

  @media only screen and ${media.md} {
    max-width: 100%;
  }
`;

const QuizSectionWrapper = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 32px;
`;

const SectionWithTitle = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 320px;
  margin-right: 32px;
`;

const SectionTitle = styled.h3`
  color: #e0e0e0;
  font-weight: 500;
  margin-bottom: 18px;
  margin-left: 8px;
`;

const SectionBox = styled.div`
  border-radius: 8px;
  padding: 24px;
  background: #23243a;
  color: #f3f3f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  min-height: 100px;
`;

const QuizPreview = styled.div`
  flex: 1;
  min-width: 320px;
  border-radius: 8px;
  padding: 24px;
  background: #23243a;
  color: #f3f3f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const QuizContent = styled.div`
  flex: 1;
  min-width: 320px;
`;

const AnswerOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const SetCorrectButton = styled.button<{
  selected: boolean;
}>`
  margin-left: 12px;
  background: ${({ selected }) => (selected ? '#1890ff' : '#23243a')};
  color: ${({ selected }) => (selected ? '#fff' : '#b6eaff')};
  border: 1px solid #1890ff;
  border-radius: 4px;
  padding: 2px 10px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1890ff;
    color: #fff;
  }
`;

const RichContentPreview = styled.div`
  h1, h2 {
    color: #f3f3f3;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  p {
    color: #f3f3f3;
    margin-bottom: 0.75em;
  }
  ul, ol {
    margin-left: 1.5em;
    color: #f3f3f3;
  }
  strong { font-weight: bold; }
  em { font-style: italic; }
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-left { text-align: left; }
  img {
    display: block;
    margin: 16px auto;
    max-width: 380px;
    max-height: 320px;
    width: auto;
    height: auto;
    border-radius: 10px;
    object-fit: contain;
    box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  }
`;

const SkeletonsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.skeleton')}</PageTitle>
      <QuizSection />
    </>
  );
};

const QuizSection: React.FC = () => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('Choose the correct answer.');
  const [answers, setAnswers] = useState([
    { label: 'A', value: '' },
    { label: 'B', value: '' },
    { label: 'C', value: '' },
    { label: 'D', value: '' },
  ]);
  const [correct, setCorrect] = useState('A');

  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? { ...a, value } : a)));
  };

  const handleAddAnswer = () => {
    const newLabel = String.fromCharCode(65 + answers.length); // Convert number to letter (A, B, C, etc.)
    setAnswers([...answers, { label: newLabel, value: '' }]);
  };

  const handleDeleteAnswer = (indexToDelete: number) => {
    if (answers.length <= 2) return; // Prevent deletion if only 2 options remain

    // Remove the answer at the specified index
    const newAnswers = answers.filter((_, index) => index !== indexToDelete);
    
    // Update labels to be sequential
    const updatedAnswers = newAnswers.map((answer, index) => ({
      ...answer,
      label: String.fromCharCode(65 + index) // A, B, C, etc.
    }));

    setAnswers(updatedAnswers);

    // If the deleted answer was the correct one, set the first answer as correct
    if (correct === answers[indexToDelete].label) {
      setCorrect(updatedAnswers[0].label);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving quiz:', { question, answers, correct });
  };

  const handleReset = () => {
    setQuestion('Pilih jawapan yang betul.');
    setAnswers([
      { label: 'A', value: '' },
      { label: 'B', value: '' },
      { label: 'C', value: '' },
      { label: 'D', value: '' },
    ]);
    setCorrect('A');
  };

  return (
    <QuizSectionWrapper>
      {/* --- Preview Section (left) --- */}
      <SectionWithTitle style={{ marginRight: 32 }}>
        <SectionTitle>Preview</SectionTitle>
        <SectionBox>
          {/* Render the WYSIWYG HTML using styled RichContentPreview */}
          {question && (
            <RichContentPreview
              style={{ marginBottom: 16 }}
              dangerouslySetInnerHTML={{ __html: question }}
            />
          )}
          {/* Render answer options, highlight the correct one */}
          <div>
            {answers.map((ans, idx) => (
              <div key={ans.label} style={{
                display: 'flex', alignItems: 'center', marginBottom: 8,
                background: correct === ans.label ? '#2a3b4d' : undefined,
                borderRadius: 4, padding: correct === ans.label ? '2px 8px' : undefined,
                color: correct === ans.label ? '#b6eaff' : '#b0b0b0',
                fontWeight: correct === ans.label ? 600 : 400,
                opacity: ans.value ? 1 : 0.7
              }}>
                <span style={{ fontWeight: 'bold', width: 20 }}>{ans.label}</span>
                <span style={{ marginLeft: 8 }}>{ans.value || <span style={{ color: '#555' }}>Option {ans.label}</span>}</span>
                {correct === ans.label && (
                  <CheckOutlined style={{ color: '#52c41a', marginLeft: 8, fontSize: 18 }} />
                )}
              </div>
            ))}
          </div>
        </SectionBox>
      </SectionWithTitle>
      {/* --- Content Section (right) --- */}
      <SectionWithTitle style={{ marginRight: 0 }}>
        <SectionTitle>Content</SectionTitle>
        <SectionBox>
          <BaseForm layout="vertical">
            {/* --- WYSIWYG Editor for question/content --- */}
            <BaseForm.Item label="Question/Content">
              {/* This is the main rich text editor for the question */}
              <WysiwygEditor value={question} onChange={setQuestion} />
            </BaseForm.Item>
            {/* --- Editable answer options --- */}
            <BaseForm.Item label="Edit Answers & Options">
              {answers.map((ans, idx) => (
                <AnswerOption key={ans.label}>
                  <span style={{ width: 20, display: 'inline-block', color: '#b6eaff', fontWeight: correct === ans.label ? 600 : 400 }}>{ans.label}</span>
                  {/* Input for answer text */}
                  <BaseInput
                    value={ans.value}
                    onChange={(e: any) => handleAnswerChange(idx, e.target.value)}
                    placeholder={`Option ${ans.label}`}
                    style={{ flex: 1, marginLeft: 8 }}
                  />
                  {/* Button to set this answer as correct */}
                  <SetCorrectButton
                    type="button"
                    selected={correct === ans.label}
                    onClick={() => setCorrect(ans.label)}
                    aria-label={`Set ${ans.label} as correct answer`}
                  >
                    {correct === ans.label && <CheckOutlined style={{ marginRight: 4 }} />}
                    {correct === ans.label ? 'Correct' : 'Set as Correct'}
                  </SetCorrectButton>
                  {/* Delete button */}
                  <BaseButton
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleDeleteAnswer(idx)}
                    disabled={answers.length <= 2}
                    style={{ marginLeft: 8 }}
                    aria-label={`Delete option ${ans.label}`}
                  />
                </AnswerOption>
              ))}
              <div style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
                Click the button to mark the correct answer.
              </div>
              {/* Add button to add more answers */}
              <div style={{ marginTop: '16px' }}>
                <BaseButton type="dashed" onClick={handleAddAnswer} block>
                  {t('Add Option')}
                </BaseButton>
              </div>
            </BaseForm.Item>
            {/* Add Save and Reset buttons */}
            <BaseForm.Item>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <BaseButton type="primary" onClick={handleSave}>
                  {t('common.save')}
                </BaseButton>
                <BaseButton type="ghost" onClick={handleReset}>
                  {t('Reset')}
                </BaseButton>
              </div>
            </BaseForm.Item>
          </BaseForm>
        </SectionBox>
      </SectionWithTitle>
    </QuizSectionWrapper>
  );
};

export default SkeletonsPage;
