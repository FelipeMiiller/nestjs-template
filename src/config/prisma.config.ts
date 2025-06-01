import { registerAs } from '@nestjs/config';

const config = {
  url: process.env.POSTGRES_URL,
};

export default registerAs('prisma', (): typeof config => config);
