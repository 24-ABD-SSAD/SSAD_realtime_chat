module.exports = {
    cryptoKey: 'Green_Turtle_Real_time_Chat_Application',

    dbConfig: {
        host: "localhost",
        user: "root",
        password: "Aa2868658911",
        database: "Realtime_chat"
    },


    jwtConfig: {
        secret: 'Green_Turtle',

        algorithms: ["HS256"]
    },


    expiresIn: '8h',

    emailConfig: {
        host: "maiquit@foxmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "maiquit@foxmail.com",
            pass: "bdyxgqesqtnnebij"
        }
    },

    newUserConfig: {
        avatar: ["/avatar/1.jpg", "/avatar/2.jpg", "/avatar/3.jpg", "/avatar/4.jpg", "/avatar/5.jpg"],
    }
}