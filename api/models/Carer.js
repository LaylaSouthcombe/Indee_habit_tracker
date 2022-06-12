const db = require('../dbConfig/init');

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

    static async create( first_name, second_name, password_digest, email) {
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





    // get books(){
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             const result = await db.query('SELECT id, title FROM books WHERE carer_id = $1', [ this.id ]);
    //             const books = result.rows.map(b => ({title: b.title, path: `/books/${b.id}`}));
    //             resolve(books);
    //         } catch (err) {
    //             reject("carer's books could not be found");
    //         };
    //     });
    // };

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

    static findById(id){
        return new Promise (async (resolve, reject) => {
            try {
                let carerData = await db.query('SELECT * FROM carers WHERE id = $1;', [ id ]);
                let carer = new Carer(carerData.rows[0]);
                resolve(carer);
            } catch (err) {
                reject('carer not found');
            };
        });
    };

    static create(name){
        return new Promise (async (resolve, reject) => {
            try {
                let carerData = await db.query('INSERT INTO carers (name) VALUES ($1) RETURNING *;', [ name ]);
                let carer = new Carer(carerData.rows[0]);
                resolve (carer);
            } catch (err) {
                reject('carer could not be created');
            };
        });
    };

    static findOrCreateByName(name){
        return new Promise (async (resolve, reject) => {
            try {
                let carer;
                const carerData = await db.query('SELECT * FROM carers WHERE name = $1;', [ name ]);
                if(!carerData.rows.length) {
                    carer = await Carer.create(name);
                } else {
                    carer = new Carer(carerData.rows[0]);
                };
                resolve(carer);
            } catch (err) {
                reject(err);
            };
        });
    };
};