import mongoose from 'mongoose'

const Discount = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number },
})

export default mongoose.model('Discount', Discount, 'discounts')