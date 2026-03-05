const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    console.log('--- Starting Database Initialization ---');

    const connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        multipleStatements: true
    };

    let connection;

    try {
        // 1. Create connection (without database first)
        connection = await mysql.createConnection(connectionConfig);
        console.log('✔ Connected to MySQL server.');

        // 2. Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'finlit_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`✔ Database "${dbName}" ensured.`);

        // 3. Switch to the database
        await connection.query(`USE \`${dbName}\`;`);
        console.log(`✔ Switched to database "${dbName}".`);

        // 4. Read SQL_Base.sql
        const sqlPath = path.join(__dirname, '..', 'SQL_Base.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // 5. Execute the SQL script
        // multipleStatements: true allows us to run the whole file at once
        console.log('⚡ Executing SQL_Base.sql...');
        await connection.query(sql);
        console.log('✔ SQL_Base.sql executed successfully.');

        console.log('--- Database Initialization Complete ---');
    } catch (error) {
        console.error('✖ Database Initialization Failed:');
        console.error(error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initDB();
