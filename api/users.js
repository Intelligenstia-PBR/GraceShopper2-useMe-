import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  getUser,
  getUserByUsername,
  updateUser,
} from "../db/models/user.js";
import requireAuthentication from "./utils.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(userId);

    if (user) {
      res.send(user);
    } else {
      res.send({
        error: "ERROR",
        message: `user ${userId} not found`,
        title: "userNotFound",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUser({ username, password });
    console.log(user);
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      res.send({
        user: {
          id: user.id,
          username: username,
        },
        message: "you're logged in!",
        token,
      });
    } else {
      res.send({
        message: "INCORRECT LOGIN DETAILS!",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.send({
        error: "ERROR",
        message: `User ${_user.username} is already taken.`,
        name: "UserExistsError",
      });
    } else if (password.length < 8) {
      res.send({
        error: "ERROR",
        message: "Password Too Short!",
        name: "PasswordTooShortError",
      });
    } else {
      const user = await createUser({ email, username, password });
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "Thanks for signing up!",
        token: token,
        user: {
          id: user.id,
          username,
        },
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.patch("/:userId", requireAuthentication, async (req, res, next) => {
  const { userId } = req.params;
  const { username, password, email } = req.body;

  try {
    const bearerHeader = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);

    const user = await getUserById(userId);

    if (user.id === decoded.id) {
      const updatedUser = await updateUser({
        id: userId,
        username: username,
        password: password,
        email: email,
      });

      res.send(updatedUser);
    } else {
      res.status(403).send({
        error: "ERROR",
        message: `User ${decoded.username} is not allowed to update ${user.username}`,
        name: "UNAUTHORIZED USER",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
