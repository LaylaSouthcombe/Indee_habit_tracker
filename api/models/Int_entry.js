const db = require('../dbConfig/init');

// const Author = require('./Author');

module.exports = class Int {
    constructor(data){
        this.id = data.id;
        this.habit_int_id = data.habit_int_id
        this.habit_int_entry = data.habit_int_entry;
        this.date = data.date;
        
    };

    static get all(){
        return new Promise (async (resolve, reject) => {
            try {
                const intData = await db.query('SELECT * FROM int_entries;');
                const ints = intData.rows.map(b => new Int(b));
                resolve(ints);
            } catch (err) {
                reject('Int entry not found');
            }
        });
    };

    static async create(habit_int_id, habit_int_entry){
        return new Promise (async (resolve, reject) => {
            try {
                let result = await db.query(`INSERT INTO int_entries (habit_int_id, habit_int_entry) VALUES ($1, $2) RETURNING*;`, [ habit_int_id, habit_int_entry])
                resolve (result.rows[0]);
            } catch (err) {
                reject('Int habit entry could not be created');
            }
        });
    };
    static async update(id, habit_int_entry){
        return new Promise (async (resolve, reject) => {
            try {
                let result = await db.query(`UPDATE int_entries SET habit_int_entry = $1 WHERE id = $2 RETURNING *;`, [ id, habit_int_entry])
                resolve (result.rows[0]);
            } catch (err) {
                reject('Int habit entry could not be updated');
            }
        });
    };
};