const Request = require('../models/Request');

async function index(req, res) {
    try {
        const requests = await Request.getAllRequests(req.body)
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function respondToCarerRequest(req, res) {
    try {
        let requests
        if(req.body.responseType === "accept"){
            requests = await Request.acceptCarerRequest(req.body.request_id)
        }
        if(req.body.responseType === "decline"){
            requests = await Request.declineCarerRequest(req.body.request_id)
        }
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function deleteCarerRequest(req, res) {
    try {
        let response = await Request.deleteCarerRequest(req.body.user_id, req.body.request_id)
        res.status(200).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { index, respondToCarerRequest, deleteCarerRequest }