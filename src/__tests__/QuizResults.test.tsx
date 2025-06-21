import { screen } from '@testing-library/react';
import QuizResults from '../components/quiz/QuizResults';
import { renderWithProviders } from './test-utils';

const questions = [
  {
    question_id: 'q1',
    question: 'Sample question?',
    type_id: 1,
    content: [
      { choice_id: 1, choice_text: 'Yes' },
      { choice_id: 2, choice_text: 'No' },
    ],
  },
];

const result = {
  accuracy: 100,
  detailedAnswers: [
    {
      answers: [
        { choice_id: 1, user_answer: 1, is_correct_choice: true, marked: true },
      ],
    },
  ],
};

describe('QuizResults', () => {
  it('shows score and correctness label', () => {
    renderWithProviders(
      <QuizResults questions={questions} result={result} />
    );
    expect(screen.getByText('Score: 100%')).toBeInTheDocument();
    expect(screen.getByText('Correct')).toBeInTheDocument();
  });
});
