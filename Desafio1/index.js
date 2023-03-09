/*          DESAFIO ENTREGABLE N°1          */

/* Realizar una clase "ProductManager" que gestione un conjunto de productos */

class ProductManager {


    /* Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío */
    constructor() {
        this.products =[];
        this.id = 0;
    }

    /* Debe contar con un método addProduct, el cual agregará un producto al arreglo inicial */
    /* Cada producto debe contar con: title, description, price, thumbnail, code, stock */
    addProduct(product) {
        console.log("AGREGADO DE PRODUCTOS");

        /* Verifico campos obligatorios */
        if( !product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            console.log ("Error! Todos los campos son obligatorios");
            return;
        }
        
        /* Verifico que el code no coincida con el de otro producto */
        if (this.products.some((x) => x.code === product.code)) {
            console.log("Error! El código del producto ya fue ingresado");
            return;
        }
        
        /* Incremento id y agrego nuevo producto */
        this.id++;
        const newProduct = {
            id: this.id,
            ...product
        }
        this.products.push(newProduct)
        }
    
    
    /* Debe contar con un método getProducts, el cual debe devolver el arreglo con todos los productos */
    getProducts() {
        return this.products;
    }

    /* Debe contar con un método getProductById, el cual debe buscar en el arreglo el producto que coincida con el id */

    getProductById(id){
        const productoBuscado = this.products.find((x) => x.id == id);
        if (productoBuscado) {
            console.log("BUSQUEDA DE PRODUCTOS");
            console.log("El producto con id ",id," fue encontrado:")
            return productoBuscado;
        } else {
            console.log("BUSQUEDA DE PRODUCTOS");
            console.log ("id", id, "not found")
        }
    }
    }

const listaPrueba = new ProductManager();
console.log("Listado inicial: ",listaPrueba.products);

listaPrueba.addProduct({title: "producto de prueba", description:"Este es un producto de prueba", price : 200, thumbnail:"Sin imagen", code:"abc123", stock: 20});
console.log("Listado: ",listaPrueba.products);

listaPrueba.addProduct({title: "producto de prueba 2", description:"Este es otro producto de prueba", price : 300, thumbnail:"Sin imagen", code:"abc123", stock: 15});
console.log("Listado: ",listaPrueba.products);

listaPrueba.addProduct({title: "producto de prueba 3", description:"Este es otro producto de prueba más", price : 400, thumbnail:"Sin imagen", code:"abc125", stock: 25});
console.log("Listado: ",listaPrueba.products);

console.log(listaPrueba.getProductById(1));
console.log(listaPrueba.getProductById(3));