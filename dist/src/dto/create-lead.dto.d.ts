import { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator';
export declare class IsValidEmailDomainConstraint implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsValidEmailDomain(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare class CreateLeadDto {
    name: string;
    email: string;
    interest: string;
    message: string;
    date?: string;
    time?: string;
}
