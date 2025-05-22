import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, ValidateNested } from 'class-validator';
import { TransformToHash } from 'src/common/shared/validators/TransformToHash.validator';
import { ProfileInput } from './create-profile.dto';
import { Roles } from '../../domain/entities/users.entity';


@InputType()
export class UserInput {
  @Field(() => String)
  @IsString()
  @IsOptional()
  readonly name: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Field(() => String)
  @IsString()

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }
  )
  @TransformToHash()
  readonly password: string;

  @Field(() => String)
  @IsOptional()
  @IsEnum(Roles)
  readonly role: Roles.USER;

  @Field(() => ProfileInput)
  @IsNotEmpty()
  @ValidateNested()
  readonly profile: ProfileInput;
}

