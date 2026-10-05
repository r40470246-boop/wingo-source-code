import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import configViewEngine from './config/configEngine.js';
import routes from './routes/web.js';
import cronJobContronler from './controllers/cronJobContronler.js';
import socketIoController from './controllers/socketIoController.js';

import connection from './config/connectDB.js';

dotenv.config();

// Auto-seed and migrate database tables/columns if missing
const initDB = async () => {
    try {
        await connection.execute(`CREATE TABLE IF NOT EXISTS roses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            phone VARCHAR(20) DEFAULT NULL,
            code VARCHAR(50) DEFAULT NULL,
            invite VARCHAR(50) DEFAULT NULL,
            f1 DOUBLE DEFAULT 0,
            f2 DOUBLE DEFAULT 0,
            f3 DOUBLE DEFAULT 0,
            f4 DOUBLE DEFAULT 0,
            time VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        await connection.execute(`CREATE TABLE IF NOT EXISTS level (
            id INT AUTO_INCREMENT PRIMARY KEY,
            level INT NOT NULL DEFAULT 0,
            f1 DOUBLE DEFAULT 0,
            f2 DOUBLE DEFAULT 0,
            f3 DOUBLE DEFAULT 0,
            f4 DOUBLE DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        const [lvlRows] = await connection.query('SELECT id FROM level');
        if (!lvlRows || lvlRows.length === 0) {
            await connection.execute("INSERT INTO level (level, f1, f2, f3, f4) VALUES (0, 0.6, 0.18, 0.054, 0.0162)");
        }

        await connection.execute(`CREATE TABLE IF NOT EXISTS wingo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            period VARCHAR(50) NOT NULL,
            amount INT DEFAULT 0,
            game VARCHAR(20) NOT NULL,
            status INT DEFAULT 0,
            time VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        await connection.execute(`CREATE TABLE IF NOT EXISTS minutes_1 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_product VARCHAR(100) DEFAULT NULL,
            phone VARCHAR(20) NOT NULL,
            code VARCHAR(50) DEFAULT NULL,
            invite VARCHAR(50) DEFAULT NULL,
            stage VARCHAR(50) NOT NULL,
            level INT DEFAULT 0,
            money DOUBLE DEFAULT 0,
            price DOUBLE DEFAULT 0,
            amount INT DEFAULT 1,
            fee DOUBLE DEFAULT 0,
            get DOUBLE DEFAULT 0,
            game VARCHAR(20) NOT NULL,
            bet VARCHAR(20) NOT NULL,
            result VARCHAR(50) DEFAULT NULL,
            more VARCHAR(50) DEFAULT NULL,
            status INT DEFAULT 0,
            today VARCHAR(50) DEFAULT NULL,
            time VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        await connection.execute(`CREATE TABLE IF NOT EXISTS bank_recharge (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name_bank VARCHAR(255) DEFAULT 'UPI',
            name_user VARCHAR(255) DEFAULT 'Admin',
            stk VARCHAR(255) DEFAULT 'admin@upi',
            type VARCHAR(50) DEFAULT 'bank',
            time VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        const [rows] = await connection.query('SELECT * FROM bank_recharge');
        if (!rows || rows.length === 0) {
            await connection.execute("INSERT INTO bank_recharge (name_bank, name_user, stk, type, time) VALUES ('HDFC BANK', 'Admin', '1234567890 / HDFC0001234', 'bank', ?)", [String(Date.now())]);
            await connection.execute("INSERT INTO bank_recharge (name_bank, name_user, stk, type, time) VALUES ('UPI / Paytm', 'Admin', 'payee@upi', 'momo', ?)", [String(Date.now())]);
        }

        await connection.execute(`CREATE TABLE IF NOT EXISTS result_5d (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_product VARCHAR(100) DEFAULT NULL,
            phone VARCHAR(20) DEFAULT NULL,
            code VARCHAR(50) DEFAULT NULL,
            invite VARCHAR(50) DEFAULT NULL,
            stage VARCHAR(50) DEFAULT NULL,
            level INT DEFAULT 0,
            money DOUBLE DEFAULT 0,
            price DOUBLE DEFAULT 0,
            amount INT DEFAULT 1,
            fee DOUBLE DEFAULT 0,
            get DOUBLE DEFAULT 0,
            game INT DEFAULT 1,
            join_bet VARCHAR(50) DEFAULT NULL,
            bet VARCHAR(50) DEFAULT NULL,
            result VARCHAR(50) DEFAULT NULL,
            status INT DEFAULT 0,
            time VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        await connection.execute(`CREATE TABLE IF NOT EXISTS result_k3 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_product VARCHAR(100) DEFAULT NULL,
            phone VARCHAR(20) DEFAULT NULL,
            code VARCHAR(50) DEFAULT NULL,
            invite VARCHAR(50) DEFAULT NULL,
            stage VARCHAR(50) DEFAULT NULL,
            level INT DEFAULT 0,
            money DOUBLE DEFAULT 0,
            price DOUBLE DEFAULT 0,
            amount INT DEFAULT 1,
            fee DOUBLE DEFAULT 0,
            get DOUBLE DEFAULT 0,
            game INT DEFAULT 1,
            join_bet VARCHAR(50) DEFAULT NULL,
            typeGame VARCHAR(50) DEFAULT NULL,
            bet VARCHAR(50) DEFAULT NULL,
            result VARCHAR(50) DEFAULT NULL,
            status INT DEFAULT 0,
            time VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        const addColumnSafely = async (table, column, colDef) => {
            try {
                const [cols] = await connection.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
                if (!cols || cols.length === 0) {
                    await connection.execute(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${colDef};`);
                    console.log(`Successfully added column ${column} to table ${table}`);
                }
            } catch (e) {
                console.error(`Error adding column ${column} to table ${table}:`, e.message);
            }
        };

        await addColumnSafely('result_5d', 'result', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('result_5d', 'get', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_5d', 'id_product', 'VARCHAR(100) DEFAULT NULL');
        await addColumnSafely('result_5d', 'level', 'INT DEFAULT 0');
        await addColumnSafely('result_5d', 'money', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_5d', 'price', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_5d', 'amount', 'INT DEFAULT 1');
        await addColumnSafely('result_5d', 'fee', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_5d', 'join_bet', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('result_5d', 'bet', 'VARCHAR(50) DEFAULT NULL');

        await addColumnSafely('result_k3', 'result', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('result_k3', 'get', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_k3', 'id_product', 'VARCHAR(100) DEFAULT NULL');
        await addColumnSafely('result_k3', 'level', 'INT DEFAULT 0');
        await addColumnSafely('result_k3', 'money', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_k3', 'price', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_k3', 'typeGame', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('result_k3', 'amount', 'INT DEFAULT 1');
        await addColumnSafely('result_k3', 'fee', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_k3', 'join_bet', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('result_k3', 'bet', 'VARCHAR(50) DEFAULT NULL');

        await addColumnSafely('minutes_1', 'result', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('minutes_1', 'get', 'DOUBLE DEFAULT 0');
        await addColumnSafely('minutes_1', 'money', 'DOUBLE DEFAULT 0');
        await addColumnSafely('minutes_1', 'id_product', 'VARCHAR(100) DEFAULT NULL');
        await addColumnSafely('minutes_1', 'level', 'INT DEFAULT 0');
        await addColumnSafely('minutes_1', 'today', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('minutes_1', 'fee', 'DOUBLE DEFAULT 0');
        await addColumnSafely('minutes_1', 'amount', 'INT DEFAULT 1');

        await addColumnSafely('recharge', 'utr', 'VARCHAR(100) DEFAULT NULL');
        await addColumnSafely('admin', 'win_rate', 'INT DEFAULT 80');

        try {
            await connection.execute("UPDATE users SET money = 10000 WHERE money = 0 OR money IS NULL");
            const [playerCheck] = await connection.query('SELECT id FROM users WHERE phone = ?', ['1111111111']);
            if (!playerCheck || playerCheck.length === 0) {
                await connection.execute(`INSERT INTO users (phone, password, code, invite, money, level, veri, status, time) VALUES (?, MD5(?), 'PLAYER1111', 'ADMIN123', 10000, 0, 1, 1, ?)`, ['1111111111', '111111', String(Date.now())]);
            } else {
                await connection.execute(`UPDATE users SET password = MD5(?), money = 10000, status = 1, veri = 1 WHERE phone = ?`, ['111111', '1111111111']);
            }
        } catch (e) {
            console.error('Error seeding player account:', e);
        }

        const seedInitialPeriod = async (table, gameVal) => {
            try {
                const [rows] = await connection.query(`SELECT id FROM \`${table}\` WHERE game = ? AND status = 0`, [gameVal]);
                if (!rows || rows.length === 0) {
                    let date = new Date();
                    let period = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + "0001";
                    if (table === 'wingo') {
                        await connection.execute(`INSERT INTO wingo (period, amount, game, status, time) VALUES (?, 0, ?, 0, ?)`, [period, String(gameVal), String(Date.now())]);
                    } else if (table === '5d') {
                        await connection.execute(`INSERT INTO \`5d\` (period, result, game, status, time) VALUES (?, '0', ?, 0, ?)`, [period, Number(gameVal), String(Date.now())]);
                    } else if (table === 'k3') {
                        await connection.execute(`INSERT INTO k3 (period, result, game, status, time) VALUES (?, '0', ?, 0, ?)`, [period, Number(gameVal), String(Date.now())]);
                    }
                }
            } catch (err) {
                console.error(`Seed ${table} error:`, err);
            }
        };

        await seedInitialPeriod('wingo', 'wingo');
        await seedInitialPeriod('wingo', 'wingo3');
        await seedInitialPeriod('wingo', 'wingo5');
        await seedInitialPeriod('wingo', 'wingo10');
        await seedInitialPeriod('5d', 1);
        await seedInitialPeriod('5d', 3);
        await seedInitialPeriod('5d', 5);
        await seedInitialPeriod('5d', 10);
        await seedInitialPeriod('k3', 1);
        await seedInitialPeriod('k3', 3);
        await seedInitialPeriod('k3', 5);
        await seedInitialPeriod('k3', 10);
    } catch (e) {
        console.error('Init DB error:', e);
    }
};
initDB();

// Prevent server crash on unhandled async errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup viewEngine
configViewEngine(app);
// init Web Routes
routes.initWebRouter(app);

// Cron game scheduler
cronJobContronler.cronJobGame1p(io);

// Check socket connection
socketIoController.sendMessageAdmin(io);

server.listen(port, () => {
    console.log("WinGo server running on port: " + port);
});
