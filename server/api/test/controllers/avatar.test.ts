import { expect } from 'chai';
import sinon from 'sinon';
import avatarController from '../../controllers/avatar.ts';
import AppUserModel from '../../../models/auth/AppUserModel.ts';
import MimeTypeModel from '../../../models/media/MimeTypeModel.ts';
import STRINGS from '../../../config/strings.ts';

describe('AvatarController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('insertAvatar', () => {
    it('should create mime record', async () => {
      const fake = { MimeId: 1 };
      sinon.stub(MimeTypeModel, 'create').resolves(fake as any);
      const result = await avatarController.insertAvatar({ savedFilename: 'a.png', userId: 1 });
      expect(MimeTypeModel.create.calledOnce).to.be.true;
      expect(result.statusCode).to.equal(200);
      expect(result.response.mimeId).to.equal(1);
    });

    it('should handle failure', async () => {
      sinon.stub(MimeTypeModel, 'create').rejects(new Error('fail'));
      const result = await avatarController.insertAvatar({ savedFilename: 'a.png', userId: 1 });
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal(STRINGS.ERROR_OCCURRED);
    });
  });

  describe('updateAvatar', () => {
    it('should update user', async () => {
      sinon.stub(AppUserModel, 'update').resolves();
      const result = await avatarController.updateAvatar({ mimeId: 1, userId: 2 });
      expect(AppUserModel.update.calledOnce).to.be.true;
      expect(result.statusCode).to.equal(200);
    });

    it('should handle failure', async () => {
      sinon.stub(AppUserModel, 'update').rejects(new Error('fail'));
      const result = await avatarController.updateAvatar({ mimeId: 1, userId: 2 });
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal(STRINGS.ERROR_OCCURRED);
    });
  });
});
