const Int = require('../models/Int_entry');

async function index (req, res) {
    try {
        const ints = await Int.all;
        res.status(200).json(ints)
    } catch (err) {
        res.status(500).json({err})
    }
}

async function show (req, res) {
    try {
        const int = await Int.findById(req.params.id);
        res.status(200).json(int)
    } catch (err) {
        res.status(404).json({err})
    }
}

async function create (req, res) {
    try {
        const int = await Int.create(req.body);
        res.status(200).json(int)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function update (req, res) {
    try {
        console.log(req.body)
        const int = await Int.update(req.body);
        console.log(int)
        res.status(200).json(int)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function destroy (req, res) {
    try {
        const int = await Int.findById(req.params.id);
        await int.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(404).json({err});
    };
}

module.exports = { index, show, create, update, destroy }
