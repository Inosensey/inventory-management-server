import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateProductDTO {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

class categoryDTO {
  @Expose()
  categoryName: string;
}

export class SelectProductDTO {
  @Expose()
  @Transform(({ obj }: { obj: { _id: string } }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }: { obj: { category: string } }) =>
    obj.category.toString(),
  )
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => categoryDTO)
  @Expose()
  categoryInfo?: categoryDTO[];

  @Expose()
  price: number;

  @Expose()
  description: string;
}

export class ProductResponseDto {
  @Expose()
  @IsBoolean()
  success: boolean;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => SelectProductDTO)
  data: SelectProductDTO[];

  @Expose()
  @IsString()
  message: string;
}
