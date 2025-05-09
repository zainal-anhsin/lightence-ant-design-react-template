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
import chatbotInterface from './chatbotInterface/ChatbotInterface';
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
import ChatbotInterface from './chatbotInterface/ChatbotInterface';
import AutoQuestion from './chatbotInterface/autoQuestion';

function stripHtmlTags(str: string) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '');
}

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

  // LIFTED STATE
  const [question, setQuestion] = useState('Choose the correct answer.');
  const [answers, setAnswers] = useState([
    { label: 'A', value: '' },
    { label: 'B', value: '' },
    { label: 'C', value: '' },
    { label: 'D', value: '' },
  ]);
  const [correct, setCorrect] = useState('A');

  // --- Grammar check state ---
  const [grammarResult, setGrammarResult] = useState<any>(null);
  const [loadingGrammar, setLoadingGrammar] = useState(false);

  // --- Grammar check handler ---
  const handleCheckGrammar = async () => {
    setLoadingGrammar(true);
    setGrammarResult(null);
    try {
      const body = {
        question,
        answers: answers.map((a) => ({ option: a.label, text: a.value })),
        correctAnswer: correct,
      };
      const res = await fetch('http://localhost:3007/ai/check-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setGrammarResult(data);
    } catch (err) {
      setGrammarResult({ error: 'Failed to check grammar.' });
    } finally {
      setLoadingGrammar(false);
    }
  };

  return (
    <>
      <PageTitle>{t('common.skeleton')}</PageTitle>
      <QuizSection
        question={question}
        setQuestion={setQuestion}
        answers={answers}
        setAnswers={setAnswers}
        correct={correct}
        setCorrect={setCorrect}
        handleCheckGrammar={handleCheckGrammar}
        grammarResult={grammarResult}
        loadingGrammar={loadingGrammar}
        setGrammarResult={setGrammarResult}
      />
      <div>
        <AutoQuestion
          right={542}
          onAccept={(quiz: { question: string; answers: { option: string; text: string }[]; correctAnswer: string }) => {
            setQuestion(quiz.question);
            setAnswers(
              quiz.answers.map((a: { option: string; text: string }) => ({ label: a.option, value: a.text }))
            );
            setCorrect(quiz.correctAnswer);
          }}
        />
        <ChatbotInterface />
      </div>
    </>
  );
};

type QuizSectionProps = {
  question: string;
  setQuestion: (q: string) => void;
  answers: { label: string; value: string }[];
  setAnswers: (a: { label: string; value: string }[]) => void;
  correct: string;
  setCorrect: (c: string) => void;
  handleCheckGrammar: () => void;
  grammarResult: any;
  loadingGrammar: boolean;
  setGrammarResult: (result: any) => void;
};

const QuizSection: React.FC<QuizSectionProps> = ({
  question,
  setQuestion,
  answers,
  setAnswers,
  correct,
  setCorrect,
  handleCheckGrammar,
  grammarResult,
  loadingGrammar,
  setGrammarResult,
}) => {
  const { t } = useTranslation();

  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers(answers.map((a, i) => (i === idx ? { ...a, value } : a)));
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
    setGrammarResult(null);
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
            <BaseButton type="default" onClick={handleCheckGrammar} loading={loadingGrammar}>
              Check Grammar
            </BaseButton>
          </ButtonGroup>
          {/* Display grammar check result */}
          {grammarResult && (
            <div style={{ marginTop: 16, background: '#222', color: '#fff', borderRadius: 8, padding: 16 }}>
              {grammarResult.status === 'all_good' ? (
                <div style={{ color: 'lightgreen' }}>{grammarResult.message}</div>
              ) : grammarResult.status === 'has_errors' ? (
                <div>
                  <h4 style={{ color: '#ffb300', marginBottom: 16 }}>Corrections:</h4>
                  <div style={{ marginBottom: 12 }}>
                    <strong style={{ fontSize: 16 }}>Question:</strong>
                    <div style={{ marginTop: 8, marginBottom: 8 }}>
                      <span style={{ color: '#aaa' }}>Original:&nbsp;</span>
                      <span style={{ color: '#ff4d4f', fontWeight: 600, whiteSpace: 'pre-wrap' }}>
                        {stripHtmlTags(grammarResult.question.originalText)}
                      </span>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ color: '#aaa' }}>Corrected:&nbsp;</span>
                      <span style={{ color: '#52c41a', fontWeight: 600, whiteSpace: 'pre-wrap' }}>
                        {stripHtmlTags(grammarResult.question.correctedText)}
                      </span>
                    </div>
                  </div>
                  <div>
                    {grammarResult.question.corrections.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          background: '#181818',
                          borderRadius: 6,
                          padding: 10,
                          marginBottom: 10,
                          borderLeft: '4px solid #ffb300',
                        }}
                      >
                        <div>
                          <span style={{ color: '#aaa' }}>Type:&nbsp;</span>
                          <span style={{ color: '#ffb300', fontWeight: 500 }}>{c.type}</span>
                        </div>
                        <div>
                          <span style={{ color: '#aaa' }}>Wrong:&nbsp;</span>
                          <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{c.original}</span>
                        </div>
                        <div>
                          <span style={{ color: '#aaa' }}>Correct:&nbsp;</span>
                          <span style={{ color: '#52c41a', fontWeight: 600 }}>{c.correction}</span>
                        </div>
                        <div>
                          <span style={{ color: '#aaa' }}>Explanation:&nbsp;</span>
                          <span style={{ color: '#fff' }}>{c.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ color: 'red' }}>{grammarResult.error || 'Unknown error.'}</div>
              )}
            </div>
          )}
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
