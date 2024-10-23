import express from "express";
import categoryRoutes from "./routes/category.route";
import productRoutes from "./routes/product.route";

const app = express();

app.use(express.json());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);

app.listen(3000, () => console.log(`server is listening on port 3000`));
