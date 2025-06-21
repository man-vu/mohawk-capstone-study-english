import { expect } from 'chai';
import sinon from 'sinon';
import { transporter } from '../../../services/email_notification/config.ts';
import { sendPasswordReset } from '../../../services/email_notification/passwordReset.ts';

describe('sendPasswordReset', () => {
  afterEach(() => {
    sinon.restore();
    process.env.NODE_ENV = 'test';
  });

  it('should return test response when NODE_ENV=test', async () => {
    process.env.NODE_ENV = 'test';
    const res = await sendPasswordReset('a@a.com', 'p');
    expect(res).to.eql({ response: '250 Test' });
  });

  it('should send email in production env', async () => {
    process.env.NODE_ENV = 'production';
    const stub = sinon.stub(transporter, 'sendMail').resolves({ response: 'ok' } as any);
    const res = await sendPasswordReset('a@a.com', 'p');
    expect(stub.calledOnce).to.be.true;
    expect(res).to.eql({ response: 'ok' });
  });
});
