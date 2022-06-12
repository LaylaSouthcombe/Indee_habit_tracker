const User = require('../../../models/User');
const pg = require('pg');
jest.mock('pg');

const db = require('../../../dbConfig/init');

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with users on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}]});
            const all = await User.all;
            expect(all).toHaveLength(3)
        })
    });

    // describe('books', () => {
    //     test('it resolves with formatted books on successful db query', async () => {
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({ 
    //                 rows: [{id: 1, title: 'book1'}, {id: 2, title: 'book2'}]
    //             });
    //         let testUser = new User({ id: 1, name: 'Test User'})
    //         const books = await testUser.books;
    //         expect(books).toHaveLength(2)
    //         expect(books[0]).toHaveProperty('path', '/books/1')
    //     })
    // });

    // describe('destroy', () => {
    //     test('it resolves with message on successful db query', async () => {
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({ id: 1 });
    //         let testUser = new User({ id: 1, name: 'Test User'})
    //         const result = await testUser.destroy();
    //         expect(result).toBe('User 1 was deleted')
    //     })
    // });

    // describe('findById', () => {
    //     test('it resolves with user on successful db query', async () => {
    //         let userData = { id: 1, name: 'Test User' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ userData] });
    //         const result = await User.findById(1);
    //         expect(result).toBeInstanceOf(User)
    //     })
    // });

    // describe('create', () => {
    //     test('it resolves with user on successful db query', async () => {
    //         let userData = { id: 1, name: 'New User' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ userData] });
    //         const result = await User.create('New User');
    //         expect(result).toBeInstanceOf(User)
    //     })
    // });

    // describe('findOrCreateByName', () => {
    //     test('it calls on User.create if name not found', async () => {
    //         let userData = { id: 1, name: 'New User' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ ] });
    //         const createSpy = jest.spyOn(User, 'create')
    //             .mockResolvedValueOnce(new User(userData));
    //         const result = await User.findOrCreateByName('New User');
    //         expect(createSpy).toHaveBeenCalled();
    //         expect(result).toBeInstanceOf(User);
    //     })

    //     test('it does not call on User.create if name found', async () => {
    //         let userData = { id: 1, name: 'Old User' }
    //         jest.spyOn(db, 'query')
    //             .mockResolvedValueOnce({rows: [ userData ] });
    //         const createSpy = jest.spyOn(User, 'create')
    //             .mockResolvedValueOnce(new User(userData));
    //         const result = await User.findOrCreateByName('Old User');
    //         expect(createSpy).not.toHaveBeenCalled();
    //         expect(result).toBeInstanceOf(User);
    //     })
    // });
    
})