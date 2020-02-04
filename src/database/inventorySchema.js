import mongoose from 'mongoose'

const Inventory = mongoose.Schema({
    number: { type: Number, required: true },
    name: { type: String, required: true },
    serialNumber: { type: Number, required: true },
    inventoryNumber: { type: Number, required: true },
    purchaseDate: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    residualValue: { type: Number, required: true },
    guaranteePeriod: { type: Number, required: true },
})

export default mongoose.model('Inventory', Inventory, 'inventory')