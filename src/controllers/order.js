import Order from '../database/orderSchema'
import Client from '../database/clientSchema'
import Consumable from '../database/consumableSchema'
import validation from '../utils/validation'
import { Parser } from 'json2csv'

const get = (req, res) => {
    if (req.role === 'admin') {
        Order.find()
            .populate('tools', 'name dayPrice hourPrice workShiftPrice isDeleted count')
            .populate('rigs', 'name dayPrice isDeleted')
            .populate('consumables.consumable', 'name amount sellingPrice isDeleted')
            .populate({
                path: 'client',
                select: 'name phoneNumber passport birthDate isDeleted allOrders',
                populate: {
                    path: 'discount',
                    select: 'name amount'
                }
            })
            .populate('client.discount', 'name amount')
            .populate('createdBy', 'login role')
            .then(items => res.status(200).json(items))
            .catch(error => console.log(error))
    } else {
        Order.find({ finishDate: { "$in" : [null, undefined]} })
            .populate('tools', 'name dayPrice hourPrice workShiftPrice isDeleted count')
            .populate('rigs', 'name dayPrice isDeleted')
            .populate('consumables.consumable', 'name amount sellingPrice isDeleted')
            .populate({
                path: 'client',
                select: 'name phoneNumber passport birthDate isDeleted allOrders',
                populate: {
                    path: 'discount',
                    select: 'name amount'
                }
            })
            .populate('client.discount', 'name amount')
            .populate('createdBy', 'login role')
            .then(items => res.status(200).json(items))
            .catch(error => console.log(error))
    }
}

const getActive = (req, res) =>
    Order.find({ finishDate: { "$in" : [null, undefined]} })
        .populate('tools', 'name dayPrice hourPrice workShiftPrice isDeleted count')
        .populate('rigs', 'name dayPrice isDeleted')
        .populate('consumables.consumable', 'name amount sellingPrice isDeleted')
        .populate({
            path: 'client',
            select: 'name phoneNumber passport birthDate isDeleted allOrders',
            populate: {
                path: 'discount',
                select: 'name amount'
            }
        })
        .populate('createdBy', 'login role')
        .then(items => res.status(200).json(items))
        .catch(error => console.log(error))

const add = (req, res) => {
    if (
        !validation.validateContractNumber(req.body.contractNumber) &&
        !validation.validateDescription(req.body.description) &&
        !validation.validatePledge(req.body.paidPledge)
    ) {
        const order = new Order({
            ...req.body,
            createdBy: req.userID
        })
        order.save()
            .then(order => {
                req.body.client && Client.findById(req.body.client)
                    .then(client => {
                        client.allOrders = client.allOrders + 1
                        client.activeOrders = client.activeOrders + 1
                        client.save()
                            .catch(error => console.log(error))
                    }).catch(error => console.log(error))
                req.body.consumables.forEach(consumable => {
                    Consumable.findById(consumable.consumable._id)
                        .then(item => {
                            item.amount -= consumable.amount
                            item.save()
                                .catch(error => console.log(error))
                        })
                })
                Order.findById(order._id)
                    .populate('tools', 'name dayPrice hourPrice workShiftPrice isDeleted count')
                    .populate('rigs', 'name dayPrice isDeleted')
                    .populate('consumables.consumable', 'name amount sellingPrice isDeleted')
                    .populate({
                        path: 'client',
                        select: 'name phoneNumber passport birthDate isDeleted allOrders',
                        populate: {
                            path: 'discount',
                            select: 'name amount'
                        }
                    })
                    .populate('createdBy', 'login role')
                    .then(order => res.status(200).json(order))
                    .catch(error => res.status(500).json(error))
            })
            .catch(error => res.status(500).json(error))
    } else {
        res.status(400).json()
    }
}

