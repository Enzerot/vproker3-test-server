import mongoose from 'mongoose'

const Order = mongoose.Schema({
    tools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }],
    inventoryNumbers: [{ type: Number }],
    rigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rig' }],
    consumables: [{
        consumable: { type: mongoose.Schema.Types.ObjectId, ref: 'Consumable' },
        amount: { type: Number }
    }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    contractNumber: { type: String },
    description: { type: String },
    paidPledge: { type: Number, required: true },
    startDate: { type: String, required: true },
    finishDate: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    payment: { type: Number },
    remindTo: {
        name: String,
        phoneNumber: String,
        description: String,
    },
})

export default mongoose.model('Order', Order, 'orders')