import fs from "fs";
import ProductManager from "./ProductManagerFS.js"

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

  async addProductToCart(cid, pid) {
    if (!pid || !cid) return "Faltan datos";

    const carts = await this.#getCarts();
    const cart = carts.find((cart) => cart.id === cid);
    //Caso A: se intenta editar un carrito que no existe
    if (!cart) {
      return "El carrito no existe"
    }
    //Caso B: se intenta agregar al carrito un producto que aun no existe en la base de datos
    const prod = await productManager.getProductById(pid);
    if (!prod) {
      return "Producto no existente en la base de datos de productos";
    }
    
    //Caso C: Carrito y productos existen en la base de datos
    //Si el producto no está, lo agrego. Si ya está, aumento la cantidad
    const product = cart.products.find(
      (product) => product.pid === pid
    );
    //Si el producto no existe dentro del carrito, coloco la primera unidad
    if (!product) {
      cart.products.push({ pid, quantity: 1 });
    } 
    //Si el producto existe dentro del carrito, aumento la cantidad
    else {
      product.quantity++;
    }
    //Actualizo al carrito y lo guardo en archivo
    const cartIndex = carts.findIndex((c) => c.id === cid);
    carts.splice(cartIndex, 1, cart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return "Producto agregado al carrito";
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
