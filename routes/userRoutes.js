const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Khai báo các route cho User
router.post('/', userController.createUser);           // Create (Tạo mới)
router.get('/', userController.getAllUsers);           // Read All (Lấy danh sách + Tìm theo username)

// --- CÁC ROUTE MỚI THÊM (Yêu cầu 2 & 3) ---
// Phải đặt trước /:id để không bị dính lỗi nhận diện nhầm
router.post('/enable', userController.enableUser);     // Chuyển status thành true
router.post('/disable', userController.disableUser);   // Chuyển status thành false
// ------------------------------------------

router.get('/:id', userController.getUserById);        // Read by ID (Lấy theo ID)
router.put('/:id', userController.updateUser);         // Update (Cập nhật)
router.delete('/:id', userController.deleteUser);      // Soft Delete (Xóa mềm)

module.exports = router;