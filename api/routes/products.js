const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/products/${doc._id}`
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.body.productImage);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.body.productImage
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Create product successfully',
                createdProduct: {

                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({erreur: err});
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Gety all products',
                        url: `http://localhost:3000/products`
                    }
                })
            }
            else {
                res.status(404).json({
                    message: `not valide entry found for provided ID: ${id}`
                })
            } 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = req.body; // Les champs à mettre à jour

    Product.findByIdAndUpdate(id, { $set: updateOps }, { new: true })
    .exec()
    .then(result => {
        if (result){
            res.status(200).json({
                message: 'Update product successfully',
                updatedProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${result._id}`
                    }
                }
        });
        }
        else {
            res.status(404).json({
                message: `not valide entry found for provided ID: ${id}`
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndDelete(id)
    .exec()
    .then(result => {
        console.log(result);
        if (result){
            res.status(200).json({
                message: `Product Id: ${result._id} deleted`,
                request: {
                    type: 'POST',
                    description: 'Create new product',
                    url: `http://localhost:3000/products`,
                    body: { name: 'String', price: 'Number' }
                }
            })
        }
        else {
            res.status(404).json({
                message: `not valide entry found for provided ID: ${id}`
            })
        }  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

module.exports = router;