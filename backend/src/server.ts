import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error";
import authRoute from "./routes/auth";
import bookRoute from "./routes/book";
import cartRoute from "./routes/cart";
import categoryRoute from "./routes/category";
import orderRoute from "./routes/order";
import userRoute from "./routes/user";

const app: Express = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://bnsp-frontend.vercel.app"],
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/books", bookRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

app.use(errorMiddleware);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
