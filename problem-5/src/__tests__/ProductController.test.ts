import request from 'supertest';
// jest.mock must be before imports that use it, forcing hoisting. 
// But here we rely on hoisting.
// We define the mock factory to return a stable object.

jest.mock('../data-source', () => {
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  return {
    AppDataSource: {
      getRepository: jest.fn(() => mockRepo),
      initialize: jest.fn().mockResolvedValue(true),
    },
  };
});

import app from '../app';
import { AppDataSource } from '../data-source';

describe('ProductController', () => {
    let mockRepository: any;

    beforeAll(() => {
        // Verify mock injection
        mockRepository = AppDataSource.getRepository({} as any);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /products - should list all products', async () => {
        const products = [{ id: 1, name: 'Test Product', price: 100 }];
        mockRepository.find.mockResolvedValue(products);
        
        const res = await request(app).get('/products');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(products);
        expect(mockRepository.find).toHaveBeenCalled();
    });

    it('GET /products/:id - should get product by id', async () => {
        const product = { id: 1, name: 'Test Product', price: 100 };
        mockRepository.findOne.mockResolvedValue(product);
        
        const res = await request(app).get('/products/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(product);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('GET /products/:id - should return error if product not found', async () => {
        mockRepository.findOne.mockResolvedValue(null);
        
        const res = await request(app).get('/products/999');
        // The controller returns a string "unregistered product"
        expect(res.status).toBe(200);
        expect(res.text).toContain("unregistered product");
    });

    it('POST /products - should create a product', async () => {
        const newProduct = { name: 'New Product', price: 200, description: 'Desc' };
        const savedProduct = { id: 1, ...newProduct };
        mockRepository.save.mockResolvedValue(savedProduct);
        
        const res = await request(app).post('/products').send(newProduct);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(savedProduct);
        expect(mockRepository.save).toHaveBeenCalled();
    });

    it('PUT /products/:id - should update a product', async () => {
        const existingProduct = { id: 1, name: 'Old Name', price: 100 };
        const updateData = { name: 'New Name' };
        const updatedProduct = { ...existingProduct, ...updateData };
        
        mockRepository.findOneBy.mockResolvedValue(existingProduct);
        mockRepository.save.mockResolvedValue(updatedProduct);
        
        const res = await request(app).put('/products/1').send(updateData);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedProduct);
        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockRepository.save).toHaveBeenCalled();
    });

    it('DELETE /products/:id - should delete a product', async () => {
        const product = { id: 1, name: 'To Delete' };
        mockRepository.findOneBy.mockResolvedValue(product);
        mockRepository.remove.mockResolvedValue(product);
        
        const res = await request(app).delete('/products/1');
        expect(res.status).toBe(200);
        expect(res.text).toContain("product has been removed");
        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockRepository.remove).toHaveBeenCalledWith(product);
    });
});
