import UserModelClass from "../../../models/user/index.ts";

const UserModel = new UserModelClass();

export const users = [
  {
    email: "test3@gmail.com",
    password: "123456890",
    gender: "M",
    roleId: "1",
    firstName: "test",
    lastName: "test",
  },
  {
    email: "test4@gmail.com",
    password: "123456890",
    gender: "M",
    roleId: "2",
    firstName: "test",
    lastName: "test",
  },
  {
    email: "test5@gmail.com",
    password: "123456890",
    gender: "M",
    roleId: "2",
    firstName: "test",
    lastName: "test",
  },
  {
    email: "manvminh@gmail.com",
    password: "testtest",
    gender: "M",
    roleId: "2",
    firstName: "test",
    lastName: "test",
  },
  {
    email: "test@gmail.com",
    password: "testtest",
    gender: "M",
    roleId: "2",
    firstName: "test",
    lastName: "test",
  },
];

export async function addUser(user: any) {
  await UserModel.addOne(
    user.email,
    user.passwordHash || "$2b$10$tymuoeVagAW1VkEpzQGQV.V5IC1uglO.yuTIeU0NrGWAlBdYLisrW",
    user.passwordSalt || "$2b$10$PIj3eLyGKt7eEXXdLHU0uO",
    user.gender,
    user.roleId,
    user.profilePictureId,
    user.firstName,
    user.lastName
  );
}

export async function addUsers(list: any[]) {
  for (const u of list) {
    await addUser(u);
  }
}

export async function deleteUsers(list: any[]) {
  for (const u of list) {
    const existingUser = await UserModel.findOneByEmail(u.email);

    if (!existingUser.error && existingUser.response.length !== 0) {
      await UserModel.deleteOne(existingUser.response[0].user_id);
    }
  }
}
