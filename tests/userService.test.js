
import { jest } from "@jest/globals";
import { createUser } from "../services/userService.js";

describe("createUser service", () => {
  test("should create a user successfully", async () => {
    const database = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: "Shiv",
        email: "shiv@example.com",
      }),
    };

    const result = await createUser(
      { name: "Shiv", email: "shiv@example.com" },
      database
    );

    expect(result.id).toBe(1);
    expect(database.create).toHaveBeenCalledTimes(1);
  });

  test("should reject missing user details", async () => {
    const database = {
      create: jest.fn(),
    };

    await expect(
      createUser({ name: "Shiv" }, database)
    ).rejects.toThrow("Name and email are required");

    expect(database.create).not.toHaveBeenCalled();
  });

  test("should propagate database errors", async () => {
    const database = {
      create: jest.fn().mockRejectedValue(
        new Error("Database failed")
      ),
    };

    await expect(
      createUser(
        { name: "Shiv", email: "shiv@example.com" },
        database
      )
    ).rejects.toThrow("Database failed");
  });
});
