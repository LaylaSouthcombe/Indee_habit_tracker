const carersController = require('../../../controllers/carers')
const Carer = require('../../../models/Carer');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }))
const mockRes = { status: mockStatus }

describe('Carer controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns carer with a 200 status code', async () => {
            jest.spyOn(Carer, 'all', 'get')
                 .mockResolvedValue(['carer1', 'carer2']);
            await carersController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['carer1', 'carer2']);
        })
    });

    // describe('show', () => {
    //     test('it returns a carer and their users with a 200 status code', async () => {
    //         jest.spyOn(Carer, 'findById')
    //             .mockResolvedValue(new Carer({ id: 1, name: 'Test Author'} ));
    //         jest.spyOn(Carer.prototype, 'books', 'get')
    //             .mockResolvedValue(['book1', 'book2']);
                
    //         const mockReq = { params: { id: 1 } }
    //         await carersController.show(mockReq, mockRes);
    //         expect(mockStatus).toHaveBeenCalledWith(200);
    //         expect(mockJson).toHaveBeenCalledWith({
    //             id: 1,
    //             name: 'Test Author',
    //             books: ['book1', 'book2']
    //         });
    //     })
    // });
    
})