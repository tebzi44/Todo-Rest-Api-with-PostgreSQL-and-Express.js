require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router')

app.use(express.json())
app.use('/api', router)

app.listen(5010, () => {
    console.log('server is listening on port 5010');
})