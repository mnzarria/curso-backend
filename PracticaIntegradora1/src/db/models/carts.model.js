import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        required: true,
        default: []
    }
});

export const cartsModel = mongoose.model('Carts', cartsSchema);