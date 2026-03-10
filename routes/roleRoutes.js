const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController'); // <-- THÊM DÒNG NÀY

// Khai báo các route cho Role
router.post('/', roleController.createRole);           // Create
router.get('/', roleController.getAllRoles);           // Read All
router.get('/:id', roleController.getRoleById);        // Read by ID
router.put('/:id', roleController.updateRole);         // Update
router.delete('/:id', roleController.deleteRole);      // Soft Delete

// --- ROUTE MỚI THÊM (Yêu cầu 4) ---
// Lấy danh sách tất cả các user thuộc một Role cụ thể
router.get('/:id/users', userController.getUsersByRole);
// ----------------------------------

module.exports = router;