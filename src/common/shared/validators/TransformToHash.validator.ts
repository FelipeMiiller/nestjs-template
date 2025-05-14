import { hash } from 'bcrypt';

// Decorator para transformar a senha em hash
export function TransformToHash(salt = 8) {
  return (object: any, propertyName: string) => {
    let value: string;
    Object.defineProperty(object, propertyName, {
      enumerable: true,
      configurable: true,
      get: () => value,
      set: async (newValue: string) => {
        if (!newValue) {
          value = newValue;
          return;
        }
        value = await hash(newValue, salt);
      },
    });
  };
}
