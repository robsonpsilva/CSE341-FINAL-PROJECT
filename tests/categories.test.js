const { getAllCategories, getSingleCategory } = require('../controllers/categories'); // Substitua 'seuArquivo' pelo caminho do seu arquivo
const mongodb = require('../data/database'); // Substitua 'mongodb' pelo caminho do seu arquivo de configuração do MongoDB
const { ObjectId } = require('mongodb');

jest.mock('../data/database');

describe('Category GET Operations', () => {
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

    describe('getAllCategories', () => {
        it('deve retornar todas as categorias com sucesso', async () => {
            const mockCategories = [{ _id: '1', name: 'Category 1' }, { _id: '2', name: 'Category 2' }];
            collection.toArray.mockResolvedValue(mockCategories);

            await getAllCategories(req, res);

            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCategories);
        });

        it('deve retornar um erro 500 em caso de falha na consulta', async () => {
            const mockError = new Error('Database error');
            collection.toArray.mockRejectedValue(mockError);

            await getAllCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while retrieving categories.' });
        });
    });

    describe('getSingleCategory', () => {
        it('deve retornar uma categoria quando o ID é válido e a categoria é encontrada', async () => {
            const mockCategory = [{ _id: new ObjectId('67f078b6bf53ca227c488681'), name: 'Test Category' }];
            collection.toArray.mockResolvedValue(mockCategory);

            await getSingleCategory(req, res);

            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCategory[0]);
        });

        it('deve retornar 404 quando a categoria não é encontrada', async () => {
            collection.toArray.mockResolvedValue([]);

            await getSingleCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
        });

        it('deve retornar 400 quando o ID é inválido', async () => {
            req.params.id = 'invalidId';

            await getSingleCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
        });

        it('deve retornar 500 em caso de erro na consulta', async () => {
            const mockError = new Error('Database error');
            collection.toArray.mockRejectedValue(mockError);

            await getSingleCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while retrieving the category.' });
        });
    });
});