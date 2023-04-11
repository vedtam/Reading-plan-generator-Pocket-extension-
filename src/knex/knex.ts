import Knex from 'knex';

export const config = {
  production: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'admin',
      password: '3Ujuj#tu*OS4esp$s*h=',
      database: 'bookminder',
    },
  },
} as { [prop: string]: any };

export default Knex(config.production);
