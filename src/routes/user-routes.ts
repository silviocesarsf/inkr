import { Router } from "express";
import { login, me, register, verifyToken } from "../controller/user-controller"
import { auth } from "../middleware/auth";

const router = Router();
router.post("/user/register", register);
router.post("/user/verify-email", verifyToken);
router.post("/user/login", login)
router.get("/user/me", auth, me)
export default router;