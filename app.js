const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products'); 
const orderRoutes = require('./api/routes/orders');


mongoose.connect(
    'mongodb+srv://mouskit:' +
    process.env.MONGO_ATLAS_PW +
    '@node-rest-chop.ljom2.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-chop'
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});



app.use((error, req, res, next) => {
    //console.error(error.stack);
    res.status(error.status || 500);
    console.log(error)
    res.json({
        error: {
            message: error.message
        }
    });
});


/* app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
}); */

module.exports = app;
