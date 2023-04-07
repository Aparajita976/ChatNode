import express from 'express';
const userRouter = express.Router();
import { getAllUsers } from '../Controller/user-controller.js';
import { signUp } from '../Controller/user-controller.js';
import { login } from '../Controller/user-controller.js';
import { verifyToken } from '../Controller/user-controller.js';
import { refreshToken } from '../Controller/user-controller.js';
import { deleteId } from '../Controller/user-controller.js';
import { logout } from '../Controller/user-controller.js';

import { getUser } from '../Controller/user-controller.js';
import { getUserById } from '../Controller/user-controller.js';
userRouter.get("/", getAllUsers);
userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/refresh", refreshToken);
userRouter.delete("/delete/:userId", verifyToken, deleteId);
userRouter.post("/logout", verifyToken, logout);

userRouter.get("/:username", getUser);
userRouter.get("/id/:id", getUserById);
export default userRouter;