import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

import fs from 'fs'
import path from 'path'

import { getMonth } from '../utils/index'

const get = (req, res) => {
    const { date, clientName, passport, tools, inventoryNumbers, phoneNumber, contractNumber } = req.query
    const content = fs
        .readFileSync(path.resolve(path.dirname(path.dirname(__dirname)), 'public/contract.docx'), 'binary')

    var zip = new PizZip(content)
    var doc = new Docxtemplater()
    doc.loadZip(zip)

    const toolArr = JSON.parse(tools)
    const inventoryNumberArr = JSON.parse(inventoryNumbers)
    const dateObj = new Date(date)
    doc.setData({
        dateHours: dateObj.getHours(),
        dateMinutes: dateObj.getMinutes(),
        dateDay: dateObj.getDate(),
        dateMonth: getMonth(dateObj.getMonth()),
        dateYear: dateObj.getFullYear(),
        clientName: clientName || '',
        phoneNumber: phoneNumber || '',
        contractNumber,
        series: passport.slice(0, 4),
        number: passport.slice(4),
        tools: toolArr.map((item, index) => { return {
            index: index + 1,
            name: item.name,
            price: item.price || '',
            inventoryNumber: inventoryNumberArr[index] || '',
            workingPrice: item.dayPrice || item.workShiftPrice || '',
            pledge: item.pledge || '',
        } }),
        pledgeSum: toolArr.reduce((sum, item) => sum + item.pledge, 0) || '',
        priceSum: toolArr.reduce((sum, item) => sum + item.price, 0) || ''
    })

    try {
        doc.render()
        var buf = doc.getZip()
            .generate({ type: 'nodebuffer' })

        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename=contract.docx',
            'Content-Length': buf.length
        })
        res.end(buf)
    }
    catch (error) {
        res.status(500).json(JSON.stringify({ error: {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        } }))
    }
}

export default {
    get,
}