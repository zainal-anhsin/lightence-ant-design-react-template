/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Button, Input, Form } from 'antd';
import { CheckOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
import WysiwygEditor from './wysiwyg/WysiwygEditor';
import ChatbotInterface from './chatbotInterface/ChatbotInterface';
import AutoQuestion from './chatbotInterface/autoQuestion';
import '@app/styles/styles.css';

function stripHtmlTags(str: string) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '');
}

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
      <h3 className="question-list-title">Question List</h3>
      <div className="question-list-wrapper">
        <div className="question-numbers-grid">
          {questions.map((num) => (
            <button key={num} className="question-number-button">
              {num}
            </button>
          ))}
        </div>
        <div className="question-list-actions">
          <Button type="primary" className="question-list-button" onClick={handleAddQuestion}>
            + Add Question
          </Button>
          <Button type="default" className="question-list-button" onClick={handleRemoveQuestion} disabled={questions.length <= 1}>
            <MinusOutlined /> Remove
          </Button>
        </div>
      </div>
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
          onAccept={(quiz: {
            question: string;
            answers: { option: string; text: string }[];
            correctAnswer: string;
          }) => {
            setQuestion(quiz.question);
            setAnswers(quiz.answers.map((a: { option: string; text: string }) => ({ label: a.option, value: a.text })));
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
    const newLabel = String.fromCharCode(65 + answers.length);
    setAnswers([...answers, { label: newLabel, value: '' }]);
  };

  const handleDeleteAnswer = (indexToDelete: number) => {
    if (answers.length <= 2) return;

    const newAnswers = answers.filter((_, index) => index !== indexToDelete);
    const updatedAnswers = newAnswers.map((answer, index) => ({
      ...answer,
      label: String.fromCharCode(65 + index),
    }));

    setAnswers(updatedAnswers);

    if (correct === answers[indexToDelete].label) {
      setCorrect(updatedAnswers[0].label);
    }
  };

  const handleSave = () => {
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
    <div className="quiz-section-wrapper">
      {/* --- Left Section: Question List + Preview --- */}
      <div className="section-with-title" style={{ width: '40%', marginRight: 20 }}>
        <QuestionListSection />
        <h3 className="section-title">Preview</h3>
        <div className="section-box">
          {question && (
            <div className="rich-content-preview" dangerouslySetInnerHTML={{ __html: question }} />
          )}
          <div>
            {answers.map((ans) => (
              <div key={ans.label} className={`preview-answer ${correct === ans.label ? 'correct' : ''}`}>
                <span className="preview-label">{ans.label}</span>
                <span className="preview-text">
                  {ans.value || <span style={{ color: '#555' }}>Option {ans.label}</span>}
                </span>
                {correct === ans.label && <CheckOutlined style={{ color: '#52c41a', marginLeft: 8, fontSize: 18 }} />}
              </div>
            ))}
          </div>
          <div className="button-group" style={{ marginTop: 14 }}>
            <Button type="primary" onClick={handleSave}>
              {t('common.save')}
            </Button>
            <Button type="ghost" onClick={handleReset}>
              {t('Reset')}
            </Button>
            <Button type="default" onClick={handleCheckGrammar} loading={loadingGrammar}>
              Check Grammar
            </Button>
          </div>
          {/* Display grammar check result */}
          {grammarResult && (
            <div className="grammar-result-container">
              {grammarResult.status === 'all_good' ? (
                <div className="success-message">{grammarResult.message}</div>
              ) : grammarResult.status === 'has_errors' ? (
                <div>
                  <h4 className="corrections-title">Corrections:</h4>
                  <div className="question-section">
                    <strong className="question-title">Question:</strong>
                    <div className="text-comparison">
                      <span className="text-comparison-label">Original:&nbsp;</span>
                      <span className="original-text">{stripHtmlTags(grammarResult.question.originalText)}</span>
                    </div>
                    <div className="text-comparison">
                      <span className="text-comparison-label">Corrected:&nbsp;</span>
                      <span className="corrected-text">{stripHtmlTags(grammarResult.question.correctedText)}</span>
                    </div>
                  </div>
                  <div>
                    {grammarResult.question.corrections.map((c: any, idx: number) => (
                      <div key={idx} className="correction-item">
                        <div>
                          <span className="text-comparison-label">Type:&nbsp;</span>
                          <span className="correction-type">{c.type}</span>
                        </div>
                        <div>
                          <span className="text-comparison-label">Wrong:&nbsp;</span>
                          <span className="correction-wrong">{c.original}</span>
                        </div>
                        <div>
                          <span className="text-comparison-label">Correct:&nbsp;</span>
                          <span className="correction-correct">{c.correction}</span>
                        </div>
                        <div>
                          <span className="text-comparison-label">Explanation:&nbsp;</span>
                          <span className="correction-explanation">{c.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="error-message">{grammarResult.error || 'Unknown error.'}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Content Section (right) --- */}
      <div className="section-with-title" style={{ width: '60%', marginRight: 0 }}>
        <h3 className="section-title">Content</h3>
        <div className="section-box">
          <Form layout="vertical">
            <Form.Item>
              <WysiwygEditor value={question} onChange={setQuestion} />
            </Form.Item>

            <Form.Item label="Edit Answers & Options">
              {answers.map((ans, idx) => (
                <div key={ans.label} className="answer-option-wrapper">
                  <span className={`answer-label ${correct === ans.label ? 'correct' : ''}`}>{ans.label}</span>
                  <Input
                    className="answer-input"
                    value={ans.value}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder={`Option ${ans.label}`}
                  />
                  <Button
                    type="default"
                    className={`set-correct-button ${correct === ans.label ? 'selected' : ''}`}
                    onClick={() => setCorrect(ans.label)}
                  >
                    {correct === ans.label && <CheckOutlined style={{ marginRight: 4 }} />}
                    {correct === ans.label ? 'Correct' : 'Set as Correct'}
                  </Button>
                  <Button
                    type="text"
                    danger
                    className="delete-button"
                    icon={<CloseOutlined />}
                    onClick={() => handleDeleteAnswer(idx)}
                    disabled={answers.length <= 2}
                  />
                </div>
              ))}
              <div className="answer-option-wrapper" style={{ marginTop: 12, marginRight: 17 }}>
                <span className="answer-label" />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>
                    *Click the button to mark the correct answer and click the X button to remove the answer*
                  </span>
                </div>
                <Button type="dashed" className="add-answer-button" onClick={handleAddAnswer}>
                  {t('+ Add Answer')}
                </Button>
                <div style={{ width: 40 }} />
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SkeletonsPage;
