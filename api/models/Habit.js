const db = require('../dbConfig/init');

// const Author = require('./Author');

module.exports = class Habit {
    constructor(data){
        this.id = data.id;
        this.user_id = data.user_id;
        this.type = data.type;
        this.description = data.description;
        this.freq_unit = data.freq_unit;
        this.freq_value = data.freq_value;
        this.goal = data.goal;
        this.streak = data.streak;
    };

    static get all(){
        return new Promise (async (resolve, reject) => {
            try {
                const habitData = await db.query('SELECT * FROM habits_info;');
                const habits = habitData.rows.map(b => new Habit(b));
                resolve(habits);
            } catch (err) {
                reject('habit not found');
            }
        });
    };

    
    
    static findById(id){
        return new Promise (async (resolve, reject) => {
            try {
                console.log(id)
                let habitData = await db.query(`SELECT * FROM habits_info WHERE id = $1;`, [ id ]);
                console.log(habitData.rows)
                let habit = new Habit(habitData.rows[0]);
                resolve (habit);
            } catch (err) {
                reject('habit not found');
            }
        });
    };
    
    static async create(habitData){
        return new Promise (async (resolve, reject) => {
            try {
                const { user_id, type, description, freq_unit, freq_value, goal } = habitData;
                let result = await db.query(`INSERT INTO habits_info (user_id, type, description, freq_unit, freq_value, goal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [ user_id, type, description, freq_unit, freq_value, goal])
                resolve (result.rows[0]);
            } catch (err) {
                reject('habit could not be created');
            }
        });
    };
    static async update(habitData){
        return new Promise (async (resolve, reject) => {
            try {
                const { user_id, type, description, freq_unit, freq_value, goal, id } = habitData;
                let result = await db.query(`UPDATE habits_info SET user_id = $1, type = $2, description = $3, freq_unit = $4, freq_value = $5, goal = $6 WHERE id = $7 RETURNING *;`, [ user_id, type, description, freq_unit, freq_value, goal, id])
                resolve (result.rows[0]);
            } catch (err) {
                reject('habit could not be updated');
            }
        });
    };

    destroy(){
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query('DELETE FROM habits_info WHERE id = $1;', [ this.id ]);
                resolve('habit was deleted')
            } catch (err) {
                reject('habit could not be deleted')
            }
        })
    };
};