import { Router } from "express";
import { create, verifyToken } from "../../controller/user-controller"

const router = Router();
router.post("/user/create", create);
router.post("/user/verify-email", verifyToken);
export default router;