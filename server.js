const express = require('express')
const path = require('path')
const app = express()
const resolve = file => path.resolve(__dirname, file)
const serve = path => express.static(resolve(path), {maxAge: 0})
const port = process.env.LISTEN_PORT || 8081
const history = require('connect-history-api-fallback')
app.use('/', serve('./dist'))
app.use(history())
app.use('/', serve('./dist'))
app.listen(port, () => {
    console.log('server listen at %s', port)
})
