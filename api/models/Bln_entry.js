const db = require('../dbConfig/init');

module.exports = class Bln {
    constructor(data){
        this.id = data.id;
        this.habit_bln_id = data.habit_bln_id
        this.habit_bln_entry = data.habit_bln_entry;
        this.date = data.date;
    };
    
    static async update({id, habit_bln_entry}){
        return new Promise (async (resolve, reject) => {
            try {
                let result = await db.query(`UPDATE boolean_entries SET habit_bln_entry = $1 WHERE id = $2 RETURNING *;`, [ habit_bln_entry, id ])
                resolve (result.rows[0]);
            } catch (err) {
                reject('Bln habit entry could not be updated');
            }
        });
    };
};