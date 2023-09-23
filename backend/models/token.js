const mongoose = require('mongoose')
const schema = mongoose.Schema;

const tokenSchema = new schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique:true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now , expires:3600},//1hr
})

const Token = mongoose.model('token', tokenSchema)
module.exports = Token