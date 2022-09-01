const db = require('../dbConfig/init');

module.exports = class Request {
    constructor(data){
        this.id = data.id;
        this.user_id = data.user_id;
        this.carer_id = data.carer_id;
        this.status = data.status;
    };
    
    static get all(){ 
        return new Promise (async (resolve, reject) => {
            try {
                // console.log(db);
                const result = await db.query('SELECT * FROM requests;')
                const requests = result.rows.map(a => new Request(a))
                resolve(requests);
            } catch (err) {
                reject("Error retrieving requests")
            }
        })
    };
    static async getAllRequests(userInfo){
        //need to change this
        return new Promise (async (resolve, reject) => {
            try {
                console.log("userInfo", userInfo)
                const { userId, role } = userInfo
                let results
                if(role === "carer"){
                    results = await db.query(`SELECT requests.id, requests.carer_id, requests.user_id, requests.date, requests.status, users.first_name, users.second_name FROM requests JOIN users ON requests.user_id = users.id WHERE requests.carer_id = $1;`, [userId])
                }
                if(role === "user"){
                    results = await db.query(`SELECT requests.id, requests.carer_id, requests.user_id, requests.date, requests.status, carers.first_name, carers.second_name FROM requests JOIN carers ON requests.carer_id = carers.id WHERE requests.user_id = $1;`, [userId])
                }
                console.log(results.rows)
                resolve(results.rows);
            } catch (err) {
                reject("Error retrieving requests")
            }
        })
    }
    static async addNewRequest(request_id){
        //need to change this
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('SELECT * FROM requests WHERE id = $1;', [request_id])
                const carer_id = result.rows[0].carer_id
                const user_id = result.rows[0].user_id
                await db.query('UPDATE requests SET status = $2 WHERE id = $1;', [request_id, "accepted"])
                const updatedUser = await db.query(`UPDATE users SET carer_id = $1 WHERE id = $2 RETURNING *;`, [ carer_id, user_id])
                // console.log(updatedUser.rows)
                resolve("Request accepted");
            } catch (err) {
                reject("Error retrieving requests")
            }
        })
    }
    static async acceptCarerRequest(request_id){
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('SELECT * FROM requests WHERE id = $1;', [request_id])
                const carer_id = result.rows[0].carer_id
                const user_id = result.rows[0].user_id
                await db.query('UPDATE requests SET status = $2 WHERE id = $1;', [request_id, "accepted"])
                const updatedUser = await db.query(`UPDATE users SET carer_id = $1 WHERE id = $2 RETURNING *;`, [ carer_id, user_id])
                console.log(updatedUser.rows[0])
                resolve("Request accepted");
            } catch (err) {
                reject("Error retrieving requests")
            }
        })
    }
    static async declineCarerRequest(request_id){
        return new Promise (async (resolve, reject) => {
            try {
                await db.query('UPDATE requests SET status = $2 WHERE id = $1;', [request_id, "declined"])
                resolve("Request declined");
            } catch (err) {
                reject("Error retrieving requests")
            }
        })
    }
    static async deleteCarerRequest(request_id){
        return new Promise (async (resolve, reject) => {
            try {
                await db.query('DELETE FROM requests WHERE id = $1;', [request_id])
                resolve("Request deleted");
            } catch (err) {
                reject("Error retrieving requests")
            }
        })
    }

//to add:
//check status
};