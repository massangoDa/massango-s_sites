const mongoose = require('mongoose');

// ユーザーモデルのスキーマを定義
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// ユーザーモデルを作成
const User = mongoose.model('User', userSchema);

module.exports = User;
