const {newUserConfig: {avatar}, expiresIn, jwtConfig: {secret, algorithms}} = require('../config')
const dbQuery = require('../db')
const {uuid} = require('../utils/random')
const md5 = require('../utils/md5')
const jwt = require('jsonwebtoken')
const formatToHump = require('../utils/formatToHump')
const sessionCode = require('../utils/session')
const {
    updateTimestampById
} = require("../model/socket")


exports.getUserList = (req, res) => {
    const userId = req.auth.id;
    const getFriendsSql = 'SELECT friends FROM user WHERE id = ?';
    const insertFriendsSql = 'UPDATE user set friends = ? WHERE id = ?';


    dbQuery(getFriendsSql, [userId], (err, friendsResults) => {
        console.log(friendsResults)
        if (err) return res.cc(err);
        if (friendsResults.length === 0) {
            dbQuery(insertFriendsSql, [userId, userId], (err, results) => {
            })
        }
        ;
    })
    dbQuery(getFriendsSql, [userId], (err, friendsResults) => {
        console.log(friendsResults)
        const friends = friendsResults[0].friends.split(',').map(id => parseInt(id, 10));


        const getUsersSql = 'SELECT * FROM user WHERE id != ?';
        dbQuery(getUsersSql, [userId], (err, usersResults) => {
            if (err) return res.cc(err);

            const filteredUsers = usersResults.filter(user => friends.includes(user.id));
            res.cc('获取用户成功', 200, formatToHump(filteredUsers));
        });
    });
};


exports.getUserByEmail = function (req, res, next) {
    const sql = `select *
                 from user
                 where email = ?`
    dbQuery(sql, req.body.email, (err, results) => {
        if (err) return res.cc(err)
        if (results.length)
            req.results = results
        next()
    })
}

exports.addUser = function (req, res) {
    const {email, password, code, timestamp} = req.body
    console.log(req.body)
    console.log(sessionCode)
    if (!sessionCode[timestamp] || sessionCode[timestamp] !== code)
        return res.cc('Verification code error')
    delete sessionCode[timestamp]
    const existence = 'select * from user where email=?'
    dbQuery(existence, [email], (err, results) => {
        if (err) return res.cc(err)
        if (results.length) {
            return res.cc('Nickname or email is occupied')
        }
        const sql = `insert into user
                     set ?`
        const _uuids = uuid()

        dbQuery(sql, {
            name: _uuids,
            nick_name: _uuids,
            email,
            password: md5(password),
            avatar: avatar[Math.floor(Math.random() * (4))]
        }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
            res.cc('注册成功！', 200)
        })
    })
}


exports.login = (req, res) => {
    const {email, password} = req.body
    const sql = `select *
                 from user
                 where email = ?`
    dbQuery(sql, email, async (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('Account or password error')
        const compareResult = results[0].password === md5(password)
        if (!compareResult) return res.cc('Account or password error')
        const timestamp = +new Date
        const user = {...results[0], timestamp}
        delete user.password
        await updateTimestampById(user.id, timestamp)
        const tokenStr = jwt.sign(user, secret, {expiresIn, algorithm: algorithms[0]})
        res.cc('Login successful', 200, {token: tokenStr})
    })
}

exports.getUserInfo = (req, res) => {
    const sql = `select id,
                        name,
                        nick_name,
                        email,
                        mobile,
                        online_status,
                        avatar,
                        session_history,
                        chat_id, timestamp
                 from user
                 where id=?`
    dbQuery(sql, req.auth.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        res.cc('获取用户信息成功！', 200, formatToHump(results[0]))
    })
}