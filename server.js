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
                await connection.execute(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${colDef};`);
            } catch (e) {
                // Column likely already exists
            }
        };

        await addColumnSafely('result_5d', 'result', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('result_5d', 'get', 'DOUBLE DEFAULT 0');
        await addColumnSafely('result_k3', 'result', 'VARCHAR(50) DEFAULT NULL');
        await addColumnSafely('result_k3', 'get', 'DOUBLE DEFAULT 0');
        await addColumnSafely('minutes_1', 'money', 'DOUBLE DEFAULT 0');
        await addColumnSafely('recharge', 'utr', 'VARCHAR(100) DEFAULT NULL');
        await addColumnSafely('admin', 'win_rate', 'INT DEFAULT 80');
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
