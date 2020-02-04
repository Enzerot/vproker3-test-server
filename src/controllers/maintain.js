import Maintain from '../database/maintainSchema'
import validation from '../utils/validation'

const get = (req, res) => {
    if (req.role === 'admin') {
        Maintain.find()
            .populate('tool', 'name isDeleted')
            .populate('rig', 'name isDeleted')
            .populate('remindTo', 'name phoneNumber passport')
            .then(items => res.status(200).json(items))
            .catch(error => res.status(500).json(error))
    } else {
        Maintain.find({ finishDate: { "$in" : [null, undefined]} })
            .populate('tool', 'name isDeleted')
            .populate('rig', 'name isDeleted')
            .populate('remindTo', 'name phoneNumber passport')
            .then(items => res.status(200).json(items))
            .catch(error => res.status(500).json(error))
    }
}

const add = (req, res) => {
    if (
        !validation.validatePrice(req.body.price || 0) &&
        !validation.validateMaterials(req.body.materials) &&
        !validation.validateEngineHours(req.body.engineHours || 0)
    ) {
        const maintain = new Maintain(req.body)
        maintain.save()
            .then(() =>
                Maintain.findById(maintain._id)
                    .populate('tool', 'name')
                    .populate('rig', 'name isDeleted')
                    .populate('remindTo', 'name phoneNumber passport')
                    .then(newMaintain => res.status(200).json(newMaintain))
                    .catch(error => res.status(500).json(error)))
            .catch(error =>
                res.status(500).json(error))
    } else {
        res.status(400).json()
    }
}

const edit = (req, res) => {
    if (
        !validation.validatePrice(req.body.price || 0) &&
        !validation.validateMaterials(req.body.materials) &&
        !validation.validateEngineHours(req.body.engineHours || 0)
    ) {
        Maintain.findByIdAndUpdate(req.body._id, req.body, { new: true })
            .populate('tool', 'name isDeleted')
            .populate('rig', 'name isDeleted')
            .populate('remindTo', 'name phoneNumber passport')
            .then(item => res.status(200).json(item))
            .catch(error => res.status(500).json(error))
    } else {
        res.status(400).json()
    }
}

const deleteMaintain = (req, res) => {
    Maintain.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json())
        .catch(error => res.status(500).json(error))
}

export default {
    get,
    add,
    edit,
    delete: deleteMaintain
}