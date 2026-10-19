const express = require('express')
const cors = require('cors') // So react Frontend can talk to the server
const app = express()
const weatherRouter = require('./routes/weather')
const shuttleRouter = require('./routes/shuttle')

app.use(cors())
app.use('/weather', weatherRouter)
app.use('/shuttle', shuttleRouter)

app.get('/ping', (req, res) => {
    res.json({ message: 'server is alive' })
})


app.listen(3001, () => console.log('Server running on port 3001'))