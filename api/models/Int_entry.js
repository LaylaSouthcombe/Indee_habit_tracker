const db = require('../dbConfig/init');

module.exports = class Int {
    constructor(data){
        this.id = data.id;
        this.habit_int_id = data.habit_int_id
        this.habit_int_entry = data.habit_int_entry;
        this.date = data.date;
    };

    static async update({id, habit_int_entry}){
        return new Promise (async (resolve, reject) => {
            try {
                let result = await db.query(`UPDATE int_entries SET habit_int_entry = $1 WHERE id = $2 RETURNING *;`, [ habit_int_entry, id])
                let goal = await db.query(`SELECT goal FROM habits_info WHERE id = $1;`, [ result.rows[0].habit_int_id ])
                resolve ({goal: goal.rows[0].goal, entry: result.rows[0]});
            } catch (err) {
                reject('Int habit entry could not be updated');
            }
        });
    };
};