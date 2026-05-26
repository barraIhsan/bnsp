import { Router } from "express";
import {
  checkout,
  getAllOrders,
  getMyOrders,
  getOrderById,
} from "../controllers/order";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router: Router = Router();

router.use(authenticate);

router.post("/checkout", checkout);
router.get("/my", getMyOrders);
router.get("/", authorizeAdmin, getAllOrders);
router.get("/:id", getOrderById);

export default router;
