import mongoose from 'mongoose'

const Passport = mongoose.Schema({
    series: { type: String, required: true  },
    number: { type: String, required: true },
})

export default mongoose.model('Passport', Passport, 'passports')