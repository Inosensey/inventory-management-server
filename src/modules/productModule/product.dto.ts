import { IsInt, IsString, IsOptional } from 'class-validator';
export class Product {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  description: string;

  @IsInt()
  category: number;

  @IsString()
  name: string;

  @IsInt()
  price: number;
}
