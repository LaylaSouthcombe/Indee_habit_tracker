const Request = require('../models/Request');

async function index(req, res) {
    try {
        // const authors = [];
        const requests = await Request.all
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function acceptTheCarerRequest(req, res) {
    try {
        // const authors = [];
        const requests = await Request.acceptCarerRequest(req.body.request_id)
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function declineCarerRequest(req, res) {
    try {
        // const authors = [];
        const requests = await Request.declineCarerRequest(req.body.request_id)
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}


module.exports = { index, acceptTheCarerRequest, declineCarerRequest }