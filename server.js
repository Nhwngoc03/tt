const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối SQL Server
const config = {
    user: 'sa',                 // Thay bằng user SQL Server của bạn
    password: '12345',          // Thay bằng mật khẩu SQL Server
    server: 'localhost',        // Nếu SQL Server chạy trên máy bạn
    database: 'parking_system', // Tên database
    options: {
        encrypt: false,          // Nếu dùng SQL Server trên Windows, để false
        trustServerCertificate: true
    }
};

// Tạo kết nối SQL Server toàn cục
let globalPool;

// Hàm kết nối database
async function connectDB() {
    if (!globalPool) {
        try {
            globalPool = await sql.connect(config);
            console.log('✅ Kết nối SQL Server thành công!');
        } catch (err) {
            console.error('❌ Lỗi kết nối SQL Server:', err);
        }
    }
}

// Kết nối database khi khởi động server
connectDB();

// API lấy danh sách xe vào
app.get('/vehicles/in', async (req, res) => {
    try {
        if (!globalPool) await connectDB();
        const result = await globalPool.request().query("SELECT * FROM vehicles WHERE exit_time IS NULL");
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách xe vào:', err);
        res.status(500).json({ error: err.message });
    }
});

// API lấy danh sách xe ra
app.get('/vehicles/out', async (req, res) => {
    try {
        if (!globalPool) await connectDB();
        const result = await globalPool.request().query("SELECT * FROM vehicles WHERE status = 'OUT'");
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách xe ra:', err);
        res.status(500).json({ error: err.message });
    }
});

// API lấy danh sách xe
app.get('/vehicles', async (req, res) => {
    try {
        if (!globalPool) await connectDB();
        const result = await globalPool.request().query('SELECT * FROM vehicles');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách xe:', err);
        res.status(500).json({ error: err.message });
    }
});

// API lấy danh sách người dùng
app.get('/users', async (req, res) => {
    try {
        if (!globalPool) await connectDB();
        const result = await globalPool.request().query('SELECT * FROM users');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách người dùng:', err);
        res.status(500).json({ error: err.message });
    }
});

// Chạy server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
