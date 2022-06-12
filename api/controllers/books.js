const Book = require('../models/Book');

async function index (req, res) {
    try {
        const books = await Book.all;
        res.status(200).json(books)
    } catch (err) {
        res.status(500).json({err})
    }
}

async function show (req, res) {
    try {
        const book = await Book.findById(req.params.id);
        res.status(200).json(book)
    } catch (err) {
        res.status(404).json({err})
    }
}

async function create (req, res) {
    try {
        const book = await Book.create(req.body);
        res.status(200).json(book)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function destroy (req, res) {
    try {
        const book = await Book.findById(req.params.id);
        await book.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(404).json({err});
    };
}

module.exports = { index, show, create, destroy }
