const {info} = require('../utils/format')
const dbQuery = require('../db')
const formatToHump = require('../utils/formatToHump')


exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `select *
                         from user
                         where id = ?`
            dbQuery(sql, id, (err, results) => {
                if (err) reject(info.error("查询用户失败"))
                if (!results.length) reject(info.error("查询用户失败"))
                resolve(info.sucess(formatToHump(results[0]), "获取用户成功"))
            })
        } catch {
            reject(info.error("查询用户异常"))
        }
    })
}


exports.updateChatIdById = function (id, socketId) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `update user
                         set chat_id = ?
                         where id = ?`
            dbQuery(sql, [socketId, id], (err) => {
                if (err) {
                    reject(info.error("更新用户socketId失败"))
                } else {
                    resolve(info.sucess(null, "成功"))
                }
            })
        } catch {
            reject(info.error("更新用户socketId异常"))
        }
    })
}


exports.updateOnlineStatusById = function (id, onlineStatus) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `update user
                         set online_status = ?
                         where id = ?`
            dbQuery(sql, [onlineStatus, id], (err) => {
                if (err) {
                    reject(info.error("更新在线状态失败"))
                } else {
                    resolve(info.sucess(null, "成功"))
                }
            })
        } catch {
            reject(info.error("更新在线状态异常"))
        }
    })
}


exports.updateSessionHistoryById = function (sessionHistory, id) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `update user
                         set session_history = ?
                         where id = ?`
            dbQuery(sql, [sessionHistory, id], (err) => {
                if (err) {
                    reject(info.error("更新历史会话列表失败"))
                } else {
                    resolve(info.sucess(null, "成功"))
                }
            })
        } catch {
            reject(info.error("更新历史会话列表异常"))
        }
    })
}

exports.getUserByChatId = function (socketId) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `select *
                         from user
                         where chat_id = ?`
            dbQuery(sql, socketId, (err, user) => {
                if (err) {
                    reject(info.error("根据socketId获取用户信息失败"))
                } else {
                    resolve(info.sucess(formatToHump(user), "成功"))
                }
            })
        } catch {
            reject(info.error("根据socketId获取用户信息异常"))
        }
    })
}


exports.updateTimestampById = function (id, timestamp) {
    return new Promise((resolve, reject) => {
        try {
            let sql = `update user
                       set timestamp = ?
                       where id = ?`;
            dbQuery(sql, [timestamp, id], (err) => {
                if (err) {
                    reject(info.error("更新用户时间戳失败"))
                } else {
                    resolve(info.sucess(null, "成功"))
                }
            })
        } catch {
            reject(info.error("更新用户时间戳异常"))
        }
    })
};


exports.updateFriendsById = function (userIdA, userIdB) {
    getformemailsql = 'SELECT id FROM user WHERE email = ?';
    dbQuery(getFriendsSql, [userIdB], (err, userIdB) => {

    const getFriendsSql = 'SELECT friends FROM user WHERE id = ?';
    dbQuery(getFriendsSql, [userIdA], (err, resultsA) => {


        const friendsA = resultsA[0].friends ? resultsA[0].friends.split(',').map(id => parseInt(id, 10)) : [];


        dbQuery(getFriendsSql, [userIdB], (err, resultsB) => {


            const friendsB = resultsB[0].friends ? resultsB[0].friends.split(',').map(id => parseInt(id, 10)) : [];


            if (!friendsA.includes(userIdB)) {
                friendsA.push(userIdB);
            }

            if (!friendsB.includes(userIdA)) {
                friendsB.push(userIdA);
            }


            const updateFriendsA = friendsA.join(',');
            const updateSqlA = 'UPDATE user SET friends = ? WHERE id = ?';
            dbQuery(updateSqlA, [updateFriendsA, userIdA], (updateErrA) => {


                const updateFriendsB = friendsB.join(',');
                const updateSqlB = 'UPDATE user SET friends = ? WHERE id = ?';
                dbQuery(updateSqlB, [updateFriendsB, userIdB], (updateErrB) => {

                });
            });
        });
    });
})}

