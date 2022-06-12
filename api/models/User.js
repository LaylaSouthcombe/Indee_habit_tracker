const db = require('../dbConfig/init');

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
                // console.log(db);
                const result = await db.query('SELECT * FROM users;')
                const users = result.rows.map(a => new User(a))
                resolve(users);
            } catch (err) {
                reject("Error retrieving users")
            }
        })
    };

    static async create( first_name, second_name, password_digest, email) {
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('INSERT INTO users (first_name, second_name, password_digest, email) VALUES ($1, $2, $3, $4 RETURNING *;', [first_name, second_name, password_digest, email])
                const user = new User(result.rows[0]);
                resolve(user)
            }catch(err){
                reject("Carer account could not be created");
            }
        })
    }
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