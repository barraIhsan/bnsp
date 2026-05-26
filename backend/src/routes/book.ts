import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "../controllers/book";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router: Router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);

router.post("/", authenticate, authorizeAdmin, createBook);
router.put("/:id", authenticate, authorizeAdmin, updateBook);
router.delete("/:id", authenticate, authorizeAdmin, deleteBook);

export default router;
