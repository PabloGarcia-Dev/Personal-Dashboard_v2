const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const response = await fetch('http://192.168.0.102/control/stats')
        if(!response.ok) throw new Error('AdGuard unreachable')
        const data = await response.json()
        res.json(data)
    } catch(error) {
        res.status(503).json({ error: 'AdGuard unavailable' })
    }
})

module.exports = router