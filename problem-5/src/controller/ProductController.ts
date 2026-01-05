import { Request, Response } from "express";
import { ProductService } from "../service/ProductService";
import { CreateProductDto } from "../dto/CreateProduct.dto";
import { UpdateProductDto } from "../dto/UpdateProduct.dto";

export class ProductController {

    private productService = new ProductService();

    async all(request: Request, response: Response) {
        return this.productService.getAll();
    }

    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id);
        const product = await this.productService.getOne(id);

        if (!product) {
            return "unregistered product";
        }
        return product;
    }

    async save(request: Request, response: Response) {
        const body: CreateProductDto = request.body;
        return this.productService.create(body);
    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id);
        const result = await this.productService.delete(id);

        if (!result) {
            return "this product not exist";
        }
        return "product has been removed";
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id);
        const body: UpdateProductDto = request.body;
        
        const result = await this.productService.update(id, body);

        if (!result) {
            return "this product not exist";
        }
        return result;
    }
}
