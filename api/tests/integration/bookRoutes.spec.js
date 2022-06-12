describe('books endpoints', () => {
    let api;
    beforeEach(async () => {
        await resetTestDB()
    });

    beforeAll(async () => {
        api = app.listen(5000, () => console.log('Test server running on port 5000'))
    });

    afterAll(async () => {
        console.log('Gracefully stopping test server')
        await api.close()
    })

    it('should return a list of all book in database', async () => {
        const res = await request(api).get('/books');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(3);
    });

    it('should create a new book by an existing author', async () => {
        const res = await request(api)
            .post('/books')
            .send({
                title: 'New Book',
                authorName: 'Test Author 1'
            })
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("id");

        const authRes = await request(api).get('/authors/1');
        expect(authRes.body.books.length).toEqual(3);
    });

    it('should create a new book by a new author', async () => {
        const res = await request(api)
            .post('/books')
            .send({
                title: 'Another New Book',
                authorName: 'New Test Author'
            })
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("id");
        // console.log(res);
        const authRes = await request(api).get('/authors/3');
        // console.log(authRes);
        expect(authRes.statusCode).toEqual(200);
        expect(authRes.body.books.length).toEqual(1);
    });

    it('should not create a new book with an abstract over 500 characters', async () => {
        const res = await request(api)
            .post('/books')
            .send({
                title: 'Long, Long Book',
                authorName: 'Leo Tolstoy',
                abstract: "YyYXJHN8ovVJHDYn7kOl1griWoH8rw3Q7vaAxeyopIDG2NTZRIwQbhY7ykbuwZE2ohowLvUcxDMncPX6hwkrYLX4CrP5Y3nKsb6A9xfOFSsKTYvpmFeTSkDYkJNeszfeNF7I2iQqxWfWSYWH5PRYTLJUnU9Lq8rq0LKi24BkG5OWYWO3W0Nt2YCsbuJYamiWzPutJVfZ4oDg9dQUBy64d6a5tGCrNgSfyPzeg2wWgPHBLGfDEZPYO1zGsumYIr8Wh9l4cpyr5zuozn6kBkEz5mXfiZsUiKnjDp2BxaoU2ZEitJBiJ86KNOYV7NaqltNEBIkSfCrwRZwwhUfUj3h1W1PVGfs3hTFjA7xw0a6ZeMGZCEfKJ7w4wloiR3WVk6JpEnSNJuuf6eA4azTDiTCPkTRprSg0yLZwHuN3WiFg3wq4AsYadddbmWIKxxMszxSyRo9ZmZEcqkicpyTXPvfnGQTaF4SLoynBT3Soy1BG4BGWu7D9R7MbI"
            })
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty("err");

        const bookRes = await request(api).get('/books/4');
        expect(bookRes.statusCode).toEqual(404);
    });

    it('should delete a book', async () => {
        const res = await request(api)
            .delete('/books/1')
        expect(res.statusCode).toEqual(204);

        const bookRes = await request(api).get('/books/1');
        expect(bookRes.statusCode).toEqual(404);
        expect(bookRes.body).toHaveProperty('err');
    }); 
})