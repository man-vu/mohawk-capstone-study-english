import { expect } from 'chai';
import sinon from 'sinon';
import mockTestsController from '../../controllers/mockTests.ts';
import MockTestModel from '../../../models/mockTests/MockTestModel.ts';
import STRINGS from '../../../config/strings.ts';

describe('MockTestsController', () => {
  let consoleStub: sinon.SinonStub;
  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });
  afterEach(() => {
    sinon.restore();
    consoleStub.restore();
  });

  it('getTests should load tests', async () => {
    sinon.stub(MockTestModel, 'findAll').resolves([{ id: 1 }] as any);
    const res = await mockTestsController.getTests();
    expect(res.statusCode).to.equal(200);
    expect(res.response).to.eql([{ id: 1 }]);
  });

  it('getTests should handle failure', async () => {
    sinon.stub(MockTestModel, 'findAll').rejects(new Error('fail'));
    const res = await mockTestsController.getTests();
    expect(res.statusCode).to.equal(400);
    expect(res.error).to.equal(STRINGS.ERROR_OCCURRED);
  });

  it('getTest should load test', async () => {
    sinon.stub(MockTestModel, 'findById').resolves({ id: 1 } as any);
    const res = await mockTestsController.getTest(1);
    expect(res.statusCode).to.equal(200);
    expect(res.response).to.eql({ id: 1 });
  });

  it('getTest should handle failure', async () => {
    sinon.stub(MockTestModel, 'findById').rejects(new Error('fail'));
    const res = await mockTestsController.getTest(1);
    expect(res.statusCode).to.equal(400);
    expect(res.error).to.equal(STRINGS.ERROR_OCCURRED);
  });
});
