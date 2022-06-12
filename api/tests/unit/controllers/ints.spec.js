const intsController = require('../../../controllers/int_entries')
const Int = require('../../../models/Int_entry');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('ints controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns ints with a 200 status code', async () => {
            jest.spyOn(Int, 'all', 'get')
                 .mockResolvedValue(['book1', 'book2']);
            await intsController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['book1', 'book2']);
        })
    });

    // describe('show', () => {
    //     test('it returns a book with a 200 status code', async () => {
    //         let testInt = {
    //             id: 1, title: 'Test Int', 
    //             yearOfPublication: 2021,
    //             abstract: 'testing', author_name: 'Bob', author_id: 1
    //         }
    //         jest.spyOn(Int, 'findById')
    //             .mockResolvedValue(new Int(testInt));
                
    //         const mockReq = { params: { id: 1 } }
    //         await intsController.show(mockReq, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(200);
    //         expect(mockJson).toHaveBeenCalledWith(new Int(testInt));
    //     })
    // });

    // describe('create', () => {
    //     test('it returns a new book with a 201 status code', async () => {
    //         let testInt = {
    //             id: 2, title: 'Test Int', 
    //             yearOfPublication: 2021,
    //             abstract: 'testing', author_name: 'Bob', author_id: 1
    //         }
    //         jest.spyOn(Int, 'create')
    //             .mockResolvedValue(new Int(testInt));
                
    //         const mockReq = { body: testInt }
    //         await intsController.create(mockReq, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(201);
    //         expect(mockJson).toHaveBeenCalledWith(new Int(testInt));
    //     })
    // });

    // describe('destroy', () => {
    //     test('it returns a 204 status code on successful deletion', async () => {
    //         jest.spyOn(Int.prototype, 'destroy')
    //             .mockResolvedValue('Deleted');
            
    //         const mockReq = { params: { id: 1 } }
    //         await intsController.destroy(mockReq, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(204);
    //     })
    // });
    
})