import { expect } from 'chai';
import sinon from 'sinon';
import writingController from '../../controllers/writing.ts';
import WritingAssessmentModel from '../../../models/writing/WritingAssessmentModel.ts';
import STRINGS from '../../../config/strings.ts';

describe('WritingController: createAssessment', () => {
  let consoleStub: sinon.SinonStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
    consoleStub.restore();
  });

  it('should create assessment', async () => {
    const assessment = { AssessmentId: 1 };
    sinon.stub(WritingAssessmentModel, 'create').resolves(assessment as any);
    const data: any = { UserEssayAnswer: { connect: { UserAnswerId: 1 } } };
    const actual = await writingController.createAssessment(data);
    expect(actual.statusCode).to.equal(200);
    expect(actual.response).to.eql(assessment);
  });

  it('should handle failure', async () => {
    sinon.stub(WritingAssessmentModel, 'create').rejects(new Error('fail'));
    const actual = await writingController.createAssessment({} as any);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.ERROR_OCCURRED);
  });
});
