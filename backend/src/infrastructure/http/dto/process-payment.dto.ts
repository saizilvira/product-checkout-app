import { IsString, IsNotEmpty, IsEmail, IsUUID, Length } from 'class-validator';

export class ProcessPaymentDto {
    @IsUUID()
    transactionId: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 200)
    paymentSourceId: string; // token de la tarjeta

    @IsEmail()
    customerEmail: string;
}