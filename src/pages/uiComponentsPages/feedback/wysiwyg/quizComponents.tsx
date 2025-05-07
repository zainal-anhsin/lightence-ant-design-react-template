import styled from 'styled-components';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { media } from '@app/styles/themes/constants';

export const AnswerOptionWrapper = styled(BaseRow)`
  margin-bottom: 8px;
  align-items: center;
`;

export const AnswerLabel = styled.span<{ $isCorrect: boolean }>`
  width: 20px;
  display: inline-block;
  color: #b6eaff;
  font-weight: ${(props) => (props.$isCorrect ? 600 : 400)};
`;

export const AnswerInput = styled(BaseInput)`
  flex: 1;
  margin-left: 8px;
`;

export const SetCorrectButton = styled(BaseButton)<{ $selected: boolean }>`
  margin-left: 12px;
  width: 140px;
  background: ${({ $selected }) => ($selected ? '#1890ff' : '#23243a')};
  color: ${({ $selected }) => ($selected ? '#fff' : '#b6eaff')};
  border: 1px solid #1890ff;
  &:hover {
    background: #1890ff;
    color: #fff;
  }
`;

export const DeleteButton = styled(BaseButton)`
  margin-left: 8px;
`;

export const AddAnswerButton = styled(BaseButton)`
  width: 140px;
  border-color: #1890ff;
  background: #23243a;
  color: #b6eaff;
  &:hover {
    background: #1890ff;
    color: #fff;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const RichContentPreview = styled.div`
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
  .ql-align-justify { text-align: justify; }
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

export const PreviewAnswer = styled.div<{ $isCorrect: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  background: ${({ $isCorrect }) => ($isCorrect ? '#2a3b4d' : undefined)};
  border-radius: 4px;
  padding: ${({ $isCorrect }) => ($isCorrect ? '2px 8px' : undefined)};
  color: ${({ $isCorrect }) => ($isCorrect ? '#b6eaff' : '#b0b0b0')};
  font-weight: ${({ $isCorrect }) => ($isCorrect ? 600 : 400)};
  opacity: 0.9;
`;

export const PreviewLabel = styled.span`
  font-weight: bold;
  width: 20px;
`;

export const PreviewText = styled.span`
  margin-left: 8px;
`;

export const FormItem = styled(BaseForm.Item)`
  @media only screen and ${media.xs} {
    max-width: fit-content;
  }
  @media only screen and ${media.md} {
    max-width: 100%;
  }
`;

export const QuizSectionWrapper = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 32px;
  align-items: stretch;
  height: 100%;
`;

export const SectionWithTitle = styled.div<{ $width?: string }>`
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width || '50%'};
  min-width: 320px;
  margin-right: 32px;
  height: 100%;
`;

export const SectionTitle = styled.h3`
  color: #e0e0e0;
  font-weight: 500;
  margin-bottom: 18px;
  margin-left: 8px;
`;

export const SectionBox = styled.div`
  border-radius: 8px;
  padding: 24px 24px 4px 24px;
  background: #23243a;
  color: #f3f3f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  min-height: 100px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const QuizPreview = styled.div`
  flex: 1;
  min-width: 320px;
  border-radius: 8px;
  padding: 24px;
  background: #23243a;
  color: #f3f3f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

export const QuizContent = styled.div`
  flex: 1;
  min-width: 320px;
`;

export const QuestionListWrapper = styled.div`
  background: #23243a;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

export const QuestionListTitle = styled.h3`
  color: #f3f3f3;
  font-weight: 600;
  margin-bottom: 18px;
  margin-left: 8px;
`;

export const QuestionNumbersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  margin-bottom: 18px;
`;

export const QuestionNumberButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? '#7c3aed' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#f3f3f3')};
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 500;
  padding: 6px 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #7c3aed;
    color: #fff;
  }
`;

export const QuestionListActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
`;
