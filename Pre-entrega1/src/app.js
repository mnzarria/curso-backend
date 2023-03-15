import express from 'express';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import {__dirname} from './utils/dirname.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
    console.log('Escuchando puerto 8080')

})