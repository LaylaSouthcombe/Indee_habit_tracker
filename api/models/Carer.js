const db = require('../dbConfig/init');
const User = require('./User');

module.exports = class Carer {
    constructor(data){
        this.id = data.id;
        this.first_name = data.first_name;
        this.second_name = data.second_name;
        this.password_digest = data.password_digest;
        this.email = data.email;
    };
    
    static get all(){ 
        return new Promise (async (resolve, reject) => {
            try {
                // console.log(db);
                const result = await db.query('SELECT * FROM carers;')
                const carers = result.rows.map(a => new Carer(a))
                resolve(carers);
            } catch (err) {
                reject("Error retrieving carers")
            }
        })
    };

    static async create( first_name, second_name, email, password_digest) {
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('INSERT INTO carers (first_name, second_name, password_digest, email) VALUES ($1, $2, $3, $4 RETURNING *;', [first_name, second_name, password_digest, email])
                const carer = new Carer(result.rows[0]);
                resolve(carer)
            }catch(err){
                reject("Carer account could not be created");
            }
        })
    }

    static async getUsersAndTopline(id){
        return new Promise (async (resolve, reject) => {
            try {
                let dataToDisplay = []
                //find users associated with a carer
                const results = await db.query('SELECT * FROM carers JOIN users on carers.id = users.carer_id WHERE carers.id = $1', [id]);

                for(let i = 0; i < results.rows.length; i++){
                    //find how many habits they are tracking
                    let habits = await db.query('SELECT * FROM habits_info WHERE user_id = $1', [results.rows[i].id]);
                    let habitTotalNum = habits.rows.length;
                    //find out how many int entries are complete
                    let intEntries = await db.query('SELECT * FROM int_entries JOIN habits_info ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1', [results.rows[i].id]);
                    let intHabitsCompleted = 0;
                    for(let i = 0; i < intEntries.rows.length; i++){
                        if(intEntries.rows[i].habit_int_entry >= intEntries.rows[i].goal){
                            intHabitsCompleted += 1;
                        }
                    } 
                    //find out how many bln entries are complete
                    let blnEntries = await db.query('SELECT * FROM boolean_entries JOIN habits_info ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1', [results.rows[i].id]);
                    let blnHabitsCompleted = 0;
                    for(let i = 0; i < blnEntries.rows.length; i++){
                        if(blnEntries.rows[i].habit_bln_entry = true){
                            blnHabitsCompleted += 1;
                        }
                    }
                                       
                    //turn to a percent
                    let totalHabitsCompleted = intHabitsCompleted + blnHabitsCompleted
                    let percentCompleted = (totalHabitsCompleted / habitTotalNum) * 100
                    //send back add object to array
                    let obj = { "userFirstName": results.rows[i].first_name, "userSecondName": results.rows[i].
                    second_name, "percentCompleted": percentCompleted, "user_id": results.rows[i].id}
                    dataToDisplay.push(obj)
                }
                resolve(dataToDisplay);
            } catch (err) {
                reject("Carer's users and user info could not be found");
            };
        });
    };

    
    



    destroy(){
        return new Promise(async(resolve, reject) => {
            try {
                const result = await db.query('DELETE FROM carers WHERE id = $1 RETURNING id', [ this.id ]);
                resolve(`carer ${result.id} was deleted`)
            } catch (err) {
                reject('carer could not be deleted')
            }
        })   
    }
};