import Consumable from '../database/consumableSchema'
import validation from '../utils/validation'

const get = (req, res) => {
    Consumable.find({ isDeleted: { "$ne": true } })
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json(error))
}

const add = (req, res) => {
    if (
        !validation.validateToolName(req.body.name) &&
        !validation.validatePrice(req.body.purchasePrice || 0) &&
        !validation.validatePrice(req.body.sellingPrice || 0) &&
        !validation.validateToolName(req.body.provider || 'not required') && //TODO: Refactoring validation
        !validation.validateDescription(req.body.description)
    ) {
        const consumable = new Consumable(req.body)
        consumable.save()
            .then(() => res.status(200).json(consumable))
            .catch(error => res.status(500).json(error))
    } else res.status(400).json()
}

const edit = (req, res) => {
    if (
        (req.body.name ? !validation.validateToolName(req.body.name) : true) &&
        !validation.validatePrice(req.body.purchasePrice || 0) &&
        !validation.validatePrice(req.body.sellingPrice || 0) &&
        !validation.validateToolName(req.body.provider || 'not required') &&
        !validation.validateDescription(req.body.description)
    ) {
        Consumable.findByIdAndUpdate(req.body._id, req.body, { new: true })
            .then(item => res.status(200).json(item))
            .catch(error => res.status(500).json(error))
    } else res.status(400).json()
    
}

const deleteConsumable = (req, res) => {
    Consumable.findByIdAndUpdate(req.params.id, { isDeleted: true })
        .then(() => res.status(200).json())
        .catch(error => res.status(500).json(error))
}

const getModels = (req, res) => {
    Consumable.find({ isDeleted: { "$ne": true } }).then(items => {
        res.status(200).json(items.map(item => ({
            id: item._id,
            name: item.name,
            amount: item.amount,
        })))
    })
}

export default {
    get,
    add,
    edit,
    delete: deleteConsumable,
    getModels
}