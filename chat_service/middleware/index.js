const express = require("express")

const cors = require('cors')

const cc = (req, res, next) => {

    res.cc = function (err, code = 400, data) {
        const datas = {
            code,
            message: err instanceof Error ? err.message : err,
            data
        }
        if (!data) delete datas.data
        if (code === 200)
            res.send(datas)
        else
            res.status(code).send(datas)
    }
    next()
}

const {expressjwt} = require('express-jwt')
const {jwtConfig} = require('../config')

module.exports = [cors(), express.json(), express.urlencoded({extended: true}), cc, expressjwt(jwtConfig).unless({path: ['/api/login', '/api/reguser', '/api/sendEmailCode', '/api/checkEmailCode']})]