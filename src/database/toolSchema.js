import mongoose from 'mongoose'

const Tool = mongoose.Schema({
    name: { type: String, required: true },
    count: { type: Number },
    inventoryNumber: { type: Number },
    serialNumbers: [{ type: Number }],
    description: { type: String },
    price: { type: Number },
    pledge: { type: Number, required: true },
    dayPrice: { type: Number, required: true },
    workShiftPrice: { type: Number },
    hourPrice: { type: Number, required: true },
    category: { type: String },
    purchased: { type: String },
    isDeleted: { type: Boolean },
})

export default mongoose.model('Tool', Tool, 'tools')