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
    static getUsersHabitsAndCurrent(user_id){
        return new Promise (async (resolve, reject) => {
            try {
                // const blnHabitData = await db.query ('SELECT * FROM boolean_entries JOIN habits_info ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 AND date = CURRENT_DATE ORDER BY (date) DESC', [ user_id ])
                const blnHabitData = await db.query('SELECT * FROM habits_info JOIN boolean_entries ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 AND type = $2 AND date = CURRENT_DATE ORDER BY (date) DESC;', [ user_id, "boolean" ]);
                const intHabitData = await db.query('SELECT * FROM habits_info JOIN int_entries ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1 AND type = $2 AND date = CURRENT_DATE ORDER BY (date) DESC;', [ user_id, "int" ]);
                let habitsData = blnHabitData.rows.concat(intHabitData.rows)
                // console.log(habitsData)
                resolve(habitsData);
            } catch (err) {
                reject('habits not found');
            }
        });
    };
    
    
    static findById(id){
        return new Promise (async (resolve, reject) => {
            try {
                // console.log(id)
                let habitData = await db.query(`SELECT * FROM habits_info WHERE id = $1;`, [ id ]);
                // console.log(habitData.rows)
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
                console.log("habitData", habitData)
                const { user_id, type, description, freq_unit, freq_value, goal } = habitData;
                let result = await db.query(`INSERT INTO habits_info (user_id, type, description, freq_unit, freq_value, goal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [ user_id, type, description, freq_unit, freq_value, goal])
                console.log("create", result.rows[0])
                if(type === "int"){
                    const newEntry = await db.query(`INSERT INTO int_entries (habit_int_id) VALUES ($1) RETURNING *;`, [result.rows[0].id]);
                    console.log("data entered for int habit", newEntry.rows)
                }
                if(type === "boolean"){
                    await db.query(`INSERT INTO boolean_entries (habit_bln_id) VALUES ($1);`, [result.rows[0].id]);
                    console.log("data entered for bln habit", result.rows[0].id)
                }
                resolve (result.rows[0]);
            } catch (err) {
                reject('habit could not be created');
            }
        });
    };
//find habit and check type vs type in the form, and delete and reinsert into table if needed
//update entru also
    static async update(habitData){
        return new Promise (async (resolve, reject) => {
            try {
                console.log("habit data", habitData)
                const { user_id, type, description, freq_unit, freq_value, goal, id } = habitData;
                console.log("habit entry id", id)
                let habitInfoId
                if(type === "int"){
                    let habitInfoIdResult = await db.query(`SELECT * FROM int_entries WHERE id = $1;`, [ id ])
                    habitInfoId = habitInfoIdResult.rows[0].habit_int_id
                }
                if(type === "boolean"){
                    let habitInfoIdResult = await db.query(`SELECT * FROM boolean_entries WHERE id = $1;`, [ id ])
                    habitInfoId = habitInfoIdResult.rows[0].habit_bln_id
                }
                console.log("habitInfoId", habitInfoId)
                let initialHabitInfo = await db.query(`SELECT * FROM habits_info WHERE id = $1;`, [habitInfoId])
                console.log("initialHabitInfo.rows[0]", initialHabitInfo.rows[0])
                let result = await db.query(`UPDATE habits_info SET user_id = $1, type = $2, description = $3, freq_unit = $4, freq_value = $5, goal = $6 WHERE id = $7 RETURNING *;`, [ user_id, type, description, freq_unit, freq_value, goal, habitInfoId]) 
                console.log("result.rows", result.rows)
                if(type !== initialHabitInfo.rows[0].type){
                    if(type === "int"){
                        //delete most recent bln entry for that habit
                        //add int entry for habit
                        await db.query(`INSERT INTO int_entries (habit_int_id) VALUES ($1);`, [habitInfoId]);
                        console.log("data entered for int habit", habitInfoId)
                        let deletedEntry = await db.query(`DELETE FROM boolean_entries WHERE id = $1 RETURNING *;`, [id]);
                        console.log("deletedEntry", deletedEntry)
                    }
                    if(type === "boolean"){
                        //delete most recent int entry for that habit
                        //add bln entry for habit
                        await db.query(`INSERT INTO boolean_entries (habit_bln_id) VALUES ($1);`, [habitInfoId]);
                        console.log("data entered for bln habit", habitInfoId)
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
                    console.log("habitInfoIdResult", habitInfoIdResult.rows)
                    habitInfoId = habitInfoIdResult.rows[0].habit_int_id
                    await db.query('DELETE FROM int_entries WHERE habit_int_id = $1;', [ habitInfoId ]);
                    const remainingIntEntries = await db.query('SELECT * FROM int_entries;')
                    console.log("remainingIntEntries", remainingIntEntries.rows)
                }
                if(type === "boolean"){
                    let habitInfoIdResult = await db.query(`SELECT * FROM boolean_entries WHERE id = $1;`, [ habit_id ])
                    console.log("habitInfoIdResult", habitInfoIdResult.rows)
                    habitInfoId = habitInfoIdResult.rows[0].habit_bln_id
                    
                    await db.query('DELETE FROM boolean_entries WHERE habit_bln_id = $1;', [ habitInfoId ]);
                    const remainingBlnEntries = await db.query('SELECT * FROM boolean_entries;')
                    console.log("remainingBlnEntries", remainingBlnEntries.rows)
                }
                console.log(habitInfoId)
                await db.query('DELETE FROM habits_info WHERE id = $1;', [ habitInfoId ]);
                const remainingHabits = await db.query('SELECT * FROM habits_info;')
                console.log(remainingHabits.rows)
                resolve('habit was deleted')
            } catch (err) {
                reject('habit could not be deleted')
            }
        })
    };
};