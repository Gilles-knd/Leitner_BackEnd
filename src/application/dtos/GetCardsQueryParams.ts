import {IsArray, IsOptional, IsString} from "class-validator";
import { Transform } from 'class-transformer';

export class GetCardsQueryParamsDTO {
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
    @IsArray()
    @IsString({ each: true })
    tag?: string[];
}