const Role = require('../models/Role');

// 1. Create (Tạo mới)
exports.createRole = async (req, res) => {
    try {
        const newRole = await Role.create(req.body);
        res.status(201).json({ success: true, data: newRole });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Read - Get All (Lấy tất cả, bỏ qua những record đã xoá mềm)
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Read - Get By ID (Lấy theo ID)
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ success: false, message: "Không tìm thấy Role" });
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update (Cập nhật)
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!role) return res.status(404).json({ success: false, message: "Không tìm thấy Role" });
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 5. Delete - Xoá mềm (Chuyển isDeleted thành true)
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!role) return res.status(404).json({ success: false, message: "Không tìm thấy Role" });
        res.status(200).json({ success: true, message: "Đã xoá mềm Role thành công" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};