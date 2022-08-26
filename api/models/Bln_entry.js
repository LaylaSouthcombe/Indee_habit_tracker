const db = require('../dbConfig/init');

const Habit = require('./Habit');

module.exports = class Bln {
    constructor(data){
        this.id = data.id;
        this.habit_bln_id = data.habit_bln_id
        this.habit_bln_entry = data.habit_bln_entry;
        this.date = data.date;
        
    };

    static get all(){
        return new Promise (async (resolve, reject) => {
            try {
                const blnData = await db.query('SELECT * FROM boolean_entries;');
                const blns = blnData.rows.map(b => new Bln(b));
                resolve(blns);
            } catch (err) {
                reject('Bln entry not found');
            }
        });
    };

    static async create(habit_bln_id, habit_bln_entry){
        return new Promise (async (resolve, reject) => {
            try {
                let result = await db.query(`INSERT INTO boolean_entries (habit_bln_id, habit_bln_entry) VALUES ($1, $2) RETURNING*;`, [ habit_bln_id, habit_bln_entry])
                resolve (result.rows[0]);
            } catch (err) {
                reject('Bln habit could not be created');
            }
        });
    };
    static async update({id, habit_bln_entry}){
        return new Promise (async (resolve, reject) => {
            try {
                let result = await db.query(`UPDATE boolean_entries SET habit_bln_entry = $1 WHERE habit_bln_id = $2 RETURNING *;`, [ habit_bln_entry, id ])
                resolve (result.rows[0]);
            } catch (err) {
                reject('Bln habit entry could not be updated');
            }
        });
    };
};