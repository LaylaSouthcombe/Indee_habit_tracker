const Carer = require('../../../models/Carer');
const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig/init');

describe('Carer', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with carers on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await Carer.all;
            expect(all).toHaveLength(3)
        })
    });

    // describe('books', () => {
    //     test('it resolves with formatted books on successful db query', async () => {
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({ 
    //                 rows: [{id: 1, title: 'book1'}, {id: 2, title: 'book2'}]
    //             });
    //         let testCarer = new Carer({ id: 1, name: 'Test Carer'})
    //         const books = await testCarer.books;
    //         expect(books).toHaveLength(2)
    //         expect(books[0]).toHaveProperty('path', '/books/1')
    //     })
    // });

    // describe('destroy', () => {
    //     test('it resolves with message on successful db query', async () => {
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({ id: 1 });
    //         let testCarer = new Carer({ id: 1, name: 'Test Carer'})
    //         const result = await testCarer.destroy();
    //         expect(result).toBe('Carer 1 was deleted')
    //     })
    // });

    // describe('findById', () => {
    //     test('it resolves with carer on successful db query', async () => {
    //         let carerData = { id: 1, name: 'Test Carer' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ carerData] });
    //         const result = await Carer.findById(1);
    //         expect(result).toBeInstanceOf(Carer)
    //     })
    // });

    // describe('create', () => {
    //     test('it resolves with carer on successful db query', async () => {
    //         let carerData = { id: 1, name: 'New Carer' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ carerData] });
    //         const result = await Carer.create('New Carer');
    //         expect(result).toBeInstanceOf(Carer)
    //     })
    // });

    // describe('findOrCreateByName', () => {
    //     test('it calls on Carer.create if name not found', async () => {
    //         let carerData = { id: 1, name: 'New Carer' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ ] });
    //         const createSpy = jest.spyOn(Carer, 'create')
    //             .mockResolvedValueOnce(new Carer(carerData));
    //         const result = await Carer.findOrCreateByName('New Carer');
    //         expect(createSpy).toHaveBeenCalled();
    //         expect(result).toBeInstanceOf(Carer);
    //     })

    //     test('it does not call on Carer.create if name found', async () => {
    //         let carerData = { id: 1, name: 'Old Carer' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ carerData ] });
    //         const createSpy = jest.spyOn(Carer, 'create')
    //             .mockResolvedValueOnce(new Carer(carerData));
    //         const result = await Carer.findOrCreateByName('Old Carer');
    //         expect(createSpy).not.toHaveBeenCalled();
    //         expect(result).toBeInstanceOf(Carer);
    //     })
    // });
    
})