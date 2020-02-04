import mongoose from 'mongoose'

const Rig = mongoose.Schema({
    name: { type: String, required: true },
    dayPrice: { type: Number },
    purchasePrice: { type: Number },
    description: { type: String },
    isDeleted: { type: Boolean },
})

export default mongoose.model('Rig', Rig, 'rigs')