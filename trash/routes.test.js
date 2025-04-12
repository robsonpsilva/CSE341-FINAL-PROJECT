const request = require('supertest');
const app = require('./app'); // Importa o app configurado

// Mock da função de autenticação
jest.mock('./middleware/authenticate', () => ({
  isAuthenticated: (req, res, next) => next(),
}));

// Mock do Products Controller
jest.mock('./controllers/products', () => ({
  getAllProducts: (req, res) => res.status(200).json([{ id: 1, name: "Product 1" }]),
  getSingleProduct: (req, res) => res.status(200).json({ id: 1, name: "Product 1" }),
}));

// Mock do Category Controller
jest.mock('./controllers/categories', () => ({
  getAllCategories: (req, res) => res.status(200).json([{ id: 1, name: "Category 1" }]),
  getSingleCategory: (req, res) => res.status(200).json({ id: 1, name: "Category 1" }),
}));

// Mock do Cart Controller
jest.mock('./controllers/cart', () => ({
  getCartById: (req, res) => res.status(200).json({ id: 1, items: [] }),
}));

describe('Test Routes', () => {
  test('GET /products should return all products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Product 1" }]);
  });

  test('GET /products/:id should return a single product', async () => {
    const response = await request(app).get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: "Product 1" });
  });

  test('GET /categories should return all categories', async () => {
    const response = await request(app).get('/categories');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Category 1" }]);
  });

  test('GET /categories/:id should return a single category', async () => {
    const response = await request(app).get('/categories/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: "Category 1" });
  });

  test('GET /carts/:id should return a single cart', async () => {
    const response = await request(app).get('/carts/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, items: [] });
  });
});