import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import CorrectAnswerModel from '../../../models/question/CorrectAnswerModel.ts';

describe('CorrectAnswerModel', () => {
  afterEach(() => sinon.restore());

  it('findMultipleChoice should map answers', async () => {
    const fakeQuestions = [
      {
        QuestionId: 1,
        QuestionMultipleChoice: [
          { ChoiceOrder: 1, IsCorrect: true },
          { ChoiceOrder: 2, IsCorrect: false },
        ],
      },
    ];
    sinon
      .stub(prisma, 'question')
      .value({ findMany: sinon.stub().resolves(fakeQuestions) } as any);
    const result = await CorrectAnswerModel.findMultipleChoice(1);
    expect(result).to.have.length(2);
    expect(result[0]).to.eql({ question_id: 1, choice_id: 1, is_correct_choice: true });
  });

  it('findGapFilling should map answers', async () => {
    const fakeQuestions = [
      {
        QuestionId: 1,
        QuestionGapFilling: [{ SequenceId: 1, CorrectAnswer: 'a' }],
      },
    ];
    sinon
      .stub(prisma, 'question')
      .value({ findMany: sinon.stub().resolves(fakeQuestions) } as any);
    const result = await CorrectAnswerModel.findGapFilling(1);
    expect(result[0]).to.eql({ question_id: 1, sequence_id: 1, correct_answer: 'a' });
  });

  it('findMatchingPairs should map pairs', async () => {
    const fakePairs = [
      {
        MatchingPrompt: { QuestionId: 1, PromptOrder: 1 },
        MatchingChoice: { ChoiceOrder: 2 },
      },
    ];
    sinon
      .stub(prisma, 'matchingAnswer')
      .value({ findMany: sinon.stub().resolves(fakePairs) } as any);
    const result = await CorrectAnswerModel.findMatchingPairs(1);
    expect(result[0]).to.eql({ question_id: 1, prompt_order: 1, choice_order: 2, is_correct_choice: true });
  });
});
