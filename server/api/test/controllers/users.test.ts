import { expect } from "chai";
import STRINGS from "../../../config/strings.ts";
import usersController from "../../controllers/users.ts";
import { users, addUsers, deleteUsers } from "../helpers/users.ts";

before(async function() {
    await addUsers(users)
});

after(async function() {
    await deleteUsers(users)
});

describe("UsersController: getUsers", () => {
  it(`Should load all users`, async () => {
    const actual = await usersController.getUsers();
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("array");
  });

  it(`Should load all students`, async () => {
    const actual = await usersController.getAllStudents();
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("array");
    expect(actual.response.every((u) => u.RoleId == "2" || u.RoleId == 2)).to.be.true;
  });

  it(`Should fail to load a user`, async () => {
    const actual = await usersController.getUser(10000000);
    expect(actual.statusCode).to.equal(400);
    expect(actual.error).to.equal(STRINGS.NO_SUCH_USER_EXISTS);
    expect(actual.response).to.be.null
  });
});
