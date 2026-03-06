/**
 * db_seed.js
 * --------------------------------------------------
 * Inserts sample data into every table.
 * Uses INSERT IGNORE so it's safe to re-run without
 * creating duplicates (relies on PRIMARY KEY / UNIQUE).
 *
 * Usage:  node scripts/db_seed.js
 *         npm run db:seed
 * --------------------------------------------------
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// ── Config ──────────────────────────────────────────
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || 'finlit_db';

// ── Seed Data ───────────────────────────────────────

const seedData = [
    // ─── Roles ────────────────────────────────────
    {
        table: 'roles',
        columns: ['id', 'role', 'description'],
        rows: [
            [1, 'farmer', 'Farmer role — grow crops, manage land & sell produce'],
            [2, 'woman', 'Woman role — financial empowerment & savings challenges'],
            [3, 'student', 'Student role — learn budgeting & financial basics'],
            [4, 'young_adult', 'Young adult role — jobs, savings & real-world money skills'],
            [5, 'admin', 'Administrator with full access'],
        ],
    },

    // ─── Languages ────────────────────────────────
    {
        table: 'languages',
        columns: ['id', 'name', 'data_url', 'description'],
        rows: [
            [1, 'English', '/lang/en.json', 'English language pack'],
            [2, 'Hindi', '/lang/hi.json', 'Hindi language pack'],
            [3, 'Tamil', '/lang/ta.json', 'Tamil language pack'],
        ],
    },

    // ─── Users (one per role) ─────────────────────
    {
        table: 'users',
        columns: ['id', 'email', 'username', 'password', 'role_id', 'language', 'is_active', 'status'],
        rows: [
            [1, 'ravi.farmer@example.com', 'ravi_farmer', '$2a$10$dummyhashedpassword1', 1, 1, true, 'online'],
            [2, 'priya.woman@example.com', 'priya_woman', '$2a$10$dummyhashedpassword2', 2, 2, true, 'offline'],
            [3, 'arjun.student@example.com', 'arjun_student', '$2a$10$dummyhashedpassword3', 3, 1, true, 'offline'],
            [4, 'anita.young@example.com', 'anita_young', '$2a$10$dummyhashedpassword4', 4, 3, true, 'online'],
            [5, 'admin@example.com', 'super_admin', '$2a$10$dummyhashedpassword5', 5, 1, true, 'online'],
        ],
    },

    // ─── Works ────────────────────────────────────
    {
        table: 'works',
        columns: ['id', 'industry', 'description', 'salary', 'experience_required'],
        rows: [
            [1, 'Software Development', 'Build web and mobile applications', 55000.00, 2],
            [2, 'Teaching', 'Teach at a local school', 30000.00, 1],
            [3, 'Freelancing', 'Freelance graphic design & content writing', 25000.00, 0],
        ],
    },

    // ─── Farmer Profile ───────────────────────────
    {
        table: 'farmers',
        columns: ['id', 'user_id', 'experience', 'money', 'savings', 'reputation', 'financial_knowledge_score'],
        rows: [
            [1, 1, 5, 15000.00, 5000.00, 40, 30],
        ],
    },

    // ─── Woman Profile ────────────────────────────
    {
        table: 'women',
        columns: ['id', 'user_id', 'experience', 'money', 'savings', 'reputation', 'financial_knowledge_score'],
        rows: [
            [1, 2, 3, 12000.00, 8000.00, 50, 45],
        ],
    },

    // ─── Student Profile ──────────────────────────
    {
        table: 'students',
        columns: ['id', 'user_id', 'experience', 'money', 'savings', 'reputation', 'financial_knowledge_score'],
        rows: [
            [1, 3, 1, 2000.00, 500.00, 10, 20],
        ],
    },

    // ─── Young Adult Profile ──────────────────────
    {
        table: 'young_adults',
        columns: ['id', 'user_id', 'experience', 'work', 'money', 'savings', 'reputation', 'financial_knowledge_score'],
        rows: [
            [1, 4, 2, 1, 35000.00, 10000.00, 25, 35],
        ],
    },

    // ─── Farmer Seeds ─────────────────────────────
    {
        table: 'farmer_seeds',
        columns: ['id', 'name', 'description', 'growth_time', 'water_requirement', 'produce_possibility', 'base_price'],
        rows: [
            [1, 'Rice Seeds', 'High-yield paddy rice seeds', 120, 80, 70, 50.00],
            [2, 'Wheat Seeds', 'Premium winter wheat seeds', 90, 50, 85, 40.00],
            [3, 'Corn Seeds', 'Hybrid maize / corn seeds', 100, 60, 75, 45.00],
        ],
    },

    // ─── Crops ────────────────────────────────────
    {
        table: 'crops',
        columns: ['id', 'name', 'price', 'minimum_price', 'maximum_price', 'description'],
        rows: [
            [1, 'Rice', 200.00, 150.00, 300.00, 'Harvested paddy rice'],
            [2, 'Wheat', 180.00, 120.00, 250.00, 'Harvested wheat grain'],
            [3, 'Corn', 160.00, 100.00, 220.00, 'Harvested corn / maize'],
        ],
    },

    // ─── Farmer Land States ───────────────────────
    {
        table: 'farmer_land_states',
        columns: ['id', 'state', 'description'],
        rows: [
            [1, 'empty', 'Land is empty and ready for planting'],
            [2, 'planted', 'Seeds have been planted and are growing'],
            [3, 'ready_to_harvest', 'Crop is fully grown and ready to harvest'],
        ],
    },

    // ─── Farmer Lands ─────────────────────────────
    {
        table: 'farmer_lands',
        columns: ['id', 'user_id', 'state_id', 'seed_id', 'water_level', 'fertility_level', 'planted_time', 'harvest_time', 'used_slots'],
        rows: [
            [1, 1, 2, 1, 60, 80, '2026-03-01 08:00:00', '2026-06-29 08:00:00', 1],
        ],
    },

    // ─── Farmer Storage ───────────────────────────
    {
        table: 'farmer_storage',
        columns: ['id', 'farmer_id', 'capacity'],
        rows: [
            [1, 1, 100],
        ],
    },

    // ─── Farmer Storage Items ─────────────────────
    {
        table: 'farmer_storage_items',
        columns: ['id', 'storage_id', 'crop_id', 'quantity'],
        rows: [
            [1, 1, 2, 25],
        ],
    },

    // ─── Farmer Shop ──────────────────────────────
    {
        table: 'farmer_shop',
        columns: ['id', 'farmer_id', 'reputation'],
        rows: [
            [1, 1, 30],
        ],
    },

    // ─── Farmer Shop Items ────────────────────────
    {
        table: 'farmer_shop_items',
        columns: ['id', 'shop_id', 'crop_id', 'price', 'stock'],
        rows: [
            [1, 1, 2, 190.00, 10],
        ],
    },

    // ─── Banks ────────────────────────────────────
    {
        table: 'banks',
        columns: ['id', 'name', 'description', 'credit_interest', 'debit_interest'],
        rows: [
            [1, 'FinLit National Bank', 'A government-backed reliable bank with low interest', 8.50, 4.00],
            [2, 'Quick Cash Bank', 'A private bank offering fast loans at higher rates', 14.00, 6.50],
        ],
    },

    // ─── Bank System (CIBIL) ──────────────────────
    {
        table: 'bank_system',
        columns: ['id', 'user_id', 'cibil_score'],
        rows: [
            [1, 1, 720],
            [2, 4, 680],
        ],
    },

    // ─── Bank Accounts ────────────────────────────
    {
        table: 'bank_accounts',
        columns: ['id', 'user_id', 'bank_id', 'balance'],
        rows: [
            [1, 1, 1, 10000.00],
            [2, 4, 2, 20000.00],
        ],
    },

    // ─── Credit Loans ─────────────────────────────
    {
        table: 'credit_loans',
        columns: ['id', 'account', 'added_amount', 'total_amount', 'active'],
        rows: [
            [1, 1, 5000.00, 5425.00, true],
        ],
    },

    // ─── Debit Loans ──────────────────────────────
    {
        table: 'debit_loans',
        columns: ['id', 'account', 'paid_amount', 'total_amount', 'active'],
        rows: [
            [1, 2, 2000.00, 10000.00, true],
        ],
    },
];

// ── Main ────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║           DATABASE SEEDING               ║');
    console.log('╚══════════════════════════════════════════╝\n');

    const conn = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        database: DB_NAME,
    });

    for (const { table, columns, rows } of seedData) {
        const placeholders = columns.map(() => '?').join(', ');
        const colList = columns.map(c => `\`${c}\``).join(', ');
        const sql = `INSERT IGNORE INTO \`${table}\` (${colList}) VALUES (${placeholders})`;

        let inserted = 0;
        for (const row of rows) {
            try {
                const [result] = await conn.execute(sql, row);
                if (result.affectedRows > 0) inserted++;
            } catch (err) {
                console.error(`   ✘ ${table}: ${err.message}`);
            }
        }

        const skipped = rows.length - inserted;
        console.log(
            `   ✔ ${table} — ${inserted} inserted` +
            (skipped > 0 ? `, ${skipped} skipped (already exist)` : '')
        );
    }

    await conn.end();

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║       DATABASE SEEDING COMPLETE ✔        ║');
    console.log('╚══════════════════════════════════════════╝\n');
    process.exit(0);
}

main().catch(err => {
    console.error('\n✘ Fatal error during DB seed:', err.message);
    process.exit(1);
});
