const { getAllCategories, getSingleCategory } = require('../controllers/categories');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

jest.mock('../data/database');

describe('Categories Controller', () => {
    let mockDb;

    beforeAll(() => {
        mockDb = {
            db: jest.fn().mockReturnThis(),
            collection: jest.fn().mockReturnThis(),
            find: jest.fn(),
            findOne: jest.fn(),
        };
        mongodb.getDatabase.mockReturnValue(mockDb);
    });

    test('getAllCategories should return all categories', async () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockDb.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([{ name: 'Category1' }]) });

        await getAllCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ name: 'Category1' }]);
    });

    test('getSingleCategory should return a single category', async () => {
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockDb.findOne.mockResolvedValue({ name: 'Category1' });

        await getSingleCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ name: 'Category1' });
    });
});