const edit = (req, res) => {
    if (
        !validation.validateContractNumber(req.body.contractNumber || '1') &&
        !validation.validateDescription(req.body.description) &&
        !validation.validatePledge(req.body.paidPledge || 0)
    ) {
        Order.findById(req.body._id)
            .then(item => {
                req.body.consumables && req.body.consumables.forEach((consumable, index) => {
                    Consumable.findById(consumable.consumable._id)
                        .then(consumableItem => {
                            consumableItem.amount -= consumable.amount - item.consumables[index].amount
                            consumableItem.save()
                                .catch(error => console.log(error))
                        })
                })
                Order.findByIdAndUpdate(req.body._id, req.body, { new: true })
                    .populate('tools', 'name dayPrice hourPrice workShiftPrice isDeleted count')
                    .populate('rigs', 'name dayPrice isDeleted')
                    .populate('consumables.consumable', 'name amount sellingPrice isDeleted')
                    .populate({
                        path: 'client',
                        select: 'name phoneNumber passport birthDate isDeleted allOrders',
                        populate: {
                            path: 'discount',
                            select: 'name amount'
                        }
                    })
                    .populate('createdBy', 'login role')
                    .then(newOrder => {
                        if (!item.finishDate && req.body.finishDate && req.body.client) {
                            Client.findOne({ _id: req.body.client })
                                .then(client => {
                                    client.activeOrders = client.activeOrders - 1
                                    client.save()
                                        .then(() => res.status(200).json(newOrder))
                                        .catch(error => console.log(error))
                                }).catch(error => console.log(error))
                        }
                        res.status(200).json(newOrder)
                    })
                    .catch(error => res.status(500).json(error))
            })
            .catch(error => res.status(500).json(error))
    } else {
        res.status(400).json()
    }
}

const deleteOrder = (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(item => {
            item.client && Client.findById(item.client)
                .then(client => {
                    !item.finishDate && (client.activeOrders = client.activeOrders - 1)
                    client.allOrders = client.allOrders - 1
                    client.save()
                        .then(() => res.status(200).json())
                        .catch(error => console.log(error))
                })
                .catch(error => res.status(500).json(error))
        })
        .catch(error => res.status(500).json(error))
}

const getContractNumber = (req, res) =>
    Order.find()
        .then(items => res.status(200).json(String(parseFloat(items[items.length - 1].contractNumber || 0) + 1)))
        .catch(error => res.status(500).json(error))

const getCSVHistory = (req, res) => {
    const { startDate, endDate } = req.params

    Order.find()
        .populate('client', 'name phoneNumber')
        .populate('tools', 'name')
        .then(items => items.filter(item => new Date(item.startDate) > new Date(startDate) && new Date(item.startDate) < new Date(endDate)))
        .then(items => {
            let data = items.map(item => {
                let toolsString = ''
                item.tools.forEach(i => toolsString += i.name + ', ')
                toolsString = toolsString.slice(0, -2)
                
                const start = new Date(item.startDate)
                let sdd = start.getDate()
                let smm = start.getMonth() + 1

                if (sdd < 10)
                    sdd = '0' + sdd
                if (smm < 10)
                    smm = '0' + smm

                const finish = new Date(item.finishDate)
                let fdd = finish.getDate()
                let fmm = finish.getMonth() + 1

                if (fdd < 10)
                    fdd = '0' + fdd
                if (fmm < 10)
                    fmm = '0' + fmm

                return {
                    toolName: toolsString,
                    startDate: `${sdd}.${smm}.${start.getFullYear()}`,
                    finishDate: `${fdd}.${fmm}.${finish.getFullYear()}`,
                    clientName: item.client && item.client.name,
                    phoneNumber: item.client && item.client.phoneNumber,
                }
            })
            const fields = [
                {
                    label: 'Название инструментов',
                    value: 'toolName',
                },
                {
                    label: 'Начало аренды',
                    value: 'startDate',
                },
                {
                    label: 'Конец аренды',
                    value: 'finishDate',
                },
                {
                    label: 'Имя клиента',
                    value: 'clientName',
                },
                {
                    label: 'Номер телефона',
                    value: 'phoneNumber',
                },
            ]

            try {
                const parser = new Parser({ fields })
                res.writeHead(200, {
                    'Content-Disposition': 'attachment; filename=history.csv',
                })
                res.end(parser.parse(data))
            } catch (error) {
                res.status(500).json(error)
            }
            
        })
}

export default {
    get,
    add,
    edit,
    delete: deleteOrder,
    getActive,
    getContractNumber,
    getCSVHistory,
}