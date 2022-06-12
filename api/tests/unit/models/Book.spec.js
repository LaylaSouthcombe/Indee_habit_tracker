const Book = require('../../../models/Book');
const Author = require('../../../models/Author');

jest.mock('../../../models/Author');

const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig/init');

describe('Book', () => {
    beforeEach(() => jest.clearAllMocks())
    
    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with authors on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await Book.all;
            expect(all).toHaveLength(3)
        })
    });

    describe('findById', () => {
        test('it resolves with book on successful db query', async () => {
            let bookData = { id: 1, title: 'Test Book' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ bookData] });
            const result = await Book.findById(1);
            expect(result).toBeInstanceOf(Book)
        })
    });

    describe('create', () => {
        test('it resolves with book on successful db query', async () => {
            let bookData = { title: 'Test Book', yearOfPublication: 2020, abstract: 'test', authorName: 'Test Author' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ { ...bookData, id: 1 }] });
            jest.spyOn(Author, 'findOrCreateByName')
                .mockResolvedValueOnce(new Author({id: 1, name: 'Test Author'}));
            const result = await Book.create(bookData);
            expect(result).toHaveProperty('id')
        })
    });
    
})