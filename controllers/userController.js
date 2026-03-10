const User = require('../models/User');

// 1. Create (Tạo mới)
exports.createUser = async (req, res) => {
    try {
        // Lưu ý: Trong thực tế bạn nên mã hoá (hash) password bằng bcrypt trước khi lưu
        const newUser = await User.create(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Read - Get All (Lấy tất cả + Tìm kiếm theo Username + Populate Role)
exports.getAllUsers = async (req, res) => {
    try {
        const { username } = req.query;
        
        // Mặc định chỉ lấy user chưa bị xoá mềm
        let query = { isDeleted: false }; 

        // Nếu có query username, thêm điều kiện tìm kiếm "includes"
        if (username) {
            query.username = { $regex: username, $options: 'i' }; 
        }

        // populate('role') dùng để lấy chi tiết thông tin của Role thay vì chỉ lấy ObjectID
        const users = await User.find(query).populate('role', 'name description');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Read - Get By ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role', 'name');
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy User" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update (Cập nhật)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy User" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 5. Delete - Xoá mềm
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy User" });
        res.status(200).json({ success: true, message: "Đã xoá mềm User thành công" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ---------------- CÁC YÊU CẦU BỔ SUNG ----------------

// Yêu cầu 2: Enable User (Chuyển status -> true)
exports.enableUser = async (req, res) => {
    try {
        const { username, email } = req.body; // Lấy thông tin từ Body
        
        // Tìm user có đúng username, email và chưa bị xoá mềm. Nếu thấy thì update status = true
        const user = await User.findOneAndUpdate(
            { username: username, email: email, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, message: "Sai thông tin Username hoặc Email!" });
        res.status(200).json({ success: true, message: "Đã kích hoạt (enable) User thành công!", data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Yêu cầu 3: Disable User (Chuyển status -> false)
exports.disableUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Tương tự như trên nhưng update status = false
        const user = await User.findOneAndUpdate(
            { username: username, email: email, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, message: "Sai thông tin Username hoặc Email!" });
        res.status(200).json({ success: true, message: "Đã vô hiệu hoá (disable) User thành công!", data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Yêu cầu 4: Lấy tất cả user theo Role ID
exports.getUsersByRole = async (req, res) => {
    try {
        const roleId = req.params.id; // Lấy ID của Role từ URL
        
        // Tìm các user có role khớp với ID truyền vào
        const users = await User.find({ role: roleId, isDeleted: false }).populate('role', 'name');
        
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};