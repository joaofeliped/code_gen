export default {
  dependencies: {
    sentry: '@sentry/node',
    graphql:
      'apollo-server-core graphql graphql-middleware-sentry graphql-yoga',
    dotenv: 'dotenv',
    database: 'pg pg-hstore sequelize sqlite3',
    winston: 'winston',
    youch: 'youch',
    express: 'express express-async-errors',
  },
  devDependencies: {
    jest: '@sucrase/jest-plugin @types/jest factory-girl faker jest supertest',
    eslint:
      'eslint@5.16.0 eslint-config-airbnb-base@13.2.0 eslint-config-prettier@6.0.0 eslint-plugin-import@2.18.0 eslint-plugin-prettier@3.1.0',
    nodemon: 'nodemon',
    prettier: 'prettier@1.18.2',
    devDatabase: 'sequelize-cli',
    sucrase: 'sucrase',
  },
}
