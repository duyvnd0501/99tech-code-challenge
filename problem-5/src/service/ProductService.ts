import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { CreateProductDto } from "../dto/CreateProduct.dto";
import { UpdateProductDto } from "../dto/UpdateProduct.dto";

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);

    async getAll() {
        return this.productRepository.find();
    }

    async getOne(id: number) {
        return this.productRepository.findOne({
            where: { id }
        });
    }

    async create(data: CreateProductDto) {
        const product = Object.assign(new Product(), {
            name: data.name,
            price: data.price,
            description: data.description
        });
        return this.productRepository.save(product);
    }

    async update(id: number, data: UpdateProductDto) {
        let productToUpdate = await this.productRepository.findOneBy({ id });

        if (!productToUpdate) {
            return null;
        }

        productToUpdate.name = data.name || productToUpdate.name;
        productToUpdate.price = data.price || productToUpdate.price;
        productToUpdate.description = data.description || productToUpdate.description;

        return this.productRepository.save(productToUpdate);
    }

    async delete(id: number) {
        let productToRemove = await this.productRepository.findOneBy({ id });

        if (!productToRemove) {
            return null;
        }

        return this.productRepository.remove(productToRemove);
    }
}
