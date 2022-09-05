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
        this.last_login = data.last_login;
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
        // console.log(fname)
        return new Promise (async (resolve, reject) => {
            try {
                //TODO: add in today's date
                const result = await db.query('INSERT INTO users (first_name, second_name, password_digest, email) VALUES ($1, $2, $3, $4) RETURNING *;', [fname, sname, password, email])
                const user = new User(result.rows[0]);
                console.log(user)
                resolve(user)
            }catch(err){
                reject("User account could not be created");
            }
        })
    }
    // const lastLogin = await User.updateLoginDate(person.id)
    static async updateLoginDate(userId){
        return new Promise (async (resolve, reject) => {
            try {
                console.log(userId)
                let todaysDate = new Date()
                console.log("todaysDate", todaysDate)
                let result = await db.query(`UPDATE users SET last_login = $1 WHERE id = $2 RETURNING *;`, [ todaysDate, userId])
                console.log(result.rows[0])
                resolve(result.rows[0].last_login)
            }catch(err){
                reject("Error assigning users");
            }
        })
    }

    static async findUsersSummary({user_id, number_of_days}) {
        return new Promise (async (resolve, reject) => {
            try {
                const userInfo = await db.query('SELECT first_name, second_name, last_login FROM users WHERE id = $1;', [user_id])
                console.log(userInfo.rows[0])
                // let habitsInfo = await db.query('SELECT * FROM habits_info WHERE user_id = $1', [user_id]);
                // let habitTotalNum = habitsInfo.rows.length;
  
                if(number_of_days === "all time"){
                    let lastIntEntry = await db.query(`SELECT * FROM int_entries JOIN habits_info ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1 ORDER BY (date) ASC LIMIT 1;`, [user_id]);
                    console.log(lastIntEntry.rows)
                    let lastBlnEntry = await db.query(`SELECT * FROM boolean_entries JOIN habits_info ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 ORDER BY (date) ASC LIMIT 1;`, [user_id]);
                    console.log("lastBlnEntry", lastBlnEntry.rows)
                    let todaysDate = new Date()
                    let intDifference
                    let blnDifference
                    if(lastIntEntry.rows.length){
                        intDifference = todaysDate.getTime() - lastIntEntry.rows[0].date.getTime();
                    }
                    if(lastBlnEntry.rows.length){
                        blnDifference = todaysDate.getTime() - lastBlnEntry.rows[0].date.getTime();
                    }
                    let totalDays
                    if(intDifference > blnDifference){
                        totalDays = Math.ceil(intDifference / (1000 * 3600 * 24));
                    } else {
                        totalDays = Math.ceil(blnDifference / (1000 * 3600 * 24));
                    }
                    number_of_days = totalDays
                }

                let entriesData = {}
                console.log("find summary num of days", number_of_days)
                //finds the last X days of int entries
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
                        if(dayBlnEntries.rows[j].habit_bln_entry){
                            blnHabitsCompleted += 1;
                        }
                    }
                    entriesData[i+1].total += dayBlnEntries.rows.length
                    entriesData[i+1].complete += blnHabitsCompleted
                }
                
                let obj = { "userFirstName": userInfo.rows[0].first_name, "userSecondName": userInfo.rows[0].second_name, "numOfHabitsCompleted": entriesData[1].complete, "numOfHabits": entriesData[1].total, "lastLogin": userInfo.rows[0].last_login, 
                entriesData: entriesData, number_of_days: number_of_days}
                resolve(obj)
            }catch(err){
                reject("Users habit history could not be found");
            }
        })
    }
    static async findUsersIndividualHabitsSummary({user_id, number_of_days}) {
        return new Promise (async (resolve, reject) => {
            try {
                // console.log("num of days", number_of_days)
                let habitsInfo = await db.query('SELECT * FROM habits_info WHERE user_id = $1', [user_id]);
                let dataArr = []
                // console.log(number_of_days === "all time")
                for(let k = 0; k < habitsInfo.rows.length; k++){
                    if(number_of_days === "all time"){
                        let todaysDate = new Date()
                        let totalDays
                        if(habitsInfo.rows[k].type === "int"){
                            let lastIntEntry = await db.query(`SELECT * FROM int_entries JOIN habits_info ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1 AND int_entries.habit_int_id = $2 ORDER BY (date) ASC LIMIT 1;`, [user_id, habitsInfo.rows[k].id]);
                            let intDifference = todaysDate.getTime() - lastIntEntry.rows[0].date.getTime();
                             totalDays = Math.ceil(intDifference / (1000 * 3600 * 24));
                        }
                        if(habitsInfo.rows[k].type === "boolean"){
                            let lastBlnEntry = await db.query(`SELECT * FROM boolean_entries JOIN habits_info ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 AND boolean_entries.habit_bln_id = $2 ORDER BY (date) ASC LIMIT 1;`, [user_id, habitsInfo.rows[k].id]);

                            let blnDifference = todaysDate.getTime() - lastBlnEntry.rows[0].date.getTime();
                            totalDays = Math.ceil(blnDifference / (1000 * 3600 * 24));
                        }
                        number_of_days = totalDays
                    }
                }
                    
                    
                    
                    for(let k = 0; k < habitsInfo.rows.length; k++){
                    // finds the last X days of int entries
                    let entriesData = {}
                    for(let h = 0; h < number_of_days; h++){
                        entriesData[h+1] = {total: 0, complete: 0}
                    }
                    if(habitsInfo.rows[k].type === "int"){
                        for(let i = 0; i < number_of_days; i++){
                            let dayIntEntries = await db.query(`SELECT * FROM int_entries JOIN habits_info ON habits_info.id = int_entries.habit_int_id WHERE user_id = $1 AND int_entries.habit_int_id = $2 AND date = CURRENT_DATE - ${i} ORDER BY (date) DESC;`, [user_id, habitsInfo.rows[k].id]);
                            // console.log("dayIntEntries", dayIntEntries.rows)
                            let intHabitsCompleted = 0;
                            for(let j = 0; j < dayIntEntries.rows.length; j++){
                                if(dayIntEntries.rows[j].habit_int_entry >= dayIntEntries.rows[j].goal){
                                    intHabitsCompleted += 1;
                                }
                            }
                            entriesData[i+1].total = dayIntEntries.rows.length
                            entriesData[i+1].complete = intHabitsCompleted
                            // console.log(entriesData)
                        }
                        // console.log("int", entriesData)
                    }
                    if(habitsInfo.rows[k].type === "boolean"){
                        for(let i = 0; i < number_of_days; i++){
                            // console.log(habitsInfo.rows[k].type)
                            let dayBlnEntries = await db.query(`SELECT * FROM boolean_entries JOIN habits_info ON habits_info.id = boolean_entries.habit_bln_id WHERE user_id = $1 AND boolean_entries.habit_bln_id = $2 AND date = CURRENT_DATE - ${i} ORDER BY (date) DESC;`, [user_id, habitsInfo.rows[k].id]);
                            // console.log("dayBlnEntries", dayBlnEntries.rows)
                            let blnHabitsCompleted = 0;
                            for(let j = 0; j < dayBlnEntries.rows.length; j++){
                                if(dayBlnEntries.rows[j].habit_bln_entry === true){
                                    console.log("hi")
                                    blnHabitsCompleted += 1;
                                }
                            }
                            // console.log(blnHabitsCompleted)
                            // console.log(entriesData)
                            entriesData[i+1].total += dayBlnEntries.rows.length
                            // console.log("entriesData[i+1].total", entriesData[i+1].total)
                            entriesData[i+1].complete = entriesData[i+1].complete + blnHabitsCompleted
                            // console.log("entriesData[i+1].complete", entriesData[i+1].complete)
                        }
                        // console.log("bln", entriesData)
                    }
                    dataArr.push({ habitId: habitsInfo.rows[k].id,  habitTitle: habitsInfo.rows[k].description, entriesData: entriesData})
                    console.log("dataArr", dataArr[k])
                }
                let obj = { dataArr: dataArr, number_of_days: number_of_days}
                // console.log(obj)
                resolve(obj)
            }catch(err){
                reject("Users habit history could not be found");
            }
        })
    }
    
    static async findUsersByNameOrEmail(searchText, carerId){
        console.log("user model searchText", searchText)
        return new Promise (async (resolve, reject) => {
            try {
                let initialUsers;
                if(searchText.indexOf(" ") !== -1){
                    let spaceIndex = searchText.indexOf(" ")
                    let firstTerm = searchText.slice(0, spaceIndex)
                    //add in requests table to search if request exists between user and carer
                    let secondTerm = searchText.slice(spaceIndex + 1, searchText.length)
                    const result = await db.query('SELECT * FROM users WHERE (first_name ILIKE $1 OR first_name ILIKE $2 OR second_name ILIKE $1 OR second_name ILIKE $2 OR email ILIKE $1 OR email ILIKE $2) AND carer_id = 0;', [ firstTerm, secondTerm ]);
                    initialUsers = result.rows
                }if(searchText.indexOf(" ") === -1){
                    const percentSign = "%"
                    const newSearchTerm = searchText.concat(percentSign)
                    const result = await db.query('SELECT * FROM users WHERE (first_name ILIKE $1 OR second_name ILIKE $1 OR email ILIKE $1) AND carer_id = 0;', [ newSearchTerm ]);
                    initialUsers = result.rows
                    console.log(initialUsers)

                }
                let users = []
                for(let i = 0; i < initialUsers.length; i++){
                    let elimintedUser = await db.query('SELECT * FROM requests WHERE user_id = $1 AND carer_id = $2;', [ initialUsers[i].id, carerId ]);
                    console.log(elimintedUser.rows.length)
                    if(elimintedUser.rows.length === 0){
                        users.push(initialUsers[i])
                    }
                }
                resolve(users)
            }catch(err){
                reject("Error finding users");
            }
        })
    }
    static async findUsersByEmail(searchText){
        console.log("user model searchText", searchText)
        return new Promise (async (resolve, reject) => {
            try {
                    const result = await db.query('SELECT * FROM users WHERE email ILIKE $1;', [ searchText ]);
                resolve(result.rows)
            }catch(err){
                reject("Error finding users");
            }
        })
    }
    static async addUserAsDependent(userId, carerId){
        return new Promise (async (resolve, reject) => {
            try {
                //update user_id to have carer_id as this id
                //add row to requests database
                const result = await db.query('INSERT INTO requests (user_id, carer_id) VALUES ($1, $2) RETURNING *;', [userId, carerId])
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