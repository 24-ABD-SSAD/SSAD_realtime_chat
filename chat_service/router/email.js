const {getUserByEmail} = require('../model/user')
const express = require('express')
const router = express.Router()


const expressJoi = require('../utils/expressJoi')


const {emailCodeRule} = require('../rules/user')

const sessionCode = require('../utils/session')

router.post('/sendEmailCode', expressJoi(emailCodeRule), getUserByEmail, function (req, res) {
    const {results} = req
    const timestamp = +new Date()

    if (results && results.length)
        return res.cc('该邮箱已被注册')
    else {
        sessionCode[timestamp] = '123456'
        const timer = setInterval(() => {
            sessionCode[timestamp] && (delete sessionCode[timestamp])
            clearInterval(timer)
        }, 60 * 1000)
    }

    res.cc('发送验证码成功', 200, {code: sessionCode[timestamp], timestamp})
})
module.exports = router