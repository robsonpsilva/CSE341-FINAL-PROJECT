const { getCartById } = require('../controllers/cart');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

jest.mock('../data/database');

describe('Cart Controller', () => {
    let mockDb;

    beforeAll(() => {
        mockDb = {
            db: jest.fn().mockReturnThis(),
            collection: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
        };
        mongodb.getDatabase.mockReturnValue(mockDb);
    });

    test('getCartById should return a single cart', async () => {
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockDb.findOne.mockResolvedValue({ userId: 'user123', items: [] });

        await getCartById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userId: 'user123', items: [] });
    });
});