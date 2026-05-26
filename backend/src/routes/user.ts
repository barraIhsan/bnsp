import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router: Router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

router.put("/:id", authenticate, authorizeAdmin, updateUser);
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

export default router;
