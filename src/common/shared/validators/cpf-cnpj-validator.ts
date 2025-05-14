function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === Number(cpf.charAt(10));
}

function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === Number(digits.charAt(1));
}

import {
  type ValidationArguments,
  type ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsCPFOrCNPJ(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isCPFOrCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          if (!value) return false;
          const cleanValue = value.replace(/\D/g, '');
          if (cleanValue.length === 11) {
            return isValidCPF(cleanValue);
          }
          if (cleanValue.length === 14) {
            return isValidCNPJ(cleanValue);
          }
          return false;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Document must be a valid CPF or CNPJ';
        },
      },
    });
  };
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          if (!value) return false;
          const cleanValue = value.replace(/\D/g, '');
          if (cleanValue.length === 11) {
            return isValidCPF(cleanValue);
          }
          return false;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Document must be a valid CPF';
        },
      },
    });
  };
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          if (!value) return false;
          const cleanValue = value.replace(/\D/g, '');
          if (cleanValue.length === 14) {
            return isValidCNPJ(cleanValue);
          }
          return false;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Document must be a valid CNPJ';
        },
      },
    });
  };
}