exports.removeFriend = function (userIdA, userIdB) {
    return new Promise((resolve, reject) => {

        const getFriendsSql = 'SELECT friends FROM user WHERE id = ?';
        dbQuery(getFriendsSql, [userIdA], (err, resultsA) => {
            if (err) return reject(err);
            if (resultsA.length === 0) return reject(new Error('用户A未找到'));

            let friendsA = resultsA[0].friends ? resultsA[0].friends.split(',').map(id => parseInt(id, 10)) : [];

            dbQuery(getFriendsSql, [userIdB], (err, resultsB) => {
                if (err) return reject(err);
                if (resultsB.length === 0) return reject(new Error('用户B未找到'));

                let friendsB = resultsB[0].friends ? resultsB[0].friends.split(',').map(id => parseInt(id, 10)) : [];

                friendsA = friendsA.filter(id => id !== userIdB);

                friendsB = friendsB.filter(id => id !== userIdA);

                const updateFriendsA = friendsA.join(',');
                const updateSqlA = 'UPDATE user SET friends = ? WHERE id = ?';
                dbQuery(updateSqlA, [updateFriendsA, userIdA], (updateErrA) => {
                    if (updateErrA) return reject(updateErrA);

                    const updateFriendsB = friendsB.join(',');
                    const updateSqlB = 'UPDATE user SET friends = ? WHERE id = ?';
                    dbQuery(updateSqlB, [updateFriendsB, userIdB], (updateErrB) => {
                        if (updateErrB) return reject(updateErrB);

                        resolve({message: '好友关系删除成功'});
                    });
                });
            });
        });
    });
}

exports.getGroupById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `select *
                         from group
                         where group_id = ?`
            dbQuery(sql, id, (err, results) => {
                if (err) reject(info.error("查询群组失败"))
                if (!results.length) reject(info.error("查询群组失败"))
                resolve(info.sucess(formatToHump(results[0]), "获取群组成功"))
            })
        } catch {
            reject(info.error("查询群组异常"))
        }
    })
}


exports.updateGroupHistoryById = function (GroupHistory, id) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `update group
                         set group_history = ?
                         where group_id = ?`
            dbQuery(sql, [GroupHistory, id], (err) => {
                if (err) {
                    reject(info.error("更新群组历史会话列表失败"))
                } else {
                    resolve(info.sucess(null, "成功"))
                }
            })
        } catch {
            reject(info.error("更新群组历史会话列表异常"))
        }
    })
}

exports.addMemberToGroup = function (groupId, memberId) {
    console.log(groupId, memberId)
    return new Promise((resolve, reject) => {
        // 获取当前群组的成员列表
        try {
            const getMembersSql = 'SELECT members FROM `group` WHERE group_id = ?';
            dbQuery(getMembersSql, [groupId], (err, groupResults) => {
                if (err) reject(info.error("添加成员失败"))
                if (groupResults.length === 0) reject(info.error("查询群组失败"))

                const members = groupResults[0].members ? groupResults[0].members.split(',').map(id => parseInt(id, 10)) : [];

                // 将新的成员ID添加到成员列表中
                if (!members.includes(memberId)) {
                    members.push(memberId);
                }

                // 更新数据库中的群组成员列表
                const updateMembers = members.join(',');
                const updateGroupSql = 'UPDATE `group` SET members = ? WHERE group_id = ?';
                dbQuery(updateGroupSql, [updateMembers, groupId], (updateGroupErr) => {
                    if (updateGroupErr) reject(info.error("添加成员异常"))

                    // 获取用户的群组列表
                    const getUserGroupsSql = 'SELECT `groups`FROM user WHERE id = ?';
                    dbQuery(getUserGroupsSql, [memberId], (err, userResults) => {
                        if (err) reject(info.error("添加用户失败"))
                        console.log(userResults.length)
                        if (userResults.length === 0) reject(info.error("查询群组失败2"))

                        const userGroups = userResults[0].groups ? userResults[0].groups.split(',').map(id => parseInt(id, 10)) : [];

                        // 将群组ID添加到用户的群组列表中
                        if (!userGroups.includes(groupId)) {
                            userGroups.push(groupId);
                        }

                        // 更新数据库中的用户群组列表
                        const updateUserGroups = userGroups.join(',');
                        const updateUserSql = 'UPDATE user SET `groups` = ? WHERE id = ?';
                        dbQuery(updateUserSql, [updateUserGroups, memberId], (updateUserErr) => {
                            if (updateUserErr) reject(info.error("添加成员异常2"));

                            resolve(null, {message: '成员添加成功，并更新用户群组列表'});
                        });
                    });
                });
            });
        } catch {
            reject(info.error("添加成员异常"))
        }
    })
}

