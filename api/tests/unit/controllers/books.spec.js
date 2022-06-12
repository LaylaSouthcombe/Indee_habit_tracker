const booksController = require('../../../controllers/books')
const Book = require('../../../models/Book');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('books controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns books with a 200 status code', async () => {
            jest.spyOn(Book, 'all', 'get')
                 .mockResolvedValue(['book1', 'book2']);
            await booksController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['book1', 'book2']);
        })
    });

    describe('show', () => {
        test('it returns a book with a 200 status code', async () => {
            let testBook = {
                id: 1, title: 'Test Book', 
                yearOfPublication: 2021,
                abstract: 'testing', author_name: 'Bob', author_id: 1
            }
            jest.spyOn(Book, 'findById')
                .mockResolvedValue(new Book(testBook));
                
            const mockReq = { params: { id: 1 } }
            await booksController.show(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Book(testBook));
        })
    });

    describe('create', () => {
        test('it returns a new book with a 201 status code', async () => {
            let testBook = {
                id: 2, title: 'Test Book', 
                yearOfPublication: 2021,
                abstract: 'testing', author_name: 'Bob', author_id: 1
            }
            jest.spyOn(Book, 'create')
                .mockResolvedValue(new Book(testBook));
                
            const mockReq = { body: testBook }
            await booksController.create(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(new Book(testBook));
        })
    });

    describe('destroy', () => {
        test('it returns a 204 status code on successful deletion', async () => {
            jest.spyOn(Book.prototype, 'destroy')
                .mockResolvedValue('Deleted');
            
            const mockReq = { params: { id: 1 } }
            await booksController.destroy(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(204);
        })
    });
    
})