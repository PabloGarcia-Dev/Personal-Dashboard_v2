const express = require('express')
const cors = require('cors')
const path = require('path') // For the Pi
const app = express()
const weatherRouter = require('./routes/weather')
const shuttleRouter = require('./routes/shuttle')
const systemRouter = require('./routes/system')
const adguardRouter = require('./routes/adguard')
const laundryRouter = require('./routes/laundry')

app.use(cors())
app.use('/weather', weatherRouter)
app.use('/shuttle', shuttleRouter)
app.use('/system', systemRouter)
app.use('/adguard', adguardRouter)
app.use('/laundry', laundryRouter)

// Serve built React app (For the Pi)
app.use(express.static(path.join(__dirname, '..')))

// Catch-all for React Router (for the Pi)
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'))
})

app.listen(3001, () => console.log('Server running on port 3001'))