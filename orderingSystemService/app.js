const express = require('express');
const routes = require("./routes/index")
const app = express();
const port = 3000

app.use('/public/', express.static('./public/'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 自定义跨域中间件
const allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCors);//使用跨域中间件
routes(app)

app.listen(port, () => {
    console.log(`app run localhost:${port}`)
})