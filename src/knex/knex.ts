import Knex from 'knex';

export const config = {
  production: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'admin',
      password: 'password',
      database: 'bookminder',
    },
  },
} as { [prop: string]: any };

export default Knex(config.production);
