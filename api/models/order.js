const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: { 
        type: Number, 
        default: 1,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Quantity must be a positive number'
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);