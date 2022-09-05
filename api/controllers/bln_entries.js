const Bln = require('../models/Bln_entry');

async function update (req, res) {
    try {
        const bln = await Bln.update(req.body);
        res.status(200).json(bln)
    } catch (err) {
        res.status(422).json({err})
    }
}

module.exports = { update }
