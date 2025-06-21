import { expect } from 'chai';
import sinon from 'sinon';
import lexiconController from '../../controllers/lexicon.ts';
import LexiconModel from '../../../models/lexicon/LexiconModel.ts';
import LexiconGroupModel from '../../../models/lexicon/LexiconGroupModel.ts';
import UserLexiconProgressModel from '../../../models/lexicon/UserLexiconProgressModel.ts';
import STRINGS from '../../../config/strings.ts';

describe('LexiconController: getWords', () => {
  let consoleStub: sinon.SinonStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
    consoleStub.restore();
  });

  it('should load all words', async () => {
    const words = [{ LexiconId: 1, Word: 'test', LexiconType: { TypeName: 'n' } }];
    sinon.stub(LexiconModel, 'findAll').resolves(words as any);
    const actual = await lexiconController.getWords(undefined, undefined);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.be.null;
    expect(actual.response[0].LexiconType).to.equal('n');
  });

  it('should handle failure', async () => {
    sinon.stub(LexiconModel, 'findAll').rejects(new Error('fail'));
    const actual = await lexiconController.getWords();
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.ERROR_OCCURRED);
    expect(actual.response).to.be.null;
  });

  it('should call findRandom when limit provided', async () => {
    const words = [{ LexiconId: 1, Word: 'a', LexiconType: { TypeName: 'n' } }];
    const stub = sinon.stub(LexiconModel, 'findRandom').resolves(words as any);
    const actual = await lexiconController.getWords('n', 2);
    expect(stub.calledOnceWithExactly(2, 'n')).to.be.true;
    expect(actual.statusCode).to.equal(200);
  });

  it('should call findRandomWithSynAnt when synAnt true', async () => {
    const words = [{ LexiconId: 1, Word: 'a', LexiconType: { TypeName: 'n' } }];
    const stub = sinon.stub(LexiconModel, 'findRandomWithSynAnt').resolves(words as any);
    const actual = await lexiconController.getWords(undefined, 5, true);
    expect(stub.calledOnceWithExactly(5)).to.be.true;
    expect(actual.statusCode).to.equal(200);
  });
});

describe('LexiconController: getGroups', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return formatted groups', async () => {
    const groups = [{
      GroupId: 1,
      Theme: 't',
      Description: 'd',
      LexiconGroupMap: [{ Lexicon: { Word: 'w', Definition: 'd', Synonyms: '', RelatedLexicon: '', Guideword: '', LexiconType: { TypeName: 'n' } } }]
    }];
    sinon.stub(LexiconGroupModel, 'findAllWithWords').resolves(groups as any);
    const actual = await lexiconController.getGroups('n');
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.be.null;
    expect(actual.response[0]).to.have.property('words');
  });
});

describe('LexiconController: updateProgress', () => {
  let consoleStub: sinon.SinonStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
    consoleStub.restore();
  });

  it('should update progress', async () => {
    const stub = sinon.stub(UserLexiconProgressModel, 'upsert').resolves({} as any);
    const actual = await lexiconController.updateProgress({ userId: 1, lexiconId: 2, mastery: 1, memorized: false });
    expect(stub.calledOnce).to.be.true;
    expect(actual.statusCode).to.equal(200);
  });

  it('should handle failure', async () => {
    sinon.stub(UserLexiconProgressModel, 'upsert').rejects(new Error('x'));
    const actual = await lexiconController.updateProgress({ userId: 1, lexiconId: 2, mastery: 1, memorized: false });
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.ERROR_OCCURRED);
  });
});
