const dbConfig = require('./dbconfig')
const multiparty = require("multiparty");
// 判断账号密码是否正确
checkLogin = (req, res) => {
    let { username, password } = req.body
    const sql = "select * from user where username = ? and password = ?";
    let sqlArr = [username, password]
    let callBack = (err, data) => {
        if (err) {
            res.send({
                code: 400,
                msg: '获取出错！',
                'data': data
            })
        } else {
            if (data.length > 0) {
                res.send({
                    code: 200,
                    msg: '登录成功！',
                    'data': data[0]
                })
                return
            }
            res.send({
                code: 400,
                msg: '账号或密码错误'
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}
// 封装一个检查数据是否存在的函数
/**
 * @param res res对象
 * @param type 类别（添加/修改）
 * @param sql 插入数据的sql语句
 * @param sqlArr 插入数据sql语句中需要插入的数据
 * @param sql1 检查数据是否存在的语句
 * @param sqlArr1 检查数据是否存在的语句中需要插入的数据
 * @param msg 成功msg
 * @param errorMsg 数据已存在msg
 */
checkData = (obj) => {
    const { res, type, sql, sqlArr, sql1, sqlArr1, msg, errorMsg } = obj
    // 数据是否存在
    let callBack = (err, data) => {
        if (err) {
            res.send({
                code: 400,
                msg: '获取错误',
            })
            return
        }
        // 判断是添加的还是修改的
        if (type === 'add') {
            if (data.length > 0) {
                res.send({
                    code: 401,
                    msg: errorMsg
                })
                return
            }
            // 调佣添加数据
            handleDate({ res, sql, sqlArr, msg })
        } else {
            if (data.length <= 0) {
                res.send({
                    code: 400,
                    msg: errorMsg
                })
                return
            }
            // 调佣添加数据
            handleDate({ res, sql, sqlArr, msg })
        }

    }
    dbConfig.sqlConnect(sql1, sqlArr1, callBack);
}
// 获取数据条数
getDataTotal = (obj) => {
    const { sql, sqlArr, sql1, sqlArr1, res, msg } = obj
    let callBack = (err, data) => {
        if (err) {
            res.send({
                code: 400,
                msg: '获取错误',
            })
            return
        }
        const obj = data[0]
        let total = obj['count(*)']
        let totalPrice = obj['totalPrice'] ? obj['totalPrice'] : ''
        let totalSale = obj['totalSale'] ? obj['totalSale'] : ''

        if (sql) {
            handleDate({ res, sql, sqlArr, msg: '获取成功！', total, totalPrice, totalSale })
        } else {
            res.send({
                code: 200,
                msg,
                'data': total
            })
        }
    }
    dbConfig.sqlConnect(sql1, sqlArr1, callBack);
}

// 上传图片
upImg = (obj) => {
    const { res, req } = obj
    const form = new multiparty.Form();
    let pic = ''
    form.uploadDir = './public/upImg';   //上传图片保存的地址 目录必须存在
    form.parse(req, function (err, fields, files) {
        pic = files.file[0].path;
        if (err) {
            res.send({
                code: 400,
                msg: '上传错误！'
            })
        } else {
            res.send({
                code: 200,
                msg: '上传成功！',
                'data': pic
            })
        }
    })
}

// 封装一个处理数据
/**
 * @param res res对象
 * @param sql sql语句
 * @param sqlArr sql语句中需要插入的数据
 * @param msg 成功返回的消息
 * @param total 数据总条数
 * @param isObj 数据是否返回对象
 * @param pic 图片地址
 */
handleDate = (obj) => {
    const { res, sql, sqlArr, msg, total, isObj, totalPrice, totalSale } = obj
    let callBack = (err, data) => {
        if (isObj) {
            data = data[0]
        }
        if (err) {
            res.send({
                code: 400,
                msg: '获取错误',
                err
            })
            return
        }
        // 处理是要获取总数的
        if (total && !totalPrice) {
            console.log(totalPrice)
            res.send({
                code: 200,
                msg,
                'data': {
                    total,
                    goodsList: data
                }
            })
        } else if (total && totalPrice) {
            res.send({
                code: 200,
                msg,
                'data': {
                    total,
                    totalPrice,
                    totalSale,
                    goodsList: data
                }
            })
        }
        else {
            res.send({
                code: 200,
                msg,
                'data': data
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}
module.exports = {
    checkLogin,
    checkData,
    handleDate,
    getDataTotal,
    upImg
}