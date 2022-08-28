const db = require('../dbConfig/init');
const Request = require('./Request')

module.exports = class User {
    constructor(data){
        this.id = data.id;
        this.first_name = data.first_name;
        this.second_name = data.second_name;
        this.password_digest = data.password_digest;
        this.email = data.email;
        this.carer_id = data.carer_id;
    };
    
    static get all(){ 
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('SELECT * FROM users;')
                const users = result.rows.map(a => new User(a))
                resolve(users);
            } catch (err) {
                reject("Error retrieving users")
            }
        })
    };

    static async create({fname, sname, password, email}) {
        console.log(fname)
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('INSERT INTO users (first_name, second_name, password_digest, email) VALUES ($1, $2, $3, $4) RETURNING *;', [fname, sname, password, email])
                const user = new User(result.rows[0]);
                console.log(user)
                resolve(user)
            }catch(err){
                reject("User account could not be created");
            }
        })
    }
    //name
    //number of daily habits last 7 days
    //number completed today last 7 days
    //last login

    static async findUsersSummary({user_id, number_of_days}) {
        return new Promise (async (resolve, reject) => {
            try {
                const userInfo = await db.query('SELECT first_name, second_name, last_login FROM users WHERE id = $1;', [user_id])

                // let habitsInfo = await db.query('SELECT * FROM habits_info WHERE user_id = $1', [user_id]);
                // let habitTotalNum = habitsInfo.rows.length;
  
                if(number_of_days === "all time"){
                    let lastIntEntry = await db.query(`SELECT * FROM int_entries JOIN habits_info ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1 ORDER BY (date) ASC LIMIT 1;`, [user_id]);
                    let lastBlnEntry = await db.query(`SELECT * FROM boolean_entries JOIN habits_info ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 ORDER BY (date) ASC LIMIT 1;`, [user_id]);
                    let todaysDate = new Date()
                    let intDifference = todaysDate.getTime() - lastIntEntry.rows[0].date.getTime();
                    let blnDifference = todaysDate.getTime() - lastBlnEntry.rows[0].date.getTime();
                    let totalDays
                    if(intDifference > blnDifference){
                        totalDays = Math.ceil(intDifference / (1000 * 3600 * 24));
                    } else {
                        totalDays = Math.ceil(blnDifference / (1000 * 3600 * 24));
                    }
                    number_of_days = totalDays
                }
                console.log("number_of_days", number_of_days)
                let entriesData = {}

                //finds the last 7 days of int entries
                for(let i = 0; i < number_of_days; i++){
                    let dayIntEntries = await db.query(`SELECT * FROM int_entries JOIN habits_info ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1 AND date = CURRENT_DATE - ${i} ORDER BY (date) DESC;`, [user_id]);
                    let intHabitsCompleted = 0;
                    for(let j = 0; j < dayIntEntries.rows.length; j++){
                        if(dayIntEntries.rows[j].habit_int_entry >= dayIntEntries.rows[j].goal){
                            intHabitsCompleted += 1;
                        }
                    }
                    entriesData[i+1] = {total: dayIntEntries.rows.length, complete: intHabitsCompleted}
                }

                for(let i = 0; i < number_of_days; i++){
                    let dayBlnEntries = await db.query(`SELECT * FROM boolean_entries JOIN habits_info ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 AND date = CURRENT_DATE - ${i} ORDER BY (date) DESC;`, [user_id]);
                    let blnHabitsCompleted = 0;
                    for(let j = 0; j < dayBlnEntries.rows.length; j++){
                        if(dayBlnEntries.rows[j].habit_bln_entry >= dayBlnEntries.rows[j].goal){
                            blnHabitsCompleted += 1;
                        }
                    }
                    entriesData[i+1].total += dayBlnEntries.rows.length
                    entriesData[i+1].complete += blnHabitsCompleted
                }

                let obj = { "userFirstName": userInfo.rows[0].first_name, "userSecondName": userInfo.rows[0].second_name, "numOfHabitsCompleted": entriesData[1].complete, "numOfHabits": entriesData[1].total, "lastLogin": userInfo.rows[0].last_login, 
                entriesData: entriesData}
                console.log(obj)
                resolve(obj)
            }catch(err){
                reject("User account could not be created");
            }
        })
    }

    
    static async findUsersByNameOrEmail(searchText){
        console.log("user model searchText", searchText)
        return new Promise (async (resolve, reject) => {
            try {
                let users;
                if(searchText.indexOf(" ") !== -1){
                    let spaceIndex = searchText.indexOf(" ")
                    let firstTerm = searchText.slice(0, spaceIndex)
                    let secondTerm = searchText.slice(spaceIndex + 1, searchText.length)
                    const result = await db.query('SELECT * FROM users WHERE first_name ILIKE $1 OR first_name ILIKE $2 OR second_name ILIKE $1 OR second_name ILIKE $2 OR email ILIKE $1 OR email ILIKE $2', [ firstTerm, secondTerm]);
                    users = result.rows
                }if(searchText.indexOf(" ") === -1){
                    const percentSign = "%"
                    const newSearchTerm = searchText.concat(percentSign)
                    const result = await db.query('SELECT * FROM users WHERE first_name ILIKE $1 OR second_name ILIKE $1 OR email ILIKE $1', [ newSearchTerm]);
                    users = result.rows
                }
                console.log("user model users", users)
                resolve(users)
            }catch(err){
                reject("Error finding users");
            }
        })
    }
    static async addUserAsDependent(user_Id, carerId){
        return new Promise (async (resolve, reject) => {
            try {
                //update user_id to have carer_id as this id
                //add row to requests database
                const result = await db.query('INSERT INTO requests (user_id, carer_id) VALUES ($1, $2) RETURNING *;', [user_Id, carerId])
                const request = new Request(result.rows[0]);
                resolve(request)
            }catch(err){
                reject("Error assigning users");
            }
        })
    }

    

    //in find person, if carer.id = carer_id, have marker green, else have a request button

    // get books(){
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             const result = await db.query('SELECT id, title FROM books WHERE user_id = $1', [ this.id ]);
    //             const books = result.rows.map(b => ({title: b.title, path: `/books/${b.id}`}));
    //             resolve(books);
    //         } catch (err) {
    //             reject("user's books could not be found");
    //         };
    //     });
    // };

    // destroy(){
    //     return new Promise(async(resolve, reject) => {
    //         try {
    //             const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [ this.id ]);
    //             resolve(`user ${result.id} was deleted`)
    //         } catch (err) {
    //             reject('user could not be deleted')
    //         }
    //     })   
    // }

    // static findById(id){
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             let userData = await db.query('SELECT * FROM users WHERE id = $1;', [ id ]);
    //             let user = new User(userData.rows[0]);
    //             resolve(user);
    //         } catch (err) {
    //             reject('user not found');
    //         };
    //     });
    // };

    // static create(name){
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             let userData = await db.query('INSERT INTO users (name) VALUES ($1) RETURNING *;', [ name ]);
    //             let user = new User(userData.rows[0]);
    //             resolve (user);
    //         } catch (err) {
    //             reject('user could not be created');
    //         };
    //     });
    // };

    // static findOrCreateByName(name){
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             let user;
    //             const userData = await db.query('SELECT * FROM users WHERE name = $1;', [ name ]);
    //             if(!userData.rows.length) {
    //                 user = await User.create(name);
    //             } else {
    //                 user = new User(userData.rows[0]);
    //             };
    //             resolve(user);
    //         } catch (err) {
    //             reject(err);
    //         };
    //     });
    // };
};