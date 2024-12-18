import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field(() => String)
  @IsString()
  @IsOptional()
  readonly name: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
