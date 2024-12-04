const path = require("path")
const fs = require("fs")

/**
 * 读取路径信息
 * @param {string} filepath 路径
 */
function getStat(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                resolve(false)
            } else {
                resolve(stats)
            }
        })
    })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        try {
            fs.mkdir(dir, {recursive: true}, err => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        } catch (error) {
            console.log("error", error)
        }
    })
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
module.exports = async function (dir) {
    let isExists = await getStat(dir)

    if (isExists && isExists.isDirectory()) {
        return true
    } else if (isExists) {
        return false
    }
    let tempDir = path.parse(dir).dir

    let status = await dirExists(tempDir)
    let mkdirStatus
    if (status) {
        mkdirStatus = await mkdir(dir)
    }
    return mkdirStatus
}