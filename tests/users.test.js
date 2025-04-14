const { getUserDetails } = require('../controllers/users'); // Substitua 'seuArquivo' pelo caminho do seu arquivo
const mongodb = require('../data/database'); // Substitua 'mongodb' pelo caminho do seu arquivo de configuração do MongoDB
const { ObjectId } = require('mongodb');

jest.mock('../data/database');

describe('getUserDetails', () => {
  let req, res, userCollection;

  beforeEach(() => {
    req = { params: { id: '67f8f56671b9906a2cc80872' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    userCollection = {
      findOne: jest.fn(),
    };
    mongodb.getDatabase = jest.fn().mockReturnValue({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(userCollection),
      }),
    });
  });

  it('deve retornar detalhes do usuário quando o usuário é encontrado', async () => {
    const mockUser = { _id: new ObjectId('67f8f56671b9906a2cc80872'), name: 'Test User' };
    userCollection.findOne.mockResolvedValue(mockUser);

    await getUserDetails(req, res);

    expect(userCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId('67f8f56671b9906a2cc80872') });
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('deve retornar 404 quando o usuário não é encontrado', async () => {
    userCollection.findOne.mockResolvedValue(null);

    await getUserDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('deve retornar 500 em caso de erro', async () => {
    const mockError = new Error('Database error');
    userCollection.findOne.mockRejectedValue(mockError);

    await getUserDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching user details',
      error: mockError,
    });
  });
});