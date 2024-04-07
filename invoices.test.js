process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('./app');
const db = require('./db');

afterAll(async () => {
    await db.end()
});

describe('GET /invoices', () => {
    test('Get all invoices', async () => {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200);
    })
    test('Get invoice by id', async () => {
        const res = await request(app).get('/invoices/1')
        expect(res.statusCode).toBe(200)
    })
    test('Get 404 if invalid id', async () => {
        const res = await request(app).get('/invoices/0')
        expect(res.statusCode).toBe(404)
    })
});

describe('POST /invoices', () => {
    test('Add a new invoice', async () => {
        let res = (await request(app).post('/invoices')).send({ comp_code: 'apple', amt: 500 })
        expect(res.statusCode).toBe(201)
    });
});

describe('PUT /invoices/:id', () => {
    test('Update invoice', async () => {
        let res = await request(app).post('/invoices/5').send({ amt: 500, paid: 't' })
        expect(res.statusCode).toBe(201)
    });
});

describe('DELETE /invoices/:id', () => {
    test('Deletes invoice', async () => {
        const res = await request(app).delete('/invoices/5')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({'status': 'deleted'})
    })
});