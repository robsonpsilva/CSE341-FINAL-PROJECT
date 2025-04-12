const { getProducts } = require('../controllers/productsCart');
const mongodb = require('../data/database');

jest.mock('../data/database');

describe('ProductsCart Controller', () => {
    let mockDb;

    beforeAll(() => {
        mockDb = {
            db: jest.fn().mockReturnThis(),
            collection: jest.fn().mockReturnThis(),
            find: jest.fn(),
        };
        mongodb.getDatabase.mockReturnValue(mockDb);
    });

    test('getProducts should return all products from the categories collection', async () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockDb.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([{ name: 'Category1' }, { name: 'Category2' }]) });

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ name: 'Category1' }, { name: 'Category2' }]);
    });

    test('getProducts should handle errors gracefully', async () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockDb.find.mockImplementation(() => {
            throw new Error('Database error');
        });

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching products', error: expect.any(Error) });
    });
});