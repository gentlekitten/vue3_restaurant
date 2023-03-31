
const express = require('express');
const db = require('../utils/db')
const router = express.Router();
// 获取菜品数量
router.post('/getGoodsNum', function (req, res) {
    const { userId } = req.body;
    const sql1 = "select count(*) from goodsList where userId = ?";
    const sqlArr1 = [userId];
    db.getDataTotal({ res, sql1, sqlArr1, msg: '获取成功！' })
})
// 获取当天营业金额和订单数量
router.post('/getTodayNum', function (req, res) {
    const { userId } = req.body;
    const sql = `SELECT SUM(sale) as sale,
    SUM(sale * goodsPrice) - sum(discountPrice) as totalPrice
    from saleList
    where date(createTime) = curdate() and userId = ?`;
    const sqlArr = [userId];
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！', isObj: true })
})
// 获取近一周金额和订单
router.post('/getWeekData', function (req, res) {
    const { userId } = req.body;
    const sql = `SELECT SUM(sale) as sale, SUM(sale * goodsPrice) - sum(discountPrice) as totalPrice,SUBSTRING(createTime,6,6) as time
    FROM saleList 
    WHERE DATE_SUB(CURDATE(), INTERVAL 6 DAY) <= date(createTime)
    and userId = ?
    GROUP BY SUBSTRING(createTime,6,6)
    ORDER BY createTime ASC;`;
    const sqlArr = [userId];
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })
})
// 获取近一周菜品销售排行
router.post('/getWeekGoods', function (req, res) {
    const { userId } = req.body;
    const sql = `SELECT SUM(sale) as sale,goodsName
    FROM saleList 
    WHERE DATE_SUB(CURDATE(), INTERVAL 6 DAY) <= date(createTime)
    and userId = ?
    GROUP BY goodsName
    ORDER BY SUM(sale) DESC
    LIMIT 0,5;`;
    const sqlArr = [userId];
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })
})
// 获取近一周菜品销售排行信息
router.post('/getWeekGoodsInfo', function (req, res) {
    const { userId } = req.body;
    const sql = `SELECT SUM(sale) as sale,goodsName,categoryName, goodsPrice,state from saleList 
    WHERE DATE_SUB(CURDATE(), INTERVAL 6 DAY) <= date(createTime)
    and userId = ?
    GROUP BY goodsName
    ORDER BY SUM(sale) DESC
    LIMIT 0,10`;
    const sqlArr = [userId];
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })
})

// 根据时间获取餐厅流水
router.post('/getRunningWater', function (req, res) {
    const { startTime, endTime, userId, pageIndex, pageTotal } = req.body;
    const sql = `select sale, goodsName, categoryName, 
    goodsPrice,state,createTime,type,discountPrice 
    FROM salelist
    WHERE  DATE_FORMAT(createTime,'%Y-%m-%d') 
    BETWEEN DATE_FORMAT(?,'%Y-%m-%d') 
    AND DATE_FORMAT(?,'%Y-%m-%d')
    and userId = ?
    ORDER BY createTime DESC
    LIMIT ?,?`;
    const sqlArr = [startTime, endTime, userId, pageIndex, pageTotal];
    // 获取总数
    const sql1 = `
    select count(*),sum(sale) as totalSale,
    sum(goodsPrice * sale) - sum(discountPrice) as totalPrice
    from salelist
    where DATE_FORMAT(createTime,'%Y-%m-%d') 
    BETWEEN DATE_FORMAT(?,'%Y-%m-%d') 
    AND DATE_FORMAT(?,'%Y-%m-%d')
    and userId = ?`;
    let sqlArr1 = [startTime, endTime, userId]
    db.getDataTotal({ res, sql, sqlArr, sql1, sqlArr1, msg: '获取成功！' })
})

module.exports = router;