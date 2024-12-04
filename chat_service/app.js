const express = require("express")

const middleware = require('./middleware')

const router = require('./router')

const app = express()

app.use(middleware)


app.use('/api', router)


const errAuth = require('./middleware/errAuth')
app.use(errAuth)

const server = app.listen(5323, function () {
    console.log(`App running at local http://localhost:5323`)
})


const socket = require('./utils/socket')
socket(server)