import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

const productManager = new ProductManager("./productos.json");

//Endpoint para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;

    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.status(200).send({ status: "success", payload: limitedProducts });
    } else {
      res.status(200).send({ status: "success", payload: products });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "error", error: "Error al obtener los productos" });
  }
});

// Endpoint para obtener un producto por id
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productManager.getProductById(parseInt(pid));

    if (product) {
      res.status(200).send({ status: "success", payload: product });
    } else {
      res
        .status(404)
        .send({ status: "error", error: "Producto no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "error", error: "Error al obtener el producto" });
  }
});

// Endpoint para agregar un producto
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock ||
      !product.category
    ) {
      res
        .status(400)
        .send({ status: "error", error: "Todos los campos son obligatorios" });
      return;
    }
    const b = await productManager.addProduct(product);
    if (b === -1) {
      res
        .status(400)
        .send({ status: "error", error: "El código del producto ya existe" });
      return;
    }
    res.status(201).send({ status: "success", payload: b });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "error", error: "Error al agregar el producto" });
  }
});

// Endpoint para actualizar un producto
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = req.body;
    const updatedProduct = await productManager.updateProductById(
      parseInt(pid),
      product
    );
    if (updatedProduct === -1) {
      res
        .status(404)
        .send({ status: "error", error: "Producto no encontrado" });
      return;
    }
    res.status(201).send({ status: "success", payload: updatedProduct });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "error", error: "Error al actualizar el producto" });
  }
});

// Endpoint para borrar un producto
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProductById(parseInt(pid));
    if (deletedProduct === -1) {
      res
        .status(404)
        .send({ status: "error", error: "Producto no encontrado" });
      return;
    }
    res.status(201).send({ status: "success", payload: deletedProduct });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "error", error: "Error al borrar el producto" });
  }
});

export default router;
