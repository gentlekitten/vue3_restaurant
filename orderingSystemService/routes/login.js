
const express = require('express');
const db = require('../utils/db')
const router = express.Router();

router.post('/', function (req, res) {
    db.checkLogin(req, res)
})

router.post('/register', function (req, res) {
    const { registerUsername, registerPassword } = req.body;
    const sql = "insert into user values (?,?,?)";
    const sqlArr = [null, registerUsername, registerPassword];
    const sql1 = "select * from user where username = ?";
    let sqlArr1 = [registerUsername]
    db.checkData({ res, type: 'add', sql, sqlArr, sql1, sqlArr1, msg: '注册成功！', errorMsg: '用户已存在' })
})
router.post('/update', function (req, res) {
    const { registerUsername, registerPassword } = req.body
    const sql = "update user set username=?,password=?where username = ?";
    let sqlArr = [registerUsername, registerPassword, registerUsername]
    const sql1 = "select * from user where username = ?";
    let sqlArr1 = [registerUsername, registerPassword]
    db.checkData({ res, type: 'update', sql, sqlArr, sql1, sqlArr1, msg: '修改成功！', errorMsg: '用户不存在' })
})

module.exports = router;