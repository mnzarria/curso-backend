import { cartsModel } from "../db/models/carts.model.js";
import { productsModel } from "../db/models/products.model.js";

class CartManager {
  async createCart() {
    try {
      const newCart = new cartsModel();
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartsModel.findById(id);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cid, pid) {
    if (!pid || !cid) return "Faltan datos";

    try {
      const cart = await cartsModel.findById(cid);
      //Caso A: se intenta editar un carrito que no existe
      if (!cart) {
        return "El carrito no existe";
      }
      //Caso B: se intenta agregar al carrito un producto que aun no existe en la base de datos
      const prod = await productManager.getProductById(pid);
      if (!prod) {
        return "Producto no existente en la base de datos";
      }
      //Caso C: Carrito y productos existen en la base de datos
      //Si el producto no está, lo agrego. Si ya está, aumento la cantidad
      const product = cart.products.find((product) => product.pid === pid);
      //Si el producto no existe dentro del carrito, coloco la primera unidad
      if (!product) {
        cart.products.push({ pid: productId, quantity: 1 });
        await cart.save();
      }
      //Si el producto existe dentro del carrito, aumento la cantidad
      else {
        product.quantity++;
        await cart.updateOne({ products: cart.products });
      }
      return cart;
      //return "Producto agregado al carrito";
      // //Actualizo al carrito y lo guardo en archivo
      // const cartIndex = carts.findIndex((c) => c.id === cid);
      // carts.splice(cartIndex, 1, cart);
      // await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      console.log(error);
    }
  }
}

export default CartManager;