exports.removeMemberFromGroup = function (groupId, memberId) {
    return new Promise((resolve, reject) => {
        // 获取当前群组的成员列表
        try {
            // 获取当前群组的成员列表
            const getMembersSql = 'SELECT members FROM `group` WHERE group_id = ?';
            dbQuery(getMembersSql, [groupId], (err, groupResults) => {
                if (err) return callback(err);
                if (groupResults.length === 0) return callback(new Error('群组未找到'));

                let members = groupResults[0].members ? groupResults[0].members.split(',').map(id => parseInt(id, 10)) : [];

                // 从成员列表中移除指定的成员ID
                members = members.filter(id => id !== memberId);

                // 更新数据库中的群组成员列表
                const updateMembers = members.join(',');
                const updateGroupSql = 'UPDATE `group` SET members = ? WHERE group_id = ?';
                dbQuery(updateGroupSql, [updateMembers, groupId], (updateGroupErr) => {
                    if (updateGroupErr) return callback(updateGroupErr);

                    // 获取用户的群组列表
                    const getUserGroupsSql = 'SELECT `groups` FROM user WHERE id = ?';
                    dbQuery(getUserGroupsSql, [memberId], (err, userResults) => {
                        if (err) return callback(err);
                        if (userResults.length === 0) return callback(new Error('用户未找到'));

                        let userGroups = userResults[0].groups ? userResults[0].groups.split(',').map(id => parseInt(id, 10)) : [];

                        // 从用户的群组列表中移除群组ID
                        userGroups = userGroups.filter(id => id !== groupId);

                        // 更新数据库中的用户群组列表
                        const updateUserGroups = userGroups.join(',');
                        const updateUserSql = 'UPDATE user SET `groups` = ? WHERE id = ?';
                        dbQuery(updateUserSql, [updateUserGroups, memberId], (updateUserErr) => {
                            if (updateUserErr) return callback(updateUserErr);

                            callback(null, {message: '成员移除成功，并更新用户群组列表'});
                        });
                    });
                });
            });
        } catch {
            reject(info.error("移除成员异常"))
        }
    })
}

exports.dissolveGroup = function (groupId) {
    return new Promise((resolve, reject) => {
        // 删除指定群组ID的行
        try {
            const deleteGroupSql = 'DELETE FROM `group` WHERE group_id = ?';
            dbQuery(deleteGroupSql, [groupId], (err, results) => {
                if (err) reject(info.error("解散群聊异常"))
                if (results.affectedRows === 0) reject(info.error("查询群组失败"))

                resolve(info.sucess(null, "成功"))
            });
        } catch {
            reject(info.error("解散群聊异常"))
        }
    })
}

exports.createGroup = function (groupName, hostId) {

    return new Promise((resolve, reject) => {
            try {
                const insertGroupSql = 'INSERT INTO `group` (group_name, host_id, members) VALUES (?, ?, ?)';
                const members = `${hostId}`;
                dbQuery(insertGroupSql, [groupName, hostId, members], (insertGroupErr, result) => {
                    if (insertGroupErr) reject(info.error("创建群聊异常0"))
                    searchsql = 'SELECT group_id FROM `group` WHERE group_name = ? AND host_id = ?';
                    dbQuery(searchsql, [groupName, hostId], (err, result) => {

                        const groupId = result;

                        const getUserGroupsSql = 'SELECT `groups` FROM user WHERE id = ?';
                        dbQuery(getUserGroupsSql, hostId, (err, userResults) => {
                            if (err) reject(info.error("创建群聊异常"))

                            console.log(userResults[0].groups)

                            const userGroups = userResults[0].groups ? userResults[0].groups.split(',').map(id => parseInt(id, 10)) : [];


                            if (!userGroups.includes(result[0].group_id)) {
                                userGroups.push(result[0].group_id);
                            }

                            const updateUserGroups = userGroups.join(',');

                            const updateUserSql = 'UPDATE user SET `groups` = ? WHERE id = ?';
                            dbQuery(updateUserSql, [updateUserGroups, hostId], (updateUserErr) => {
                                if (updateUserErr) reject(info.error("创建群聊异常2"));
                                resolve(info.sucess(null, "成功"))

                            });
                        });
                    });
                });
            } catch {
                reject(info.error("创建群聊异常"))
            }
        }
    )
}