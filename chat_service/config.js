module.exports = {
    cryptoKey: 'Green_Turtle_Real_time_Chat_Application',

    dbConfig: {
        host: "localhost",
        user: "root",
        password: "Aa2868658911",
        database: "Realtime_chat"
    },

    // s3对象存储配置 https://www.lingshulian.com 超低成本的对象存储平台
      s3Config: {
        config: {
          credentials: {
            accessKeyId: 'dadef56f24f7241ad007309289d7a681', // secretId
            secretAccessKey: 'b3a5194428f697fb2e6c0db36d38a221a2edc3c403ea400ac755e1e44244ca2a' // secretKey
          },
          endpoint: 'https://s3-us-east-1.ossfiles.com', // https:// + 获取的的端点
          region: 'us-east-1'
        },
        // 上传目录 可自定义
        path: 'chat',
        // 上传桶
        bucket: "realtime" // 存储桶
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