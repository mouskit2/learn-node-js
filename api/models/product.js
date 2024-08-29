const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Price must be a positive number'
        }
    }
});

module.exports = mongoose.model('Product', productSchema);