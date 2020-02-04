import mongoose from 'mongoose'

const Consumable = mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number },
    purchasePrice: { type: Number },
    sellingPrice: { type: Number },
    provider: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean },
})

export default mongoose.model('Consumable', Consumable, 'consumables')