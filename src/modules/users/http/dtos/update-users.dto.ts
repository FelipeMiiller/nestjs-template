import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  readonly password: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  readonly hashRefreshToken: string;
}
