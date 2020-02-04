import mongoose from 'mongoose'

const Maintain = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
    rig: { type: mongoose.Schema.Types.ObjectId, ref: 'Rig' },
    price: { type: Number },
    materials: { type: String },
    engineHours: { type: Number },
    startDate: { type: String },
    finishDate: { type: String },
    remindTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
})

export default mongoose.model('Maintain', Maintain, 'maintains')