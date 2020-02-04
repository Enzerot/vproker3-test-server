import Client from '../database/clientSchema'
import Order from '../database/orderSchema'
import Passport from '../database/passportSchema'
import validation from '../utils/validation'
import { checkDebtToken, checkDebtBaseURL } from '../config'
import axios from 'axios'
import { getRegion } from '../utils'

const get = (req, res) => {
    Client.find({ isDeleted: { $ne: true } })
        .populate('discount', 'name')
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json(error))
}

const add = (req, res) => {
    if (
        !validation.validateName(req.body.name) &&
        !validation.validatePhoneNumber(req.body.phoneNumber) &&
        !validation.validatePassport(req.body.passport) &&
        !validation.validateDescription(req.body.description)
    ) {
        const client = new Client(req.body)
        client.save()
            .then(item => res.status(200).json(item))
            .catch(error => res.status(500).json(error))
    } else {
        res.status(400).json()
    }
}

const edit = (req, res) => {
  if (
    !validation.validateName(req.body.name) &&
    !validation.validatePhoneNumber(req.body.phoneNumber) &&
    !validation.validatePassport(req.body.passport) &&
    !validation.validateDescription(req.body.description)
  ) {
    Client.findByIdAndUpdate(req.body._id, req.body, { new: true })
        .then(item => res.status(200).json(item))
        .catch(error => res.status(500).json(error))
  } else {
    res.status(400).json()
  }
}

const deleteClient = (req, res) => {
    Order.find({ client: req.params.id })
        .then(items => {
            !items.length && Client.findByIdAndDelete(req.params.id)
                .then(() => res.status(200).json())
                .catch(error => res.status(500).json(error))
            Client.findByIdAndUpdate(req.params.id, { isDeleted: true })
                .then(() => res.status(200).json())
                .catch(error => res.status(500).json(error))
        })
        .catch(error => res.status(500).json(error))
}

const addToBlackList = (req, res) => {
    Client.findByIdAndUpdate(req.params.id, { isClientInBlackList: true })
        .then(res.status(200).json())
        .catch(error => res.status(500).json(error))
}

const removeFromBlackList = (req, res) => {
    Client.findByIdAndUpdate(req.params.id, { isClientInBlackList: false })
        .then(res.status(200).json())
        .catch(error => res.status(500).json(error))
}

const getByPhoneNumber = (req, res) => {
  Client.findOne({ phoneNumber: req.params.phoneNumber })
    .then(item => {
        res.status(200).json(item && {
            _id: item._id,
            name: item.name,
            passport: item.passport,
            allOrders: item.allOrders,
            activeOrders: item.activeOrders,
            isClientInBlackList: item.isClientInBlackList,
            birthDate: item.birthDate,
        })
    })
    .catch(error => res.status(500).json(error))
}

const getByName = (req, res) => {
  Client.findOne({ name: req.params.name })
    .then(item => {
        res.status(200).json({
            _id: item._id,
            phoneNumber: item.phoneNumber,
            passport: item.passport,
            allOrders: item.allOrders,
            activeOrders: item.activeOrders,
            isClientInBlackList: item.isClientInBlackList,
            birthDate: item.birthDate,
        })
    })
    .catch(error => res.status(500).json(error))
}

const getByPassport = (req, res) => {
  Client.findOne({ passport: req.params.passport })
    .then(item => {
        res.status(200).json({
            _id: item._id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            allOrders: item.allOrders,
            activeOrders: item.activeOrders,
            isClientInBlackList: item.isClientInBlackList,
            birthDate: item.birthDate,
        })
    })
    .catch(error => res.status(500).json(error))
}

const validatePassport = (req, res) => {
    const { passport } = req.params

    Passport.findOne({ series: passport.slice(0, 4), number: passport.slice(4, 10) })
        .then(item => item ? res.status(200).json('Паспорт недействителен') : res.status(200).json('Всё в порядке'))
        .catch(error => res.status(500).json(error))
}

const checkDebt = (req, mainRes) => {
    const { name, passport, birthDate } = req.query

    const nameArray = name.split(' ')
    nameArray.length < 3 && mainRes.status(400).json()

    const region = getRegion(passport)
    !region && mainRes.status(400).json()

    axios.get(`${checkDebtBaseURL}/search/physical`, {
        params: {
            token: checkDebtToken,
            region,
            firstname: nameArray[1],
            lastname: nameArray[0],
            secondname: nameArray[2],
            birthdate: birthDate,
        },
    }).then(res => {
        res.data.status !== 'success' && mainRes.status(400).json()

        const { task } = res.data.response

        const cb = () => {
            try {
                axios.get(`${checkDebtBaseURL}/result`, {
                    params: {
                        token: checkDebtToken,
                        task,
                    }
                }).then(res => {
                    if (res.data.response.status === 0) {
                        mainRes.status(200).json(!!res.data.response.result[0].result.length)
                        clearInterval(iid)
                    } else if (res.data.response.status === 3) {
                        mainRes.status(400).json()
                        clearInterval(iid)
                    } else if (res.data.response.status !== 2) {
                        mainRes.status(500).json()
                    }
                }).catch(error => {
                    clearInterval(iid)
                    if (error.response && error.response.data.code === 429) {
                        let waitTill = new Date(new Date().getTime() + 5 * 1000)
                        while(waitTill > new Date()){}
                        iid = setInterval(cb, 1000)
                    } else
                        mainRes.status(500).json()
                })
            } catch (error) {
                console.log(error)
            }
        }
        let iid = setInterval(cb, 1000)
    }).catch(error =>
        mainRes.status(500).json(error))
}

export default {
    get,
    add,
    edit,
    delete: deleteClient,
    getByName,
    getByPhoneNumber,
    getByPassport,
    validatePassport,
    checkDebt,
    addToBlackList,
    removeFromBlackList,
}