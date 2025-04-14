const { getAllProducts, getSingleProduct } = require('../controllers/products'); // Substitua 'seuArquivo' pelo caminho do seu arquivo
const mongodb = require('../data/database'); // Substitua 'mongodb' pelo caminho do seu arquivo de configuração do MongoDB
const { ObjectId } = require('mongodb');

jest.mock('../data/database');

describe('Product Controller', () => {
    let req, res, collection;

    beforeEach(() => {
        req = { params: { id: '67f078b6bf53ca227c488681' } };
        res = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        collection = {
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn(),
        };
        mongodb.getDatabase = jest.fn().mockReturnValue({
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue(collection),
            }),
        });
    });

    describe('getAllProducts', () => {
        it('deve retornar todos os produtos com sucesso', async () => {
            const mockProducts = [{ _id: '1', name: 'Product 1' }, { _id: '2', name: 'Product 2' }];
            collection.toArray.mockResolvedValue(mockProducts);

            await getAllProducts(req, res);

            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });

        it('deve retornar um erro 500 em caso de falha na consulta', async () => {
            const mockError = new Error('Database error');
            collection.toArray.mockRejectedValue(mockError);

            await getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while retrieving products.' });
        });
    });
     describe('getSingleProduct', () => {
        it('deve retornar um produto quando o ID é válido e o produto é encontrado', async () => {
            const mockProduct = [{ _id: new ObjectId('67f078b6bf53ca227c488681'), name: 'Test Product' }];
            collection.toArray.mockResolvedValue(mockProduct);

            await getSingleProduct(req, res);

            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProduct[0]);
        });

        it('deve retornar 404 quando o produto não é encontrado', async () => {
            collection.toArray.mockResolvedValue([]);

            await getSingleProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
        });

        it('deve retornar 400 quando o ID é inválido', async () => {
            req.params.id = 'invalidId';

            await getSingleProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
        });

        it('deve retornar 500 em caso de erro na consulta', async () => {
            const mockError = new Error('Database error');
            collection.toArray.mockRejectedValue(mockError);

            await getSingleProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while retrieving the product.' });
        });
    });

   
});