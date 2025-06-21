import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnhancedQuizResults from '../components/quiz/EnhancedQuizResults';
import { renderWithProviders } from './test-utils';

const sampleQuestions = [
  { question_id: '1', question: 'Q1', type_id: 1, content: [{ choice_id: 'a', choice_text: 'A' }] },
];
const sampleResult = {
  accuracy: 95,
  detailedAnswers: [
    {
      answers: [{ user_answer: 1, marked: true, choice_id: 'a', is_correct_choice: true }],
    },
  ],
};

describe('EnhancedQuizResults', () => {
  it('renders grade label and calls callbacks', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    renderWithProviders(
      <EnhancedQuizResults questions={sampleQuestions} result={sampleResult} onRetry={retry} />
    );
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(retry).toHaveBeenCalled();
  });
});
