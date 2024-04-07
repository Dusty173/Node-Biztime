process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const db = require('./db');

afterAll(async () => {
    await db.end()
});

describe('GET /companies', () => {
    test('Get all companies', async () => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
    })
    test('Get company by code', async () => {
        const res = await request(app).get('/companies/apple')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({company : 'Apple Computer'})
    })
    test('Get 404 if invalid code', async () => {
        const res = await request(app).get('/companies/notacode')
        expect(res.statusCode).toBe(404)
    })
});

describe('POST /companies', () => {
    test('Add a new company', async () => {
        let res = (await request(app).post('/companies')).send({ code: 'newComp', name: 'newComp', description: 'New company' })
        expect(res.statusCode).toBe(201)
    });
});

describe('PUT /companies', () => {
    test('Update company', async () => {
        let res = await request(app).post('/companies/newComp').send({name: 'newComp UPDATED', description: 'New company UPDATED' })
        expect(res.statusCode).toBe(201)
    });
});

describe('DELETE /companies/:code', () => {
    test('Deletes company', async () => {
        const res = await request(app).delete('/companies/newComp')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({status: 'deleted'})
    })
});