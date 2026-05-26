import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router: Router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", authenticate, authorizeAdmin, createCategory);
router.put("/:id", authenticate, authorizeAdmin, updateCategory);
router.delete("/:id", authenticate, authorizeAdmin, deleteCategory);

export default router;
