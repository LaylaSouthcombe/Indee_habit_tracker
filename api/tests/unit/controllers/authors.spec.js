const authorsController = require('../../../controllers/authors')
const Author = require('../../../models/Author');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }))
const mockRes = { status: mockStatus }

describe('authors controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns authors with a 200 status code', async () => {
            jest.spyOn(Author, 'all', 'get')
                 .mockResolvedValue(['author1', 'author2']);
            await authorsController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['author1', 'author2']);
        })
    });

    describe('show', () => {
        test('it returns an author and their books with a 200 status code', async () => {
            jest.spyOn(Author, 'findById')
                .mockResolvedValue(new Author({ id: 1, name: 'Test Author'} ));
            jest.spyOn(Author.prototype, 'books', 'get')
                .mockResolvedValue(['book1', 'book2']);
                
            const mockReq = { params: { id: 1 } }
            await authorsController.show(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                id: 1,
                name: 'Test Author',
                books: ['book1', 'book2']
            });
        })
    });
    
})