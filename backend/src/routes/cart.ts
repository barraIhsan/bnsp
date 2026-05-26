import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/clear", clearCart);
router.delete("/:id", removeCartItem);

export default router;
