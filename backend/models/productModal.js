const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    photo: {
        img1: String,
        img2: String,
        img3: String,
        img4: String,
    },
    costPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                // Custom validation logic: Ensure discount is not more than 50% of salePrice
                const maxDiscount = 0.5 * this.salePrice; // 50% of salePrice
                return value <= maxDiscount;
            },
            message: 'Discount cannot be more than 50% of the sale price.',
        },
    },
    salePrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                // Custom validation logic: Ensure salePrice is greater than costPrice
                return value > this.costPrice;
            },
            message: 'Sale price must be greater than cost price.',
        },
    },
    finalPrice: {
        type: Number,
        default: function () {
            return this.salePrice - this.discount;
        },
    },
    quantityInStock: {
        type: Number,
        required: true,
    },
    quantitySold: {
        type: Number,
        default: 0,
    },
    profitEarned: {
        type: Number,
        default: function () {
            return this.discount * this.quantitySold;
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    gender: {
        type: String,
        enum: ['Men', 'Women'],
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    size: {
        type: String,
        default: '',
    },
    brand: {
        type: String,
        default: '',
    },
    AddedOn: {
        type: String, default: new Date().toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'utc'
            }
        )
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
