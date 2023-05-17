import { Router } from "express";
import ProductManager from "../dao/ProductManagerFS.js";
import { __dirname } from "../utils/dirname.js";

const router = Router();
const productManager = new ProductManager(__dirname + "/productos.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.log(error);
    res.status(500).json('product search error');
  }
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.post('/realtimeproducts', async (req, res) => {
    const { title, price, id, category, code, description } = req.body
    const newRealTimeProduct = { title, price, id, category, code, description }
    await productManager.addProduct(newRealTimeProduct)
    const products = await productManager.getProducts();
    console.log("Haciendo POST en realtimeproducts");
    res.render('realTimeProducts', { products });
});

export default router;
