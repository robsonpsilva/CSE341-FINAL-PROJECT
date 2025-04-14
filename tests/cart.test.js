const { getCartById } = require('../controllers/cart'); // Substitua 'seuArquivo' pelo caminho do seu arquivo
const mongodb = require('../data/database'); // Substitua 'mongodb' pelo caminho do seu arquivo de configuração do MongoDB
const { ObjectId } = require('mongodb');

jest.mock('../data/database');

describe('getCartById', () => {
    let req, res, cartsCollection;

    beforeEach(() => {
        req = { params: { id: '67f8ebf8153c8f795840cbb0' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        cartsCollection = {
            findOne: jest.fn(),
        };
        mongodb.getDatabase = jest.fn().mockReturnValue({
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue(cartsCollection),
            }),
        });
    });

    it('deve retornar um carrinho pelo ID com sucesso', async () => {
        const mockCart = { _id: new ObjectId('67f8ebf8153c8f795840cbb0'), userId: '67f05b0c3a96a8c4e11d1b5d', items: [] };
        cartsCollection.findOne.mockResolvedValue(mockCart);

        await getCartById(req, res);

        expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    it('deve retornar 404 se o carrinho não for encontrado', async () => {
        cartsCollection.findOne.mockResolvedValue(null);

        await getCartById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' });
    });

    it('deve retornar 500 se ocorrer um erro', async () => {
        cartsCollection.findOne.mockRejectedValue(new Error('Database error'));

        await getCartById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching cart', error: expect.any(Error) });
    });
});