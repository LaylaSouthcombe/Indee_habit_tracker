const Carer = require('../models/Carer');
const User = require('../models/User');

async function getAssociatedUsers(req, res) {
    try {
        const carers = await Carer.getUsersAndTopline(req.body)
        res.status(200).json(carers);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function addUserAsDependent(req, res) {
    try {
        const userNewCarerId = await User.addUserAsDependent(req.body.userId, req.body.carerId)
        res.status(200).json(userNewCarerId);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { getAssociatedUsers, addUserAsDependent }