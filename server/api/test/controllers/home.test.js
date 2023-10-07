const { expect } = require("chai");
const STRINGS = require("../../../config/strings");
const homeController = require("../../controllers/home");
const { users, addUsers, deleteUsers } = require("../helpers/users");

before(async function() {
    await addUsers(users)
});

after(async function() {
    await deleteUsers(users)
});

describe("homeController: getHomeSummary", () => {
  it(`Unauthenticated: Should load home summary successfully`, async () => {
    const actual = await homeController.getHomeSummary();
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("array");
    expect(actual.response.length).to.be.greaterThan(1);
  });

  it(`Authenticated: Should load home summary successfully`, async () => {
    const actual = await homeController.getHomeSummary(1);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("array");
    expect(actual.response.length).to.be.greaterThan(1);
  });
});
