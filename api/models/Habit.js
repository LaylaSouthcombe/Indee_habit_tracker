const db = require('../dbConfig/init');

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

    static getUsersHabitsAndCurrent(user_id){
        return new Promise (async (resolve, reject) => {
            try {
                const blnHabitData = await db.query('SELECT * FROM habits_info JOIN boolean_entries ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 AND type = $2 AND date = CURRENT_DATE ORDER BY (date) DESC;', [ user_id, "boolean" ]);
                const intHabitData = await db.query('SELECT * FROM habits_info JOIN int_entries ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1 AND type = $2 AND date = CURRENT_DATE ORDER BY (date) DESC;', [ user_id, "int" ]);
                let habitsData = blnHabitData.rows.concat(intHabitData.rows)
                resolve(habitsData);
            } catch (err) {
                reject('habits not found');
            }
        });
    };
    
    static async create(habitData){
        return new Promise (async (resolve, reject) => {
            try {
                const { user_id, type, description, freq_unit, freq_value, goal } = habitData;
                let result = await db.query(`INSERT INTO habits_info (user_id, type, description, freq_unit, freq_value, goal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [ user_id, type, description, freq_unit, freq_value, goal])
                if(type === "int"){
                    const newEntry = await db.query(`INSERT INTO int_entries (habit_int_id, habit_int_entry) VALUES ($1, 0) RETURNING *;`, [result.rows[0].id]);
                    console.log("data entered for int habit", newEntry.rows)
                }
                if(type === "boolean"){
                    await db.query(`INSERT INTO boolean_entries (habit_bln_id, habit_bln_entry) VALUES ($1, false);`, [result.rows[0].id]);
                    console.log("data entered for bln habit", result.rows[0].id)
                }
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
                let habitInfoId
                if(type === "int"){
                    let habitInfoIdResult = await db.query(`SELECT * FROM int_entries WHERE id = $1;`, [ id ])
                    habitInfoId = habitInfoIdResult.rows[0].habit_int_id
                }
                if(type === "boolean"){
                    let habitInfoIdResult = await db.query(`SELECT * FROM boolean_entries WHERE id = $1;`, [ id ])
                    habitInfoId = habitInfoIdResult.rows[0].habit_bln_id
                }
                let initialHabitInfo = await db.query(`SELECT * FROM habits_info WHERE id = $1;`, [habitInfoId])
                let result = await db.query(`UPDATE habits_info SET user_id = $1, type = $2, description = $3, freq_unit = $4, freq_value = $5, goal = $6 WHERE id = $7 RETURNING *;`, [ user_id, type, description, freq_unit, freq_value, goal, habitInfoId]) 
                if(type !== initialHabitInfo.rows[0].type){
                    if(type === "int"){
                        await db.query(`INSERT INTO int_entries (habit_int_id) VALUES ($1);`, [habitInfoId]);
                        let deletedEntry = await db.query(`DELETE FROM boolean_entries WHERE id = $1 RETURNING *;`, [id]);
                    }
                    if(type === "boolean"){
                        await db.query(`INSERT INTO boolean_entries (habit_bln_id) VALUES ($1);`, [habitInfoId]);
                        await db.query(`DELETE FROM int_entries WHERE id = $1;`, [id]);
                    }
                }
                resolve (result.rows[0]);
            } catch (err) {
                reject('habit could not be updated');
            }
        });
    };

    static async destroy(habitData){
        return new Promise(async (resolve, reject) => {
            try {
                const { habit_id, type } = habitData
                let habitInfoId
                if(type === "int"){
                    let habitInfoIdResult = await db.query(`SELECT * FROM int_entries WHERE id = $1;`, [ habit_id ])
                    habitInfoId = habitInfoIdResult.rows[0].habit_int_id
                    await db.query('DELETE FROM int_entries WHERE habit_int_id = $1;', [ habitInfoId ]);
                }
                if(type === "boolean"){
                    let habitInfoIdResult = await db.query(`SELECT * FROM boolean_entries WHERE id = $1;`, [ habit_id ])
                    habitInfoId = habitInfoIdResult.rows[0].habit_bln_id
                    
                    await db.query('DELETE FROM boolean_entries WHERE habit_bln_id = $1;', [ habitInfoId ]);
                }
                await db.query('DELETE FROM habits_info WHERE id = $1;', [ habitInfoId ]);
                resolve('habit was deleted')
            } catch (err) {
                reject('habit could not be deleted')
            }
        })
    };
};