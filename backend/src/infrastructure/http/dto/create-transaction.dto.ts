import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    Length,
    Matches,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    fullName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Length(7, 20)
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(2, 10)
    documentType?: string;

    @IsOptional()
    @IsString()
    @Length(5, 50)
    documentNumber?: string;
}

class DeliveryDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 500)
    address: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    city: string;

    @IsOptional()
    @IsString()
    @Length(2, 100)
    region?: string;

    @IsOptional()
    @IsString()
    @Length(2, 20)
    postalCode?: string;

    @IsOptional()
    @IsString()
    @Length(7, 20)
    phone?: string;
}

export class CreateTransactionDto {
    @IsUUID()
    productId: string;

    @ValidateNested()
    @Type(() => CustomerDto)
    customer: CustomerDto;

    @ValidateNested()
    @Type(() => DeliveryDto)
    delivery: DeliveryDto;

    @IsOptional()
    @IsString()
    @Length(3, 30)
    cardBrand?: string;

    @IsOptional()
    @IsString()
    @Length(4, 4)
    @Matches(/^\d{4}$/)
    cardLastFour?: string;
}