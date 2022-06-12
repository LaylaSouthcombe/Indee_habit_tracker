const Int = require('../../../models/Int_entry');
// const Author = require('../../../models/Author');

// jest.mock('../../../models/Author');

const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig/init');

describe('Int', () => {
    beforeEach(() => jest.clearAllMocks())
    
    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with ints on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await Int.all;
            expect(all).toHaveLength(3)
        })
    });

    // describe('findById', () => {
    //     test('it resolves with int on successful db query', async () => {
    //         let intData = { id: 1, title: 'Test Int' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ intData] });
    //         const result = await Int.findById(1);
    //         expect(result).toBeInstanceOf(Int)
    //     })
    // });

    // describe('create', () => {
    //     test('it resolves with int on successful db query', async () => {
    //         let intData = { title: 'Test Int', yearOfPublication: 2020, abstract: 'test', authorName: 'Test Author' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ { ...intData, id: 1 }] });
    //         jest.spyOn(Author, 'findOrCreateByName')
    //             .mockResolvedValueOnce(new Author({id: 1, name: 'Test Author'}));
    //         const result = await Int.create(intData);
    //         expect(result).toHaveProperty('id')
    //     })
    // });
    
})