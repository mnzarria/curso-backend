import fs from "fs";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager("./productos.json");

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart() {
    const carts = await this.#getCarts();

    const newCart = {
      id: this.#generarId(carts),
      products: [],
    };
    carts.push(newCart);
    //Guardo el carrito
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#getCarts();
    const cart = carts.find((cart) => cart.id === id);
    if (cart) {
      return cart;
    } else {
      return null;
    }
  }

  async addProductToCart(idCart, idProduct) {
    if (!idProduct || !idCart) return "Faltan datos";

    const carts = await this.#getCarts();
    const cart = carts.find((cart) => cart.id === idCart);
    if (!cart) return "Cart does not exist";

    const prod = await productManager.getProductById(idProduct);
    if (!prod) {
      return null;
    }

    //Si el producto no está, lo agrego. Si ya está, aumento la cantidad

    const product = cart.products.find(
      (product) => product.idProduct === idProduct
    );
    if (!product) {
      cart.products.push({ idProduct, quantity: 1 });
    } else {
      product.quantity++;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return cart;
  }

  async #getCarts() {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.promises.writeFile(this.path, JSON.stringify([]));
        return [];
      }
      throw error;
    }
  }

  #generarId = (carts) => {
    let id;
    if (carts.length === 0) {
      id = 1;
    } else {
      id = carts[carts.length - 1].id + 1;
    }
    return id;
  };
}

export default CartManager;
