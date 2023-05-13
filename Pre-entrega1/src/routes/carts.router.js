import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();
const cartManager = new CartManager("./carrito.json");

//Endpoint para crear nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).send({ status: "success", payload: newCart });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: "Error al crear carrito" });
  }
});

//Endpoint para buscar carrito
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartById(parseInt(cid));

    if (cart) {
      res.status(200).send({ status: "success", payload: cart });
    } else {
      res.status(404).send({ status: "error", error: "Carrito no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "error", error: "Error al obtener el carrito" });
  }
});

//Endpoint para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(
      parseInt(cid),
      parseInt(pid)
    );

    if (cart) {
      res.status(201).send({ status: "success", payload: cart });
    } else {
      res
        .status(404)
        .send({ status: "error", error: "Carrito o producto no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      error: "Error al agregar el producto al carrito",
    });
  }
});

export default router;
