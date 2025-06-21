import { expect } from 'chai';
import sinon from 'sinon';
import coursesController from '../../controllers/courses.ts';
import CourseModel from '../../../models/courses/CourseModel.ts';
import STRINGS from '../../../config/strings.ts';

describe('CoursesController: getCourses', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should load all courses', async () => {
    const courses = [{ CourseId: 1, Title: 'Test' }];
    sinon.stub(CourseModel, 'findAll').resolves(courses as any);
    const actual = await coursesController.getCourses();
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.be.null;
    expect(actual.response).to.eql(courses);
  });

  it('should handle failure', async () => {
    sinon.stub(CourseModel, 'findAll').rejects(new Error('fail'));
    const actual = await coursesController.getCourses();
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.ERROR_OCCURRED);
    expect(actual.response).to.be.null;
  });
});
