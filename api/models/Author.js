const db = require('../dbConfig/init');

module.exports = class Author {
    constructor(data){
        this.id = data.id;
        this.name = data.name;
    };
    
    static get all(){ 
        return new Promise (async (resolve, reject) => {
            try {
                // console.log(db);
                const result = await db.query('SELECT * FROM authors;')
                const authors = result.rows.map(a => ({ id: a.id, name: a.name }))
                resolve(authors);
            } catch (err) {
                reject("Error retrieving authors")
            }
        })
    };

    get books(){
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('SELECT id, title FROM books WHERE author_id = $1', [ this.id ]);
                const books = result.rows.map(b => ({title: b.title, path: `/books/${b.id}`}));
                resolve(books);
            } catch (err) {
                reject("Author's books could not be found");
            };
        });
    };

    destroy(){
        return new Promise(async(resolve, reject) => {
            try {
                const result = await db.query('DELETE FROM authors WHERE id = $1 RETURNING id', [ this.id ]);
                resolve(`Author ${result.id} was deleted`)
            } catch (err) {
                reject('Author could not be deleted')
            }
        })   
    }

    static findById(id){
        return new Promise (async (resolve, reject) => {
            try {
                let authorData = await db.query('SELECT * FROM authors WHERE id = $1;', [ id ]);
                let author = new Author(authorData.rows[0]);
                resolve(author);
            } catch (err) {
                reject('Author not found');
            };
        });
    };

    static create(name){
        return new Promise (async (resolve, reject) => {
            try {
                let authorData = await db.query('INSERT INTO authors (name) VALUES ($1) RETURNING *;', [ name ]);
                let author = new Author(authorData.rows[0]);
                resolve (author);
            } catch (err) {
                reject('Author could not be created');
            };
        });
    };

    static findOrCreateByName(name){
        return new Promise (async (resolve, reject) => {
            try {
                let author;
                const authorData = await db.query('SELECT * FROM authors WHERE name = $1;', [ name ]);
                if(!authorData.rows.length) {
                    author = await Author.create(name);
                } else {
                    author = new Author(authorData.rows[0]);
                };
                resolve(author);
            } catch (err) {
                reject(err);
            };
        });
    };
};