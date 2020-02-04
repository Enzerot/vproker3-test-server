import Rig from '../database/rigSchema'
import Order from '../database/orderSchema'
import Maintain from '../database/maintainSchema'
import validation from '../utils/validation'

const get = (req, res) => {
    Rig.find({ isDeleted: { "$ne": true } })
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json(error))
}

const add = (req, res) => {
    if (
        !validation.validateToolName(req.body.name) &&
        !validation.validatePrice(req.body.dayPrice || 0) &&
        !validation.validatePrice(req.body.workShiftPrice || 0) &&
        !validation.validatePrice(req.body.hourPrice || 0)
    ) {
        const rig = new Rig(req.body)
        rig.save()
            .then(() => res.status(200).json(rig))
            .catch(error => res.status(500).json(error))
    } else res.status(400).json()
}

const edit = (req, res) => {
    if (
        !validation.validateToolName(req.body.name) &&
        !validation.validatePrice(req.body.dayPrice || 0) &&
        !validation.validatePrice(req.body.workShiftPrice || 0) &&
        !validation.validatePrice(req.body.hourPrice || 0)
    ) {
        Rig.findByIdAndUpdate(req.body._id, req.body, { new: true })
            .then(item => res.status(200).json(item))
            .catch(error => res.status(500).json(error))
    } else res.status(400).json()
    
}

const deleteRig = (req, res) => {
    Order.find({ rigs: req.params.id })
        .then(orders => {
            Maintain.find({ rig: req.params.id })
                .then(maintains => {
                    if (!orders.length && !maintains.length) {
                        Rig.findByIdAndDelete(req.params.id)
                            .then(() => res.status(200).json())
                            .catch(error => res.status(500).json(error))
                    } 

                    Rig.findByIdAndUpdate(req.params.id, { isDeleted: true })
                        .then(() => res.status(200).json())
                        .catch(error => res.status(500).json(error))
                })
                .catch(error => res.status(500).json(error))
        })
        .catch(error => res.status(500).json(error))
}

const getModels = (req, res) => {
    Rig.find({ isDeleted: { "$ne": true } }).then(items => {
        res.status(200).json(items.map(item => ({
            id: item._id,
            name: item.name
        })))
    })
}

export default {
    get,
    add,
    edit,
    delete: deleteRig,
    getModels
}