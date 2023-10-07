const UserModel = new (require("../../../models/user"))();

module.exports = {
  users: [
    {
      email: "test3@gmail.com",
      password: "123456890",
      gender: "M",
      profilePictureId: "1",
      roleId: "1",
      firstName: "test",
      lastName: "test",
    },
    {
      email: "test4@gmail.com",
      password: "123456890",
      gender: "M",
      profilePictureId: "1",
      roleId: "2",
      firstName: "test",
      lastName: "test",
    },
    {
      email: "test5@gmail.com",
      password: "123456890",
      gender: "M",
      profilePictureId: "1",
      roleId: "2",
      firstName: "test",
      lastName: "test",
    },
  ],
  addUser: async function(user) {
    await UserModel.addOne(
      user.email,
      user.passwordHash || '$2b$10$tymuoeVagAW1VkEpzQGQV.V5IC1uglO.yuTIeU0NrGWAlBdYLisrW',
      user.passwordSalt || '$2b$10$PIj3eLyGKt7eEXXdLHU0uO',
      user.gender,
      user.roleId,
      user.profilePictureId,
      user.firstName,
      user.lastName
    );
  },
  addUsers: async function(users) {
    for (let i = 0; i < users.length; i++) {
      await module.exports.addUser(users[i])
    }
  },
  deleteUsers: async function(users) {
    for (let i = 0; i < users.length; i++) {
      const existingUser = await UserModel.findOneByEmail(users[i].email);

      if (!existingUser.error && existingUser.response.length !== 0) {
        await UserModel.deleteOne(existingUser.response[0].user_id);
      }
    }
  },
};
