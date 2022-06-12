const Bln = require('../models/Bln_entry');

async function index (req, res) {
    try {
        const blns = await Bln.all;
        res.status(200).json(blns)
    } catch (err) {
        res.status(500).json({err})
    }
}

async function show (req, res) {
    try {
        const bln = await Bln.findById(req.params.id);
        res.status(200).json(bln)
    } catch (err) {
        res.status(404).json({err})
    }
}

async function create (req, res) {
    try {
        const bln = await Bln.create(req.body);
        res.status(200).json(bln)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function destroy (req, res) {
    try {
        const bln = await Bln.findById(req.params.id);
        await bln.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(404).json({err});
    };
}

module.exports = { index, show, create, destroy }
