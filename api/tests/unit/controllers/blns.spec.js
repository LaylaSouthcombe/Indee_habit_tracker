const blnsController = require('../../../controllers/bln_entries')
const Bln = require('../../../models/Bln_entry');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('blns controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns blns with a 200 status code', async () => {
            jest.spyOn(Bln, 'all', 'get')
                 .mockResolvedValue(['bln1', 'bln2']);
            await blnsController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['bln1', 'bln2']);
        })
    });

    // describe('show', () => {
    //     test('it returns a bln with a 200 status code', async () => {
    //         let testBln = {
    //             id: 1, title: 'Test Bln', 
    //             yearOfPublication: 2021,
    //             abstract: 'testing', author_name: 'Bob', author_id: 1
    //         }
    //         jest.spyOn(Bln, 'findById')
    //             .mockResolvedValue(new Bln(testBln));
                
    //         const mockReq = { params: { id: 1 } }
    //         await blnsController.show(mockReq, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(200);
    //         expect(mockJson).toHaveBeenCalledWith(new Bln(testBln));
    //     })
    // });

    // describe('create', () => {
    //     test('it returns a new bln with a 201 status code', async () => {
    //         let testBln = {
    //             id: 2, title: 'Test Bln', 
    //             yearOfPublication: 2021,
    //             abstract: 'testing', author_name: 'Bob', author_id: 1
    //         }
    //         jest.spyOn(Bln, 'create')
    //             .mockResolvedValue(new Bln(testBln));
                
    //         const mockReq = { body: testBln }
    //         await blnsController.create(mockReq, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(201);
    //         expect(mockJson).toHaveBeenCalledWith(new Bln(testBln));
    //     })
    // });

    // describe('destroy', () => {
    //     test('it returns a 204 status code on successful deletion', async () => {
    //         jest.spyOn(Bln.prototype, 'destroy')
    //             .mockResolvedValue('Deleted');
            
    //         const mockReq = { params: { id: 1 } }
    //         await blnsController.destroy(mockReq, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(204);
    //     })
    // });
    
})