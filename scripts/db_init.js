/**
 * db_init.js
 * --------------------------------------------------
 * Creates the database and all tables defined in db.sql.
 * Safe to re-run: uses CREATE TABLE IF NOT EXISTS and
 * detects missing columns to ALTER TABLE ADD COLUMN.
 *
 * Usage:  node scripts/db_init.js
 *         npm run db:init
 * --------------------------------------------------
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// ── Config ──────────────────────────────────────────
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || 'finlit_db';

// ── Helpers ─────────────────────────────────────────

/**
 * Read db.sql and split it into individual CREATE TABLE statements.
 * Returns an array of { tableName, sql } objects.
 */
function parseSQL() {
    const filePath = path.join(__dirname, '..', 'db.sql');
    const raw = fs.readFileSync(filePath, 'utf-8');

    // Remove single-line comments (-- ...) and blank-only lines
    const cleaned = raw
        .split('\n')
        .filter(line => !/^\s*--/.test(line))
        .join('\n');

    // Split on semicolons, trim, keep only CREATE TABLE blocks
    const statements = cleaned
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && /CREATE\s+TABLE/i.test(s));

    return statements.map(sql => {
        const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
        const tableName = match ? match[1] : 'unknown';
        return { tableName, sql };
    });
}

/**
 * Extract column definitions from a CREATE TABLE statement.
 * Returns a Map<columnName, fullDefinitionLine>.
 */
function extractColumns(createSQL) {
    const columns = new Map();

    // Grab the body between the first '(' and the last ')'
    const openIdx = createSQL.indexOf('(');
    const closeIdx = createSQL.lastIndexOf(')');
    if (openIdx === -1 || closeIdx === -1) return columns;

    const body = createSQL.substring(openIdx + 1, closeIdx);

    // Split carefully — commas inside parentheses (e.g. DECIMAL(12,2)) should not split
    const lines = [];
    let depth = 0;
    let current = '';
    for (const ch of body) {
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            lines.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    if (current.trim()) lines.push(current.trim());

    for (const line of lines) {
        // Skip FOREIGN KEY, PRIMARY KEY, UNIQUE, INDEX, CONSTRAINT lines
        if (/^\s*(FOREIGN\s+KEY|PRIMARY\s+KEY|UNIQUE|INDEX|KEY\s|CONSTRAINT)/i.test(line)) continue;

        const colMatch = line.match(/^`?(\w+)`?\s+(.+)/);
        if (colMatch) {
            columns.set(colMatch[1].toLowerCase(), colMatch[2]);
        }
    }

    return columns;
}

// ── Main ────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║        DATABASE INITIALISATION           ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('');

    // 1. Connect WITHOUT database (so we can create it)
    const conn = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        multipleStatements: true,
    });

    // 2. Create database if it doesn't exist
    console.log(`[1/4] Ensuring database "${DB_NAME}" exists...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`      Database "${DB_NAME}" is ready.`);
    console.log('');

    // 3. Switch to the target database
    await conn.query(`USE \`${DB_NAME}\``);

    // 4. Disable FK checks so tables can be created in any order
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // 5. Parse the SQL file
    const tables = parseSQL();
    console.log(`[2/4] Found ${tables.length} table(s) in db.sql`);
    console.log('');

    // 6. Create each table
    console.log('[3/4] Creating tables...');
    for (const { tableName, sql } of tables) {
        // Make the statement idempotent
        const safeSQL = sql.replace(
            /CREATE\s+TABLE(?!\s+IF\s+NOT\s+EXISTS)/i,
            'CREATE TABLE IF NOT EXISTS'
        );

        try {
            await conn.query(safeSQL);
            console.log(`      + ${tableName} — OK`);
        } catch (err) {
            console.error(`      ! ${tableName} — FAILED: ${err.message}`);
        }
    }
    console.log('');

    // 7. Detect missing columns and add them (schema update)
    console.log('[4/4] Checking for schema updates...');
    let updates = 0;

    for (const { tableName, sql } of tables) {
        try {
            const [existingCols] = await conn.query(`SHOW COLUMNS FROM \`${tableName}\``);
            const existingNames = new Set(existingCols.map(c => c.Field.toLowerCase()));

            const desiredColumns = extractColumns(sql);

            for (const [colName, colDef] of desiredColumns) {
                if (!existingNames.has(colName)) {
                    // Clean the column definition — remove trailing commas
                    const cleanDef = colDef.replace(/,\s*$/, '');
                    const alterSQL = `ALTER TABLE \`${tableName}\` ADD COLUMN \`${colName}\` ${cleanDef}`;
                    await conn.query(alterSQL);
                    console.log(`      ~ ${tableName}.${colName} — ADDED`);
                    updates++;
                }
            }
        } catch (err) {
            console.error(`      ! ${tableName} — could not check columns: ${err.message}`);
        }
    }

    if (updates === 0) {
        console.log('      No new columns to add. Schema is up to date.');
    }

    // 8. Re-enable FK checks
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // 9. Done
    await conn.end();

    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║    DATABASE INITIALISATION COMPLETE      ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
    process.exit(0);
}

main().catch(err => {
    console.error('');
    console.error('FATAL:', err.message);
    process.exit(1);
});
