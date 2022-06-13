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


//to add:
//check status
};