const Int = require('../models/Int_entry');

async function update (req, res) {
    try {
        const int = await Int.update(req.body);
        res.status(200).json(int)
    } catch (err) {
        res.status(422).json({err})
    }
}

module.exports = { update }
