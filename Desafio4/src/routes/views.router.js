import { Router } from 'express';
import ProductManager from '../ProductManager.js';
import { __dirname } from '../utils/dirname.js';

const router = Router();
const productManager = new ProductManager(__dirname + '/productos.json');


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});
/*
router.post('/realtimeproducts', async (req, res) => {
    const { title, price } = req.body
    const newRealTimeProduct = { title, price }
    await productManager.addProduct(newRealTimeProduct)
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});
*/

export default router;