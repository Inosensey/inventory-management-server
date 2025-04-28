import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductCatInfoDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  categoryName: string;
}

export class ProductCatResponseDto {
  @Expose()
  @IsBoolean()
  success: boolean;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ProductCatInfoDTO)
  data: ProductCatInfoDTO[];

  @Expose()
  @IsString()
  message: string;
}
