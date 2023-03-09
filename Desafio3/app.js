import express from 'express'
import ProductManager from './ProductManager.js'


const app = express()
const productManager = new ProductManager('./productos.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* CREATE  */

app.post('/products', async (req, res) => {
    try {
        const product = req.body;
        await productManager.addProduct(product);
        res.status(201)
            .json("Producto agregado correctamente");
    } catch (err) {
        console.error(err);
        res.status(500)
            .json({ error: 'Error. No se pudo crear el producto' });
    }
});


/* READ - Todos */
app.get('/products', async (req,res)=>{
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if(limit){
            const limitedProducts = products.slice(0,limit);
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "No se pudo obtener el listado de productos"});
    }
});

/* READ - Por id */
app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productManager.getProductById(parseInt(pid));

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'No se pudo obtener el listado de productos   ' });
    }
});


/* UPDATE  */
app.put('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;
        const updatedProduct = await productManager.updateProductById(
            parseInt(pid),
            product
        );
        res.status(201)
            .json("Producto actualizado");
    } catch (err) {
        console.error(err);
        res.status(500)
            .json({ error: 'Error al actualizar el producto' });
    }
});

/* DELETE */
app.delete('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProductById(parseInt(pid));
        res.status(201)
            .json("Producto borrado correctamente");
    } catch (err) {
        console.error(err);
        res.status(500)
            .json({ error: 'Error al eliminar el producto' });
    }
});

app.listen(8080, () => {
    console.log('Servidor en puerto 8080');
});