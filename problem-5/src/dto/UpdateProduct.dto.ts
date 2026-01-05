import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;
}
