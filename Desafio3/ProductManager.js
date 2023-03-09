/*         REUTILIZO EL PRODUCT MANAGER DEL DESAFIO ENTREGABLE N°2          */

import fs from 'fs';

/* Realizar una clase "ProductManager" que gestione un conjunto de productos */
class ProductManager {

    /* Debe crearse desde su constructor */
    constructor(path) {
        this.path = path;
    }
    
    async addProduct(product) {
        /* Debe contar con un método addProduct, el cual agregará un producto al arreglo inicial */
        /* Cada producto debe contar con: title, description, price, thumbnail, code, stock */  

        const products = await this.getProducts();
        
        //Si ya hay productos, busco el último para que el nuevo producto tenga el id siguiente, si no hay productos le pongo el id 1
        const lastProduct = products[products.length - 1];
        const newId = lastProduct ? lastProduct.id +1 : 1;

        console.log("AGREGADO DE PRODUCTOS");

        /* Verifico campos obligatorios */
        if( !product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            console.log ("Error! Todos los campos son obligatorios");
            return;
        }
                
        const newProduct = {
            id: newId,
            ...product
        }
        products.push(newProduct);
        //this.products.push(newProduct)
        await this.#saveProducts(products);
        return newProduct;
        }
    
    async getProducts() {
        /* Debe contar con un método getProducts, el cual debe devolver el arreglo con todos los productos */
        // Intento traer los productos del archivo JSON, sino devuelvo un array vacío
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        }
        catch (err) {
            if (err.code === "ENOENT"){
                await this.saveProducts([]);
                return [];
            }
            throw err;
        }
    }  

    async getProductById(id){
        
        /* Debe contar con un método getProductById, el cual debe buscar en el arreglo el producto que coincida con el id */

        const products = await this.getProducts();
        const productoBuscado = products.find((x) => x.id == id);
        if (productoBuscado) {
            console.log("BUSQUEDA DE PRODUCTOS");
            console.log("El producto con id ",id," fue encontrado:")
            return productoBuscado;
        } else {
            console.log("BUSQUEDA DE PRODUCTOS");
            console.log ("id", id, "not found")
            return null;
        }
    }
    
    async #saveProducts(products ) {
        // Uso # para que sea un método privado

        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }

    async deleteProductById(id) {
        const products = await this.getProducts();
        //Busco el indice del prod que quiero eliminar
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) {
            return 'El producto no existe';
        } else {
            products.splice(index, 1);
            await this.#saveProducts(products);
            return 'Producto'
        };
    }

    async updateProductById(id, update){
        const products = await this.getProducts();
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) {
            return 'Producto para actualizar no encontrado';
        }
        const updatedProduct = { ...products[index], ...update, id };
        products.splice(index, 1, updatedProduct);
        await this.#saveProducts(products);
        return updatedProduct;
    }
}

    export default ProductManager;

//Archivo JSON con productos
const productManager = new ProductManager('./productos.json');

/* PRUEBA DE FUNCIONES GENERADAS EN ENTREGABLE 2*/
async function prueba() {

    //Add products
    const product1 = {
        title: 'Bicicleta MTB 1',
        description: 'Rodado 29, suspensión delantera, freno a disco',
        price: 120000,
        thumbnail: '/image1.png',
        code: 'MTB1',
        stock: 10,
    };
    const product2 = {
        title: 'Bicicleta MTB 2',
        description: 'Rodado 29, horquilla fija, freno a disco hidráulico',
        price: 170000,
        thumbnail: '/image2.png',
        code: 'MTB2',
        stock: 5,
    };

    await productManager.addProduct(product1);
    await productManager.addProduct(product2);

        // Get products by id
    const productById = await productManager.getProductById(1);
    if (!productById) {
        console.log('Fallo en la consulta por ID. No existe un producto con ese id');
    } else {
        console.log('Consulta por ID exitosa: Producto por id:\n', productById);
    }

    //Update products by id
    const updatedProduct = {
        title: 'Bicicleta MTB 1',
        description: 'Descripción actualizada del producto',
        price: 130000,
    };
    const productUpdated = await productManager.updateProductById(8, updatedProduct);
    if (!productUpdated) {
        console.log('Fallo en la actualización. No existe un producto con ese id');
    } else {
        console.log('Producto actualizado:\n', productUpdated);
    }

    // Delete products by id
    const deletedProductId = await productManager.deleteProductById(9);
    if (!deletedProductId) {
        console.log('Fallo en la eliminación. No existe un producto con ese id');
    } else {
        console.log('ID Producto eliminado:', deletedProductId);
    }


    // Get products
    console.log('Productos restantes:\n', await productManager.getProducts());
}

prueba();
