
const express = require('express');
const db = require('../utils/db')
const fs = require('fs')
const router = express.Router();
// 添加菜品类别
router.post('/addCategory', function (req, res) {
    const { categoryName, userId } = req.body;

    const sql = "insert into category values (?,?,?)";
    const sqlArr = [null, categoryName, userId];

    const sql1 = "select * from category where categoryName = ? and userId = ?";
    let sqlArr1 = [categoryName, userId]
    db.checkData({ res, type: 'add', sql, sqlArr, sql1, sqlArr1, msg: '添加成功！', errorMsg: '该类别已存在' })
})
// 获取菜品类别列表
router.post('/categoryList', function (req, res) {
    const { userId } = req.body;
    const sql = "select * from category where userid = ?";
    let sqlArr = [userId]
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })
})
// 上传菜品图片
router.post('/upImg', function (req, res) {
    db.upImg({ req, res })
})
// 删除菜品图片
router.post('/deleteImg', function (req, res) {
    const { imgUrl } = req.body
    fs.unlink(imgUrl, (err) => {
        if (err) {
            res.send({
                code: 400,
                msg: '删除失败！',
                "error": err
            })
            return
        }
        res.send({
            code: 200,
            msg: '删除成功！'
        })
    })
})
// 添加菜品
router.post('/addGoods', function (req, res) {
    const { userId, goodsName, category, goodsImgUrl, goodsPrice } = req.body;
    const sql = "insert into goodsList values (?,?,?,?,?,?,?)";
    let sqlArr = [null, goodsName, goodsImgUrl, category, goodsPrice, userId, 1]
    db.handleDate({ req, res, sql, sqlArr, msg: '添加成功！' })
})
// 获取菜品列表
router.post('/goodsList', function (req, res) {
    const { userId, pageIndex, pageTotal } = req.body;
    const sql = "select * from goodsList where userid = ? limit ?,?";
    let sqlArr = [userId, pageIndex, pageTotal]

    const sql1 = "select count(*) from goodsList where userId = ?";
    let sqlArr1 = [userId]
    db.getDataTotal({ res, sql, sqlArr, sql1, sqlArr1, msg: '获取成功！' })
})
// 更新单个菜品状态
router.post('/updateState', function (req, res) {
    const { userId, id, state } = req.body;
    const sql = "update goodsList set state=? where id = ? and userId =?";
    let sqlArr = [state, id, userId]
    db.handleDate({ res, sql, sqlArr, msg: '更新成功！' })
})
// 更新菜品信息
router.post('/updateGoods', function (req, res) {
    const { userId, id, goodsName, category, goodsPrice } = req.body;
    const sql = "update goodsList set goodsName=? ,categoryName=? ,goodsPrice=? where id = ? and userId =?";
    let sqlArr = [goodsName, category, goodsPrice, id, userId]
    db.handleDate({ res, sql, sqlArr, msg: '修改成功！' })
})

// 删除单个菜品
router.post('/deleteGoods', function (req, res) {
    const { userId, id } = req.body;
    const sql = "delete from goodsList where id = ? and userId = ?";
    let sqlArr = [id, userId]
    db.handleDate({ res, sql, sqlArr, msg: '删除成功！' })
})
// 根据类别获取菜品
router.post('/getGoodsBycategory', function (req, res) {
    const { userId, categoryName } = req.body;
    const sql = "select * from goodsList where categoryName = ? and userId = ? and state = ?";
    let sqlArr = [categoryName, userId, 1]
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })
})
// 获取热卖菜品(近一个月前十菜品)
router.post('/getRotGoods', function (req, res) {
    const { userId } = req.body;
    const sql = `
            SELECT s.goodsName,SUM(s.sale) sale,g.goodsImg,s.goodsPrice,s.categoryName,s.id
            FROM goodslist g
            INNER JOIN
            salelist s
            ON
            s.goodsName = g.goodsName
            WHERE s.userId = ? 
            AND s.state = ?
            AND DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(s.createTime)
            GROUP BY s.goodsName
            ORDER BY SUM(s.sale) DESC
            LIMIT 0,10
    `;
    let sqlArr = [userId, 1]
    db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })
})

// 获取所有菜品
// router.post('/getGoodsBycategory', function (req, res) {
//     const { userId, categoryName } = req.body;
//     const sql = "select * from goodsList where categoryName = ? and userId = ?";
//     let sqlArr = [categoryName, userId]
//     db.handleDate({ res, sql, sqlArr, msg: '获取成功！' })
// })


module.exports = router;