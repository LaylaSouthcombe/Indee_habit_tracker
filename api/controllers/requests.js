const 
Request = require('../models/Request');

async function index(req, res) {
    try {
        // const authors = [];
        const requests = await Request.all
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { index }