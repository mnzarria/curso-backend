/*         REUTILIZO EL PRODUCT MANAGER DEL DESAFIO ENTREGABLE N°3          */

import fs from "fs";

/* Realizar una clase "ProductManager" que gestione un conjunto de productos */
class ProductManager {
  /* Debe crearse desde su constructor */
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    /* Debe contar con un método addProduct, el cual agregará un producto al arreglo inicial */
    /* Cada producto debe contar con: title, description, price, thumbnails, code, stock */

    const products = await this.getProducts();

    if (products.some((p) => p.code === product.code)) {
      console.log("Error: El código del producto ya existe");
      return -1;
    }

    //Si ya hay productos, busco el último para que el nuevo producto tenga el id siguiente, si no hay productos le pongo el id 1
    const lastProduct = products[products.length - 1];
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    console.log("AGREGADO DE PRODUCTOS");

    /* Verifico campos obligatorios */
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock ||
      !product.category
    ) {
      console.log("Error! Todos los campos son obligatorios");
      return;
    }

    const newProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnails: product.thumbnails || [],
      code: product.code,
      stock: product.stock,
      category: product.category,
      status: true,
      id: newId
    };
    products.push(newProduct);
    //this.products.push(newProduct)
    await this.#saveProducts(products);
    return newProduct;
  }

  async getProducts() {
    /* Debe contar con un método getProducts, el cual debe devolver el arreglo con todos los productos */
    // Intento traer los productos del archivo JSON, sino devuelvo un array vacío
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (err) {
      if (err.code === "ENOENT") {
        await this.#saveProducts([]);
        return [];
      }
      throw err;
    }
  }

  async getProductById(id) {
    /* Debe contar con un método getProductById, el cual debe buscar en el arreglo el producto que coincida con el id */

    const products = await this.getProducts();
    const productoBuscado = products.find((x) => x.id == id);
    if (productoBuscado) {
      console.log("BUSQUEDA DE PRODUCTOS");
      console.log("El producto con id ", id, " fue encontrado:");
      return productoBuscado;
    } else {
      console.log("BUSQUEDA DE PRODUCTOS");
      console.log("id", id, "not found");
      return null;
    }
  }

  async #saveProducts(products) {
    // Uso # para que sea un método privado

    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async deleteProductById(id) {
    const products = await this.getProducts();
    //Busco el indice del prod que quiero eliminar
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return "El producto no existe";
    } else {
      products.splice(index, 1);
      await this.#saveProducts(products);
      return id;
    }
  }

  async updateProductById(id, update) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return "Producto para actualizar no encontrado";
    }
    const updatedProduct = {
      title: update.title || products[index].title,
      description: update.description || products[index].description,
      price: update.price || products[index].price,
      thumbnails: update.thumbnails || products[index].thumbnails,
      code: update.code || products[index].code,
      stock: update.stock || products[index].stock,
      category: update.category || products[index].category,
      status: update.status || products[index].status,
      id: id,
    };
    products.splice(index, 1, updatedProduct);
    await this.#saveProducts(products);
    return updatedProduct;
  }
}

export default ProductManager;
