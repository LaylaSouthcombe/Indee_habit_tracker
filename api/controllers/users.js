const User = require('../models/User');

async function index(req, res) {
    try {
        // const authors = [];
        const users = await User.all
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(err);
    }
}
async function findByEmailOrName(req, res) {
    try {
        // const authors = [];
        console.log(req.body)
        const users = await User.findUsersByNameOrEmail(req.body.searchTerm, req.body.carerId)
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(err);
    }
}
async function findUsersSummary(req, res) {
    try {
        // const authors = [];
        console.log(req.body)
        const info = await User.findUsersSummary(req.body)
        res.status(200).json(info);
    } catch (err) {
        res.status(500).send(err);
    }
}
async function findUsersIndividualHabitsSummary(req, res) {
    try {
        // const authors = [];
        console.log(req.body)
        const info = await User.findUsersIndividualHabitsSummary(req.body)
        res.status(200).json(info);
    } catch (err) {
        res.status(500).send(err);
    }
}

// async function show(req, res) {
//     try {
//         const user = await User.findById(req.params.id);
//         const books = await author.books;
//         res.status(200).json({ ...author, books });
//     } catch (err) {
//         res.status(500).send(err);
//     };
// }

module.exports = { index, findByEmailOrName, findUsersSummary, findUsersIndividualHabitsSummary }