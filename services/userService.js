
export async function createUser(user, database) {
  if (!user.name || !user.email) {
    throw new Error("Name and email are required");
  }

  return await database.create(user);
}
