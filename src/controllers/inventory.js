import Inventory from '../database/inventorySchema'
import validation from '../utils/validation'

const get = (req, res) => {
    Inventory.find()
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json(error))
}

const add = (req, res) => {
    if (
        !validation.validateToolName(req.body.name) &&
        !validation.validatePrice(req.body.purchasePrice || 0) &&
        !validation.validatePrice(req.body.number || 0) &&
        !validation.validatePrice(req.body.serialNumber || 0) &&
        !validation.validatePrice(req.body.inventoryNumber || 0) &&
        !validation.validatePrice(req.body.residualValue || 0)
    ) {
        const inventory = new Inventory(req.body)
        inventory.save()
            .then(() => res.status(200).json(inventory))
            .catch(error => res.status(500).json(error))
    } else res.status(400).json()
}

const edit = (req, res) => {
    if (
        !validation.validateToolName(req.body.name) &&
        !validation.validatePrice(req.body.purchasePrice || 0) &&
        !validation.validatePrice(req.body.number || 0) &&
        !validation.validatePrice(req.body.serialNumber || 0) &&
        !validation.validatePrice(req.body.inventoryNumber || 0) &&
        !validation.validatePrice(req.body.residualValue || 0)
    ) {
        Inventory.findByIdAndUpdate(req.body._id, req.body, { new: true })
            .then(item => res.status(200).json(item))
            .catch(error => res.status(500).json(error))
    } else res.status(400).json()
    
}

const deleteInventory = (req, res) => {
    Inventory.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json())
        .catch(error => res.status(500).json(error))
}

export default {
    get,
    add,
    edit,
    delete: deleteInventory,
}