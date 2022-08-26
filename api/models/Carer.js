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

    static async create( {fname, sname, email, password}) {
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('INSERT INTO carers (first_name, second_name, password_digest, email) VALUES ($1, $2, $3, $4) RETURNING *;', [fname, sname, password, email])
                const carer = new Carer(result.rows[0]);
                resolve(carer)
            }catch(err){
                reject("Carer account could not be created");
            }
        })
    }

    static async findCarersByNameOrEmail(searchText){
        console.log("carer model searchText", searchText)
        return new Promise (async (resolve, reject) => {
            try {
                let carers;
                if(searchText.indexOf(" ") !== -1){
                    let spaceIndex = searchText.indexOf(" ")
                    let firstTerm = searchText.slice(0, spaceIndex)
                    let secondTerm = searchText.slice(spaceIndex + 1, searchText.length)
                    const result = await db.query('SELECT * FROM carers WHERE first_name ILIKE $1 OR first_name ILIKE $2 OR second_name ILIKE $1 OR second_name ILIKE $2 OR email ILIKE $1 OR email ILIKE $2', [ firstTerm, secondTerm]);
                    carers = result.rows
                }if(searchText.indexOf(" ") === -1){
                    const percentSign = "%"
                    const newSearchTerm = searchText.concat(percentSign)
                    const result = await db.query('SELECT * FROM carers WHERE first_name ILIKE $1 OR second_name ILIKE $1 OR email ILIKE $1', [ newSearchTerm]);
                    carers = result.rows
                }
                console.log("carer model result", carers)
                resolve(carers)
            }catch(err){
                reject("Error finding carers");
            }
        })}
    static async getUsersAndTopline({user_id}){
        return new Promise (async (resolve, reject) => {
            try {
                let dataToDisplay = []
                //find users associated with a carer
                const results = await db.query('SELECT * FROM carers JOIN users on carers.id = users.carer_id WHERE carers.id = $1 ORDER BY (last_login) DESC', [user_id]);
                console.log(results.rows)
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
                    let percentCompleted
                    if(totalHabitsCompleted > 0) {
                        percentCompleted = (totalHabitsCompleted / habitTotalNum) * 100
                    } else {
                        percentCompleted = 0
                    }
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