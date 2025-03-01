import {IsString, IsNotEmpty, IsOptional} from "class-validator";
import {Category} from "../../domain/types/Category.ts";

export class CardDTO {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsOptional()
  tag?: string;

  constructor(question: string, answer: string, tag?: string) {
    this.question = question;
    this.answer = answer;
    this.tag = tag;
  }
}

export interface CardResponse {
  id: string;
  question: string;
  category: Category;
  answer?: string;
  tag?: string;
}

