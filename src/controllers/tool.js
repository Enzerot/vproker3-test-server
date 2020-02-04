import Tool from '../database/toolSchema'
import Maintain from '../database/maintainSchema'
import Order from '../database/orderSchema'
import validation from '../utils/validation'

const get = (req, res) => {
    Tool.find({ isDeleted: { "$ne": true } })
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json(error))
}

const add = (req, res) => {
    if (
        !validation.validateDescription(req.body.description) &&
        !validation.validatePrice(req.body.price || 0) &&
        !validation.validatePledge(req.body.price || 0) &&
        !validation.validatePrice(req.body.dayPrice) &&
        !validation.validatePrice(req.body.workShiftPrice || 0) &&
        !validation.validatePrice(req.body.hourPrice) &&
        !validation.validateCategories(req.body.category) &&
        !validation.validateInventoryNumber(req.body.inventoryNumber)
    ) {
        const tool = new Tool(req.body)
        tool.save()
            .then(() => {
                res.status(200).json(tool)
            })
            .catch(error =>
                res.status(500).json(error))
    } else {
        res.status(400).json()
    }
}

const edit = (req, res) => {
    if (
        !validation.validateDescription(req.body.description) &&
        !validation.validatePrice(req.body.price || 0) &&
        !validation.validatePledge(req.body.price || 0) &&
        !validation.validatePrice(req.body.dayPrice) &&
        !validation.validatePrice(req.body.workShiftPrice || 0) &&
        !validation.validatePrice(req.body.hourPrice) &&
        !validation.validateCategories(req.body.category) &&
        !validation.validateInventoryNumber(req.body.inventoryNumber)
    ) {
        Tool.findByIdAndUpdate(req.body._id, req.body, { new: true })
            .then(item => res.status(200).json(item))
            .catch(error => res.status(500).json(error))
    } else {
        res.status(400).json()
    }
    
}

const deleteTool = (req, res) => {
    Order.find({ tools: req.params.id })
        .then(orders => {
            Maintain.find({ tool: req.params.id })
                .then(maintains => {
                    if (!orders.length && !maintains.length) {
                        Tool.findByIdAndDelete(req.params.id)
                            .then(() => res.status(200).json())
                            .catch(error => res.status(500).json(error))
                    } 

                    Tool.findByIdAndUpdate(req.params.id, { isDeleted: true })
                        .then(() => res.status(200).json())
                        .catch(error => res.status(500).json(error))
                })
                .catch(error => res.status(500).json(error))
        })
        .catch(error => res.status(500).json(error))
}

const getModels = (req, res) => {
    Tool.find({ isDeleted: { "$ne": true } }).then(items => {
        res.status(200).json(items.map(item => ({
            id: item._id,
            name: item.name
        })))
    })
}

const getDetailModels = (req, res) => {
    Tool.find({ isDeleted: { "$ne": true } }).then(items => {
        res.status(200).json(items.map(item => ({
            id: item._id,
            name: item.name,
            pledge: item.pledge,
            dayPrice: item.dayPrice,
            workShiftPrice: item.workShiftPrice,
            hourPrice: item.hourPrice,
            description: item.description,
            inventoryNumber: item.inventoryNumber,
        })))
    })
}

const editInventoryNumber = (req, res) => {
    const { toolID, inventoryNumber } = req.body
    Tool.findById(toolID)
        .then(item => {
            if (item.count === 1) {
                item.inventoryNumber = inventoryNumber
                item.save()
            }
        })
        .catch(error => res.status(500).json(error))
}

const getLastInventoryNumber = (req, res) => {
    Tool.find()
        .then(items => {
            res.status(200).json(items.reverse().find(item => !!item.inventoryNumber).inventoryNumber + 1)
        })
        .catch(error => res.status(500).json(error))
}

export default {
    get,
    add,
    edit,
    delete: deleteTool,
    getModels,
    getDetailModels,
    editInventoryNumber,
    getLastInventoryNumber,
}