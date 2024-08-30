const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return (value.trim()).length> 0;
            },
            message: 'name must be have less one letter'
        }
    },
    price: { 
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'price must be a positive number'
        }
    }
});

module.exports = mongoose.model('Product', productSchema);