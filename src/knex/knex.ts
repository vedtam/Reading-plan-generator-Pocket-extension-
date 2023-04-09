import Knex from 'knex';

export const config = {
  production: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'password',
      database: 'project_x',
    },
  },
} as { [prop: string]: any };

export default Knex(config.production);
