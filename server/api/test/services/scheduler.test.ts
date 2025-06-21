import { expect } from 'chai';
import sinon from 'sinon';
import cron from 'node-cron';
import moment from 'moment';
import UserAttemptModel from '../../../models/user/UserAttemptModel.ts';
import quizzesController from '../../../api/controllers/quizzes.ts';

describe('scheduler checkAttempts', () => {
  afterEach(() => sinon.restore());

  it('should submit expired attempts', async () => {
    let cb: any;
    sinon.stub(cron, 'schedule').callsFake((expr: string, fn: any) => { cb = fn; return {} as any; });
    const attempts = [{
      start_time: moment.utc().subtract(10, 'minutes').toDate(),
      time_allowed: 1,
      quiz_id: 2,
      attempt_id: 3,
      user_id: 4
    }];
    sinon.stub(UserAttemptModel, 'findAllIncompleteAttempts').resolves(attempts as any);
    const submitStub = sinon.stub(quizzesController, 'submitAndMark').resolves();

    await import('../../../services/scheduler/checkAttempts.ts?1');
    await cb();

    expect(submitStub.calledOnceWithExactly({ quizId: 2, attemptId: 3, userId: 4 })).to.be.true;
  });

  it('should ignore ongoing attempts', async () => {
    let cb: any;
    sinon.stub(cron, 'schedule').callsFake((expr: string, fn: any) => { cb = fn; return {} as any; });
    const attempts = [{
      start_time: moment.utc().add(10, 'minutes').toDate(),
      time_allowed: 1,
      quiz_id: 5,
      attempt_id: 6,
      user_id: 7
    }];
    sinon.stub(UserAttemptModel, 'findAllIncompleteAttempts').resolves(attempts as any);
    const submitStub = sinon.stub(quizzesController, 'submitAndMark').resolves();

    await import('../../../services/scheduler/checkAttempts.ts?2');
    await cb();

    expect(submitStub.notCalled).to.be.true;
  });
});
