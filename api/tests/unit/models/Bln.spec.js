const Bln = require('../../../models/Bln_entry');
// const Author = require('../../../models/Author');

// jest.mock('../../../models/Author');

const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig/init');

describe('Bln', () => {
    beforeEach(() => jest.clearAllMocks())
    
    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with blns on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await Bln.all;
            expect(all).toHaveLength(3)
        })
    });

    // describe('findById', () => {
    //     test('it resolves with bln on successful db query', async () => {
    //         let blnData = { id: 1, title: 'Test Bln' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ blnData] });
    //         const result = await Bln.findById(1);
    //         expect(result).toBeInstanceOf(Bln)
    //     })
    // });

    // describe('create', () => {
    //     test('it resolves with bln on successful db query', async () => {
    //         let blnData = { title: 'Test Bln', yearOfPublication: 2020, abstract: 'test', authorName: 'Test Author' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ { ...blnData, id: 1 }] });
    //         jest.spyOn(Author, 'findOrCreateByName')
    //             .mockResolvedValueOnce(new Author({id: 1, name: 'Test Author'}));
    //         const result = await Bln.create(blnData);
    //         expect(result).toHaveProperty('id')
    //     })
    // });
    
})