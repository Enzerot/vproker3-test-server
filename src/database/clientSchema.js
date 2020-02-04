import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const Client = mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, unique: true },
    passport: { type: String },
    createdAt: { type: String },
    description: { type: String },
    birthDate: { type: String },
    allOrders: { type: Number, required: true  },
    activeOrders: { type: Number, required: true  },
    discount: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
    isClientInBlackList: { type: Boolean },
    isDeleted: { type: Boolean }
})

Client.plugin(uniqueValidator)

export default mongoose.model('Client', Client, 'clients')