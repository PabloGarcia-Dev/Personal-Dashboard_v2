const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const response = await fetch('http://192.168.0.194/status')
        const data = await response.json()
        res.json(data)
    } catch(error) {
        res.status(503).json({ error: 'ESP32 unavailable' })
    }
})

module.exports = router