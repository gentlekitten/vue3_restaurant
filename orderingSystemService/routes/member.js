const express = require('express');
const db = require('../utils/db')
const router = express.Router();

// 添加会员
router.post('/addMember', function (req, res) {
    const { memberId, username, userId, time } = req.body;
    let sql = `
        insert into memberInfo 
        values (?,?,?,current_timestamp(),?,ADDDATE(current_timestamp(),INTERVAL 3 MONTH))
    `;
    if (time === '一年') {
        sql = `
        insert into memberInfo 
        values (?,?,?,current_timestamp(),?,ADDDATE(current_timestamp(),INTERVAL 1 YEAR))
        `;
    }
    if (time === '半年') {
        sql = `
        insert into memberInfo 
        values (?,?,?,current_timestamp(),?,ADDDATE(current_timestamp(),INTERVAL 6 MONTH))
        `;
    }
    const sqlArr = [null, memberId, username, userId];
    const sql1 = `
    select * 
    from memberInfo
    where memberId = ?
    and CURDATE() <= date(endTime)
    `;
    let sqlArr1 = [memberId]
    db.checkData({ res, type: 'add', sql, sqlArr, sql1, sqlArr1, msg: '添加成功！', errorMsg: '该会员已存在' })
})
// 获取会员列表
router.post('/getMemberList', function (req, res) {
    const { userId, pageIndex, pageTotal } = req.body
    const sql = `
    select * 
    from memberInfo
    where userId = ?
    and CURDATE() <= date(endTime)
    ORDER BY createTime DESC
    limit ?,?
    `;
    let sqlArr = [userId, pageIndex, pageTotal]
    const sql1 = `
    select count(*) 
    from memberInfo
    where userId = ?
    and CURDATE() <= date(endTime)
    `;
    let sqlArr1 = [userId]
    db.getDataTotal({ res, sql, sqlArr, sql1, sqlArr1, msg: '获取成功！' })
})
// 编辑会员
router.post('/editMember', function (req, res) {
    const { memberId, username, userId } = req.body;
    const sql = `
    update memberInfo
    set username=?
    where memberId = ? and userId = ?
    and CURDATE() <= date(endTime)
    `;
    const sqlArr = [username, memberId, userId];
    db.handleDate({ res, sql, sqlArr, msg: '修改成功！' })
})
// 删除会员
router.post('/deleteMember', function (req, res) {
    const { memberId, userId } = req.body;
    const sql = `
    delete from memberInfo 
    where memberId = ? and userId = ?
    and CURDATE() <= date(endTime)
    `;
    const sqlArr = [memberId, userId];
    db.handleDate({ res, sql, sqlArr, msg: '删除成功！' })
})
// 续费会员
router.post('/renewMember', function (req, res) {
    const { memberId, userId, time } = req.body;
    let sql = `
        update memberInfo
        set endTime = ADDDATE(endTime,INTERVAL 3 MONTH)
        where memberId = ? and userId = ?
        and CURDATE() <= date(endTime)
    `;
    if (time === '一年') {
        sql = `
        update memberInfo
        set endTime = ADDDATE(endTime,INTERVAL 1 YEAR)
        where memberId = ? and userId = ?
        and CURDATE() <= date(endTime)
    `;
    }
    if (time === '半年') {
        sql = `
        update memberInfo
        set endTime = ADDDATE(endTime,INTERVAL 6 MONTH)
        where memberId = ? and userId = ?
        and CURDATE() <= date(endTime)
    `;
    }
    const sqlArr = [memberId, userId];
    db.handleDate({ res, sql, sqlArr, msg: '续费成功！' })
})
// 判断该会员号是否存在或有效
router.post('/checkMember', function (req, res) {
    const { userId, memberId } = req.body;
    let sql = `
            select count(*) as num
            from memberInfo 
            where memberId = ? and userId = ?
            and CURDATE() <= date(endTime);
        `;
    const sqlArr = [memberId, userId];
    db.handleDate({ res, sql, isObj: true, sqlArr, msg: '获取成功！' })

})


module.exports = router;