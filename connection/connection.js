import mysql from "mysql2";
import dotenv from "dotenv";

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: ''
    },
);

export default db;