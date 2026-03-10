const express = require('express');
const mongoose = require('mongoose');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware để parse dữ liệu JSON từ req.body
app.use(express.json());

// Chuỗi kết nối MongoDB (Thay thế bằng chuỗi kết nối thực tế của bạn)
const MONGO_URI = 'mongodb://127.0.0.1:27017/my_database'; 

// Kết nối Database
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Đã kết nối thành công với MongoDB'))
    .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Mount các Routes
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);

// Lắng nghe ở cổng 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});