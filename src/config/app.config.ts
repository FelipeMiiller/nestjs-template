import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || '3000',
  origin: process.env.ORIGIN || 'http://localhost:3000',
}));
/**
 * Retorna o caminho do arquivo .env de acordo com o ambiente
 * Exemplo: .env.development, .env.production, ou .env
 */

console.log('process.env', process.env.MONGO_DB_NAME);
export const pathEnv = (() => {
  const env = process.env.NODE_ENV?.trim();
  if (env && env !== '' && env !== 'undefined') {
    return `.env.${env}`;
  }
  return `.env`;
})();
console.log('pathEnv', pathEnv);
