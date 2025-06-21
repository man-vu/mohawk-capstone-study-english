import { expect } from "chai";
import STRINGS from "../../../config/strings.ts";
import homeController from "../../controllers/home.ts";
import { users, addUsers, deleteUsers } from "../helpers/users.ts";
import AppUserModel from "../../../models/auth/AppUserModel.ts";

before(async function() {
    AppUserModel.__testReset();
    await addUsers(users);
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
