const { getAllProducts, getSingleProduct } = require('../controllers/products');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

jest.mock('../data/database');

describe('Products Controller', () => {
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

  test('getAllProducts should return all products', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockDb.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([{ name: 'Product1' }]) });

    await getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ name: 'Product1' }]);
  });

  test('getSingleProduct should return a single product', async () => {
    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockDb.findOne.mockResolvedValue({ name: 'Product1' });

    await getSingleProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Product1' });
  });
});