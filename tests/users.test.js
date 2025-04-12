const { getUserDetails } = require('../controllers/users');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

jest.mock('../data/database');

describe('Users Controller - getUserDetails', () => {
    let mockDb;

    beforeAll(() => {
        mockDb = {
            db: jest.fn().mockReturnThis(),
            collection: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
        };
        mongodb.getDatabase.mockReturnValue(mockDb);
    });

    test('getUserDetails should return user details when user is found', async () => {
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockUser = { _id: '123', name: 'John Doe', email: 'john@example.com' };

        mockDb.findOne.mockResolvedValue(mockUser);

        await getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test('getUserDetails should return 404 when user is not found', async () => {
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        mockDb.findOne.mockResolvedValue(null);

        await getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('getUserDetails should handle errors gracefully', async () => {
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        mockDb.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        await getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching user details', error: expect.any(Error) });
    });
});