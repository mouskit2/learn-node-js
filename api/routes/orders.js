const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.product)
    .then(product => {
        if (!product) {
            res.status(404).json({
                message: 'Product not found'
            });
            return Promise.reject(); // Rejeter la promesse pour arrêter l'exécution
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.product
        });
        return order.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err => {
        if (err) { // Si une erreur survient, elle sera traitée ici
            console.log(err);
            res.status(500).json({
                error: err
            });
        }
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .select('product quantity')
    .populate('product', 'name')
    .exec()
    .then(order => {
        if (order){
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/orders/${id}`
                }
            });
        }
        else{
            res.status(404).json({
                message: `not valide entry found for provided ID: ${id}`
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndDelete(id)
        .exec()
        .then(result => {
            console.log(result);
            if (result){
                res.status(200).json({
                    message: 'Order deleted',
                    request: {
                        type: 'DELETE',
                        url: `http://localhost:3000/orders/${id}`,
                        body: {productId: result.product, quantity: result.quantity}
                    }
                });
            }
            else {
                res.status(404).json({
                    message: `not valide entry found for provided ID: ${id}`
                });
            }
        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        );
});

module.exports = router;