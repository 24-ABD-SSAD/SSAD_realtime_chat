const express = require('express')
const router = express.Router()

const expressJoi = require('../utils/expressJoi')

const {reguserRule} = require('../rules/user')
const {addUser, getUserList, login, getUserInfo} = require('../model/user')

router.get('/userInfo', getUserInfo)

router.get('/userList', getUserList)

router.post('/login', login)


router.post('/reguser', expressJoi(reguserRule), addUser)


module.exports = router
