const Habit = require('../../../models/Habit');
// const Author = require('../../../models/Author');

// jest.mock('../../../models/Author');

const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig/init');

describe('Habit', () => {
    beforeEach(() => jest.clearAllMocks())
    
    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with authors on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
                //the "rows" above will determine the length value below
                //data will come back undefined, but that is expected
            const all = await Habit.all;
            expect(all).toHaveLength(3)
        })
    });

    // describe('findById', () => {
    //     test('it resolves with habit on successful db query', async () => {
    //         let habitData = { id: 1, title: 'Test Habit' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ habitData] });
    //         const result = await Habit.findById(1);
    //         expect(result).toBeInstanceOf(Habit)
    //     })
    // });

    // describe('create', () => {
    //     test('it resolves with habit on successful db query', async () => {
    //         let habitData = { title: 'Test Habit', yearOfPublication: 2020, abstract: 'test', authorName: 'Test Author' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ { ...habitData, id: 1 }] });
    //         jest.spyOn(Author, 'findOrCreateByName')
    //             .mockResolvedValueOnce(new Author({id: 1, name: 'Test Author'}));
    //         const result = await Habit.create(habitData);
    //         expect(result).toHaveProperty('id')
    //     })
    // });
    
})