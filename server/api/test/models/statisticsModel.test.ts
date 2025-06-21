import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import StatisticsModel from '../../../models/logs/StatisticsModel.ts';

describe('StatisticsModel', () => {
  afterEach(() => sinon.restore());

  it('findQuizOne should aggregate quiz stats', async () => {
    sinon.stub(prisma, 'quiz').value({ count: sinon.stub().resolves(5) } as any);
    const attemptStub = {
      count: sinon.stub().resolves(1),
      findMany: sinon.stub().resolves([{ QuizId: 2 }]),
    } as any;
    sinon.stub(prisma, 'userAttempt').value(attemptStub);
    const result = await StatisticsModel.findQuizOne(1);
    expect(result).to.eql({ number_of_quizzes: 5, incomplete: 1, unattempted: 4 });
  });

  it('findAnswerOne should aggregate answer stats', async () => {
    const answerFake = { count: sinon.stub() } as any;
    answerFake.count.onCall(0).resolves(1);
    answerFake.count.onCall(1).resolves(2);
    answerFake.count.onCall(2).resolves(3);
    sinon.stub(prisma, 'userAnswer').value(answerFake);
    const result = await StatisticsModel.findAnswerOne(1);
    expect(answerFake.count.callCount).to.equal(3);
    expect(result).to.eql({ correct: 1, partially_correct: 0, incorrect: 2, unanswered: 3 });
  });

  it('findBoardStatisticsByQuiz should map attempts', async () => {
    const attempts = [
      { EndTime: new Date(), Grade: '90', AppUser: { FirstName: 'A', LastName: 'B' } },
    ];
    sinon
      .stub(prisma, 'userAttempt')
      .value({ findMany: sinon.stub().resolves(attempts) } as any);
    const result = await StatisticsModel.findBoardStatisticsByQuiz({ quizId: 1, dateFrom: '2021', dateTo: '2022' });
    expect(result[0].grade).to.equal(90);
    expect(result[0].full_name).to.equal('A B');
  });
});
