import { IsBoolean, IsNotEmpty } from "class-validator";

export class AnswerCardDTO {
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean;

  constructor(isValid: boolean) {
    this.isValid = isValid;
  }
}
