const {dbConfig} = require('../config')

const mysql = require("mysql")

const pool = mysql.createPool(dbConfig)

const query = function (sql, options, callback) {
    if (!callback) callback = options
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null)
        } else {
            const arr = [options, function (err, results, fields) {

                callback(err, results, fields)
            }]
            if (typeof options === "function")
                arr.splice(2, 1)
            conn.query(sql, ...arr)

            conn.release()
        }
    })
}

module.exports = query