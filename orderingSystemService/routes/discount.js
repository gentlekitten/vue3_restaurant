
const express = require('express');
const db = require('../utils/db')
const router = express.Router();

// 添加优惠
router.post('/addDiscount', function (req, res) {
    const { discountContent, discountPrice, discountCondition, startTime, userId, endTime, discountType } = req.body;
    console.log(req.body)
    const sql = "insert into discountList values (?,?,?,?,?,?,?,?)";
    let sqlArr = discountType === 0
        ? [null, discountContent, discountPrice, discountCondition, startTime, userId, endTime, discountType]
        : [null, discountContent, 0, 0, startTime, userId, endTime, discountType]
    const sql1 = `SELECT * from 
        discountlist as d
        WHERE (
        DATE_FORMAT(?,'%Y-%m-%d %H:%i:%s') 
        BETWEEN DATE_FORMAT(d.createTime,'%Y-%m-%d %H:%i:%s') 
        AND DATE_FORMAT(d.endTime,'%Y-%m-%d %H:%i:%s')
        OR
        DATE_FORMAT(?,'%Y-%m-%d %H:%i:%s') 
        BETWEEN DATE_FORMAT(d.createTime,'%Y-%m-%d %H:%i:%s') 
        AND DATE_FORMAT(d.endTime,'%Y-%m-%d %H:%i:%s')
        )
        and DATE_FORMAT(d.endTime,'%Y-%m-%d %H:%i:%s') >= CURDATE()
        and userId = ?;`
    let sqlArr1 = [startTime, endTime, userId]
    db.checkData({ res, type: 'add', sql, sqlArr, sql1, sqlArr1, msg: '添加成功！', errorMsg: '该时间段已有活动' })
})
// 获取优惠列表
router.post('/getDiscountList', function (req, res) {
    const { userId, pageIndex, pageTotal } = req.body
    const sql = `
        select *, CURDATE() > DATE_FORMAT(endTime,'%Y-%m-%d %H:%i:%s') AS isOverdue,
        CURDATE() >= DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') AS isStart
        from discountlist
        where userId = ?
        ORDER BY createTime DESC
        limit ?,?
    `;
    let sqlArr = [userId, pageIndex, pageTotal]
    const sql1 = `
        select count(*) 
        from discountlist
        where userId = ?
    `;
    let sqlArr1 = [userId]
    db.getDataTotal({ res, sql, sqlArr, sql1, sqlArr1, msg: '获取成功！' })
})
// 编辑优惠
router.post('/editDiscountList', function (req, res) {
    const { discountContent, discountPrice, discountCondition, startTime, userId, endTime, id, timeIsChange } = req.body
    console.log(req.body)
    const sql = `
        update discountlist 
        set discountContent=?,discountPrice=?,discountCondition=?,createTime=?,endTime=?
        where id = ?
        and userId = ?
    `;
    const sqlArr = [discountContent, discountPrice, discountCondition, startTime, endTime, id, userId];
    if (timeIsChange === 1) {
        const sql1 = `SELECT * from 
            discountlist as d
            WHERE (
            DATE_FORMAT(?,'%Y-%m-%d %H:%i:%s') 
            BETWEEN DATE_FORMAT(d.createTime,'%Y-%m-%d %H:%i:%s') 
            AND DATE_FORMAT(d.endTime,'%Y-%m-%d %H:%i:%s')
            OR
            DATE_FORMAT(?,'%Y-%m-%d %H:%i:%s') 
            BETWEEN DATE_FORMAT(d.createTime,'%Y-%m-%d %H:%i:%s') 
            AND DATE_FORMAT(d.endTime,'%Y-%m-%d %H:%i:%s')
            )
            and DATE_FORMAT(d.endTime,'%Y-%m-%d %H:%i:%s') >= CURDATE()
            and userId = ?;`
        let sqlArr1 = [startTime, endTime, userId]
        db.checkData({ res, type: 'add', sql, sqlArr, sql1, sqlArr1, msg: '修改成功！', errorMsg: '该时间段已有活动' })
        return
    }
    db.handleDate({ res, sql, sqlArr, msg: '修改成功！' })
})
// 删除优惠
router.post('/deleteDiscountList', function (req, res) {
    const { userId, id } = req.body
    console.log(req.body)
    const sql = `
        delete from discountlist 
        where id = ? and userId = ?
    `;
    const sqlArr = [id, userId];
    db.handleDate({ res, sql, sqlArr, msg: '删除成功！' })
})
// 获取该时间段的优惠活动
router.post('/getDiscountListByTime', function (req, res) {
    const { userId } = req.body
    const sql = `
        select *
        from discountList
        where userId = ?
        and DATE_FORMAT(endTime,'%Y-%m-%d %H:%i:%s') >= CURDATE()
        AND DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') <= CURDATE()
        ORDER BY createTime DESC
        limit 0,1
    `;
    let sqlArr = [userId]
    db.handleDate({ res, sql, sqlArr, isObj: true, msg: '获取成功！' })
})

module.exports = router;