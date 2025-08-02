import { Router } from "express";
import { register, verifyToken } from "../../controller/user-controller"

const router = Router();
router.post("/user/register", register);
router.post("/user/verify-email", verifyToken);
export default router;