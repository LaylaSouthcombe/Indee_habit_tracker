const db = require('../dbConfig/init');

// const Author = require('./Author');

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

    
    
    // static findById(id){
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             let habitData = await db.query(`SELECT habits_info.*, authors.name as author_name
    //                                                 FROM habits_info 
    //                                                 JOIN users ON habits_info.user_id = users.id
    //                                                 WHERE habits_info.id = $1;`, [ id ]);
    //             let habit = new Habit(habitData.rows[0]);
    //             resolve (habit);
    //         } catch (err) {
    //             reject('habit not found');
    //         }
    //     });
    // };
    
    // static async create(habitData){
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             const { title, yearOfPublication, abstract, authorName} = habitData;
    //             let author = await Author.findOrCreateByName(authorName);
    //             let result = await db.query(`INSERT INTO habits_info (title, year_of_publication, abstract, author_id) VALUES ($1, $2, $3, $4) RETURNING*;`, [ title, yearOfPublication, abstract, author.id])
    //             resolve (result.rows[0]);
    //         } catch (err) {
    //             reject('habit could not be created');
    //         }
    //     });
    // };

    // destroy(){
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const result = await db.query('DELETE FROM habits WHERE id = $1 RETURNING author_id', [ this.id ]);
    //             const author = await Author.findById(result.rows[0].author_id);
    //             const habits = await author.habits;
    //             if(!habits.length){await author.destroy()}
    //             resolve('habit was deleted')
    //         } catch (err) {
    //             reject('habit could not be deleted')
    //         }
    //     })
    // };
};