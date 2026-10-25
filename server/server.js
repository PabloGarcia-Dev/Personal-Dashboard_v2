const express = require('express')
const cors = require('cors') // So react Frontend can talk to the server
const app = express()
const weatherRouter = require('./routes/weather')
const shuttleRouter = require('./routes/shuttle')
const systemRouter = require('./routes/system')
const adguardRouter = require('./routes/adguard')

app.use(cors())
app.use('/weather', weatherRouter)
app.use('/shuttle', shuttleRouter)
app.use('/system', systemRouter)
app.use('/adguard', adguardRouter)

app.listen(3001, () => console.log('Server running on port 3001'))