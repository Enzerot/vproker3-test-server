import Discount from '../database/discountSchema'
import Client from '../database/clientSchema'
import validation from '../utils/validation'

const get = (req, res) => {
    Discount.find()
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json(error))
}

const add = (req, res) => {
    if (
        !validation.validateDiscountName(req.body.name) &&
        !validation.validateDescription(req.body.description) &&
        !validation.validateDiscount(req.body.amount)
    ) {
        const discount = new Discount(req.body)
        discount.save()
            .then(() => {
                res.status(200).json(discount)
            })
            .catch(error =>
                res.status(500).json(error))
    } else {
        res.status(400).json()
    }
}

const edit = (req, res) => {
    if (
        !validation.validateDiscountName(req.body.name) &&
        !validation.validateDescription(req.body.description) &&
        !validation.validateDiscount(req.body.amount)
    ) {
        Discount.findByIdAndUpdate(req.body._id, req.body, { new: true })
            .then(item => res.status(200).json(item))
            .catch(error => res.status(500).json(error))
    } else {
        res.status(400).json()
    }
    
}

const deleteDiscount = (req, res) => {
    Discount.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json())
        .catch(error => res.status(500).json(error))
}

const getModels = (req, res) => {
    Discount.find().then(items =>
        res.status(200).json(items.map(item => ({
                id: item._id,
                name: item.name
            })
        ))
    )
}

export default {
    get,
    add,
    edit,
    delete: deleteDiscount,
    getModels
}