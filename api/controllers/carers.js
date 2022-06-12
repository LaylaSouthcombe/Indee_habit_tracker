const Carer = require('../models/Carer');

async function index(req, res) {
    try {
        // const authors = [];
        const carers = await Carer.all
        res.status(200).json(carers);
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

module.exports = { index }