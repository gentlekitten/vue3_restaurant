
const express = require('express');
const dbConfig = require('../utils/dbconfig')
const db = require('../utils/db')
const router = express.Router();
// 添加订单
router.post('/addOrder', function (req, res) {
    const { seat, userId, goodsList, type } = req.body;
    let sql = "insert into orderList values";
    const length = goodsList.length
    goodsList.forEach((e, index) => {
        if (index + 1 < length) {
            sql += `(null,${seat},'${e.goodsName}','${e.categoryName}',${e.goodsPrice},'${e.goodsImg}',${e.goodsNum},${userId},current_timestamp(),1,${type}),`
        } else {
            sql += `(null,${seat},'${e.goodsName}','${e.categoryName}',${e.goodsPrice},'${e.goodsImg}',${e.goodsNum},${userId},current_timestamp(),1,${type})`
        }
    });
    console.log(sql);
    const sqlArr = [];
    db.handleDate({ res, sql, sqlArr, msg: '添加成功！' })

})
// 获取订单，不包括菜品
router.post('/getOrderList', function (req, res) {
    const { userId } = req.body;
    let sql = `
        SELECT seat, createTime,id
        FROM orderlist
        where userId = ? and state = 1
        GROUP BY seat;
        `;
    const sqlArr = [userId];
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })

})
// 根据订单获取菜品
router.post('/getGoodsList', function (req, res) {
    const { userId, seat } = req.body;
    let sql = `
        SELECT *
        FROM orderList
        WHERE seat = ? and state = 1 and userId = ?;
        `;
    const sqlArr = [seat, userId];
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })

})
// 删除订单
router.post('/deleteOrder', function (req, res) {
    const { userId, seat } = req.body;
    let sql = `
            delete from orderList 
            where seat = ? and userId = ?;
        `;
    const sqlArr = [seat, userId];
    db.handleDate({ res, sql, sqlArr, msg: '删除成功！' })

})

// 确定订单
router.post('/confirmOrder', function (req, res) {
    const { userId, goodsList } = req.body;
    let sql = `
        insert into saleList values
        `;
    const length = goodsList.length
    goodsList.forEach((e, index) => {
        if (index + 1 < length) {
            sql += `(null,'${e.goodsName}','${e.categoryName}',${e.goodsNum},'${e.goodsPrice}',${userId},${e.state},current_timestamp(),${e.type},${e.discountPrice}),`
        } else {
            sql += `(null,'${e.goodsName}','${e.categoryName}',${e.goodsNum},'${e.goodsPrice}',${userId},${e.state},current_timestamp(),${e.type},${e.discountPrice})`
        }
    });
    const sqlArr = [];
    db.handleDate({ res, sql, sqlArr, msg: '确认成功！' })

})

module.exports = router;