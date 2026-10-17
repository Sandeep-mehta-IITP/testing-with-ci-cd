import express from "express";

const app = express();

app.use(express.json());

let users = [];
let nextId = 1;



app.use((req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    console.log(JSON.stringify({
      level: "INFO",
      message: "http_request",
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startTime
    }));
  });

  next();
});


// Root endpoint
app.get("/", (req, res) => {
  res.send("My Testing App is running!");
});

// create user
app.post("/users", (req, res) => {
    const {name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        })
    }

    const user = {
        id: nextId++,
        name,
        email
    }

    users.push(user);

    return res.status(201).json(user);

})

// get all users
app.get("/users", (req, res) => {
    return res.status(200).json(users);
})

// get user by id 
app.get("/users/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Id is required"
        })
    }

    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json(user);
})

// Update an existing user
app.put("/users/:id", (req, res) => {
  const user = users.find(
    (u) => u.id === Number(req.params.id)
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  user.name = name;
  user.email = email;

  return res.status(200).json(user);
});

// Delete an existing user
app.delete("/users/:id", (req, res) => {
  const index = users.findIndex(
    (u) => u.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  users.splice(index, 1);

  return res.status(204).send();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Application is healthy version 2.0"
  });
});


export { app }

export function resetUsers() {
    users = [];
    nextId = 1;
}