import request from "supertest";
import { app, resetUsers } from "../app.js";

beforeEach(() => {
  resetUsers();
});

describe("Users API Test", () => {
  test("Should create a user", async () => {
    const response = await request(app).post("/users").send({
      name: "Shiv",
      email: "shiv@example.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Shiv");
    expect(response.body.email).toBe("shiv@example.com");
  });

  test("Should reject missing user details", async () => {
    const response = await request(app).post("/users").send({
      name: "Shiv",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name and email are required");
  });

  test("Should get all users", async () => {
    await request(app).post("/users").send({
      name: "Shiv",
      email: "shiv@example.com",
    });

    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Shiv");
  });

  test("Should return 404 for non-existing user", async () => {
    const response = await request(app).get("/users/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("should update an existing user", async () => {
    const created = await request(app).post("/users").send({
      name: "Shiv",
      email: "shiv@example.com",
    });

    const response = await request(app).put(`/users/${created.body.id}`).send({
      name: "Shiv Mehta",
      email: "shiv.mehta@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Shiv Mehta");
    expect(response.body.email).toBe("shiv.mehta@example.com");
  });

  test("should return 404 when updating a missing user", async () => {
    const response = await request(app).put("/users/999").send({
      name: "Shiv",
      email: "shiv@example.com",
    });

    expect(response.status).toBe(404);
  });

  test("should delete an existing user", async () => {
    const created = await request(app).post("/users").send({
      name: "Shiv",
      email: "shiv@example.com",
    });

    const response = await request(app).delete(`/users/${created.body.id}`);

    expect(response.status).toBe(204);

    const usersResponse = await request(app).get("/users");
    expect(usersResponse.body).toHaveLength(0);
  });

  test("should return 404 when deleting a missing user", async () => {
    const response = await request(app).delete("/users/999");

    expect(response.status).toBe(404);
  });

  test("GET /health returns 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});
