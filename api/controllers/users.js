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

// async function show(req, res) {
//     try {
//         const user = await User.findById(req.params.id);
//         const books = await author.books;
//         res.status(200).json({ ...author, books });
//     } catch (err) {
//         res.status(500).send(err);
//     };
// }

module.exports = { index }