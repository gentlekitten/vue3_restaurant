const mysql = require('mysql');

module.exports = {
    // 数据库配置
    config: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'orderingsystem'
    },
    // 连接数据库，使用连接池的方式
    // 连接池对象
    sqlConnect(sql, sqlArr, callback) {
        var pool = mysql.createPool(this.config);
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("连接失败");
                return;
            } else {
                console.log("连接成功...");
            }
            // 事件驱动回调
            conn.query(sql, sqlArr, callback);
            // 释放连接
            conn.release();
        })
    }
}
