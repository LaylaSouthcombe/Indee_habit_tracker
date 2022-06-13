const Carer = require('../models/Carer');
const User = require('../models/User');

async function index(req, res) {
    try {
        // const authors = [];
        const carers = await Carer.all
        res.status(200).json(carers);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function getAssociatedUsers(req, res) {
    try {
        // const authors = [];
        const carers = await Carer.getUsersAndTopline(req.body.carer)

        res.status(200).json(carers);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function addUserAsDependent(req, res) {
    try {
        // const authors = [];
        const users = await User.findUsersByNameOrEmail(req.body.searchTerm)
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function getAssociatedUsersHabits(req, res) {
    try {

        const usersAndInfo = await Carer.all
        res.status(200).json(usersAndInfo);
    } catch (err) {
        res.status(500).send(err);
    }
}


// async function show(req, res) {
//     try {
//         const author = await Author.findById(req.params.id);
//         const books = await author.books;
//         res.status(200).json({ ...author, books });
//     } catch (err) {
//         res.status(500).send(err);
//     };
// }

module.exports = { index, getAssociatedUsers, addUserAsDependent, getAssociatedUsersHabits }