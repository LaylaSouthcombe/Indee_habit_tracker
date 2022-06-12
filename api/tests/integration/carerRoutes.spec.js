describe('carer endpoints', () => {
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

    it('should return a list of all carers in database', async () => {
        const res = await request(api).get('/carers');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    })
    
    // it('should return a list of users associated with a specific carer', async () => {
    //     const res = await request(api).get('/carers/1');
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body.users.length).toEqual(2);
    // }) 
})