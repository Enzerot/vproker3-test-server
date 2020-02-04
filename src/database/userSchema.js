import mongoose from 'mongoose'

const User = mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
})

export default mongoose.model('User', User, 'users')