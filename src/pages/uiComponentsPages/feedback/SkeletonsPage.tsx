/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles';
import { media } from '@app/styles/themes/constants';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseFormItem } from '@app/components/common/forms/components/BaseFormItem/BaseFormItem';
import { CheckOutlined, CloseOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import WysiwygEditor from './wysiwyg/WysiwygEditor';
import {
  AnswerOptionWrapper,
  AnswerLabel,
  AnswerInput,
  SetCorrectButton,
  DeleteButton,
  ButtonGroup,
  RichContentPreview,
  PreviewAnswer,
  PreviewLabel,
  PreviewText,
  FormItem,
  QuizSectionWrapper,
  SectionWithTitle,
  SectionTitle,
  SectionBox,
  QuizPreview,
  QuizContent,
  QuestionListWrapper,
  QuestionListTitle,
  QuestionNumbersGrid,
  QuestionNumberButton,
  QuestionListActions,
  AddAnswerButton,
  QuestionListButton,
} from './wysiwyg/quizComponents';

type Size = 'default' | 'large' | 'small';

const QuestionListSection: React.FC = () => {
  const [questions, setQuestions] = React.useState<number[]>(Array.from({ length: 10 }, (_, i) => i + 1));

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, prev.length + 1]);
  };

  const handleRemoveQuestion = () => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.slice(0, -1));
    }
  };

  return (
    <>
      <QuestionListTitle>Question List</QuestionListTitle>
      <QuestionListWrapper>
        <QuestionNumbersGrid>
          {questions.map((num) => (
            <QuestionNumberButton key={num}>{num}</QuestionNumberButton>
          ))}
        </QuestionNumbersGrid>
        <QuestionListActions>
          <QuestionListButton type="primary" onClick={handleAddQuestion}>
            + Add Question
          </QuestionListButton>
          <QuestionListButton type="default" onClick={handleRemoveQuestion} disabled={questions.length <= 1}>
            <MinusOutlined /> Remove
          </QuestionListButton>
        </QuestionListActions>
      </QuestionListWrapper>
    </>
  );
};

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
      label: String.fromCharCode(65 + index), // A, B, C, etc.
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
    setQuestion('Choose the correct answer.');
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
      {/* --- Left Section: Question List + Preview --- */}
      <SectionWithTitle $width="40%" style={{ marginRight: 20 }}>
        <QuestionListSection />
        <SectionTitle>Preview</SectionTitle>
        <SectionBox>
          {question && (
            <RichContentPreview style={{ marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: question }} />
          )}
          <div>
            {answers.map((ans) => (
              <PreviewAnswer key={ans.label} $isCorrect={correct === ans.label}>
                <PreviewLabel>{ans.label}</PreviewLabel>
                <PreviewText>{ans.value || <span style={{ color: '#555' }}>Option {ans.label}</span>}</PreviewText>
                {correct === ans.label && <CheckOutlined style={{ color: '#52c41a', marginLeft: 8, fontSize: 18 }} />}
              </PreviewAnswer>
            ))}
          </div>
          <ButtonGroup style={{ marginTop: 14 }}>
            <BaseButton type="primary" onClick={handleSave}>
              {t('common.save')}
            </BaseButton>
            <BaseButton type="ghost" onClick={handleReset}>
              {t('Reset')}
            </BaseButton>
          </ButtonGroup>
        </SectionBox>
      </SectionWithTitle>

      {/* --- Content Section (right) --- */}
      <SectionWithTitle $width="60%" style={{ marginRight: 0 }}>
        <SectionTitle>Content</SectionTitle>
        <SectionBox>
          <BaseForm layout="vertical">
            <BaseFormItem>
              <WysiwygEditor value={question} onChange={setQuestion} />
            </BaseFormItem>

            <BaseFormItem label="Edit Answers & Options">
              {answers.map((ans, idx) => (
                <AnswerOptionWrapper key={ans.label}>
                  <AnswerLabel $isCorrect={correct === ans.label}>{ans.label}</AnswerLabel>
                  <AnswerInput
                    value={ans.value}
                    onChange={(e: any) => handleAnswerChange(idx, e.target.value)}
                    placeholder={`Option ${ans.label}`}
                  />
                  <SetCorrectButton
                    type="default"
                    $selected={correct === ans.label}
                    onClick={() => setCorrect(ans.label)}
                  >
                    {correct === ans.label && <CheckOutlined style={{ marginRight: 4 }} />}
                    {correct === ans.label ? 'Correct' : 'Set as Correct'}
                  </SetCorrectButton>
                  <DeleteButton
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleDeleteAnswer(idx)}
                    disabled={answers.length <= 2}
                  />
                </AnswerOptionWrapper>
              ))}
              <AnswerOptionWrapper style={{ marginTop: 12, marginRight: 17 }}>
                <AnswerLabel $isCorrect={false} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>
                    *Click the button to mark the correct answer and click the X button to remove the answer*
                  </span>
                </div>
                <AddAnswerButton type="dashed" onClick={handleAddAnswer}>
                  {t('+ Add Answer')}
                </AddAnswerButton>
                <div style={{ width: 40 }} /> {/* acts like the delete button space */}
              </AnswerOptionWrapper>
            </BaseFormItem>
          </BaseForm>
        </SectionBox>
      </SectionWithTitle>
    </QuizSectionWrapper>
  );
};

export default SkeletonsPage;
