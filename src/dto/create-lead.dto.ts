import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, Matches, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import * as dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

@ValidatorConstraint({ async: true })
export class IsValidEmailDomainConstraint implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments) {
    if (!email || typeof email !== 'string' || !email.includes('@')) return false;
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    try {
      const records = await resolveMx(domain);
      return records && records.length > 0;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email domain does not exist or cannot receive emails';
  }
}

export function IsValidEmailDomain(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidEmailDomainConstraint,
    });
  };
}

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name is too short' })
  @MaxLength(50, { message: 'Name is too long' })
  @Matches(/^\S+\s+\S+/, { message: 'Please provide both first and last name' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Interest is required' })
  interest: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MinLength(2, { message: 'Message should be at least 2 characters' })
  @MaxLength(1000, { message: 'Message is too long' })
  message: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  time?: string;
}
