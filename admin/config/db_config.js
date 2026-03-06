require('dotenv').config();
const env = process.env.NODE_ENV;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const DB_POOL = {
    min: 2, max: 50, acquireTimeoutMillis: 60 * 1000, createTimeoutMillis: 3000, idleTimeoutMillis: 60000,
    // reapIntervalMillis: 1000,createRetryIntervalMillis: 100,propagateCreateError: true
};

const Knexgame = require("knex")({
    client: "mysql2",
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        database: DB_NAME,

    },
    pool: DB_POOL,
});

module.exports = { Knexgame };
