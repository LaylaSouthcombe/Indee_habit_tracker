const Request = require('../models/Request');

async function index(req, res) {
    try {
        // const authors = [];
        const requests = await Request.getAllRequests(req.body)
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}

// async function acceptTheCarerRequest(req, res) {
//     try {
//         const requests = await Request.acceptCarerRequest(req.body.request_id)
//         res.status(200).json(requests);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }

// async function declineCarerRequest(req, res) {
//     try {
//         const requests = await Request.declineCarerRequest(req.body.request_id)
//         res.status(200).json(requests);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }

async function respondToCarerRequest(req, res) {
    try {
        const responseType = req.responseType
        let requests
        if(responseType === "accept"){
            requests = await Request.acceptCarerRequest(req.body.request_id)
        }
        if(responseType === "decline"){
            requests = await Request.declineCarerRequest(req.body.request_id)
        }
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).send(err);
    }
}


module.exports = { index, respondToCarerRequest }