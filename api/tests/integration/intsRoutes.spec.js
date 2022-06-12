describe('int_entries endpoints', () => {
    let api;
    beforeEach(async () => {
        await resetTestDB()
    });

    beforeAll(async () => {
        api = app.listen(5000, () => console.log('Test server running on port 5000'))
    });

    afterAll(done => {
        console.log('Gracefully stopping test server')
        api.close(done)
    })

    it('should return a list of all int_entries in database', async () => {
        const res = await request(api).get('/ints');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    })
    
    // it('should return a list of int_entries by a specific user', async () => {
    //     const res = await request(api).get('/ints/1');
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body.books.length).toEqual(2);
    // }) 
})