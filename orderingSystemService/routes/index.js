const login = require("./login")
const goods = require("./goods")
const analysis = require("./analysis")
const order = require("./order")
const member = require("./member")
const discount = require("./discount")
module.exports = app => {
    app.use("/login", login)
    app.use("/goods", goods)
    app.use("/analysis", analysis)
    app.use("/order", order)
    app.use("/discount", discount)
    app.use("/member", member)
}