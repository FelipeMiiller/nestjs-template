import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class ProfileInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly avatarUrl?: string;
}
