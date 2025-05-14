/**
 * Remove todas as propriedades com valor undefined de um objeto, inclusive em objetos aninhados.
 * Arrays são preservados.
 * @param obj Objeto de entrada
 * @returns Novo objeto sem propriedades undefined
 */
export function removeUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, value]) => value !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)]),
    ) as T;
  }
  return obj;
}

/**
 * Remove campos específicos de um objeto retornando uma nova cópia sem os campos
 * @param obj Objeto original
 * @param fields Array de campos para remover
 * @returns Nova cópia do objeto sem os campos especificados
 */
export function removeFields<T extends object, K extends keyof T>(obj: T, fields: K[]): Omit<T, K> {
  const newObj = { ...obj };
  fields.forEach((field) => delete newObj[field]);
  return newObj;
}
