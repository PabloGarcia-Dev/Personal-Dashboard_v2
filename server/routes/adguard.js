const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const response = await fetch('http://localhost/control/stats', {
            headers: {
                'Authorization': 'Basic Y3loYXdrMTg6UDE0ZzM2MjJfQA=='
            }
        })
        if(!response.ok) throw new Error('AdGuard unreachable')
        const data = await response.json()
        res.json(data)
    } catch(error) {
        res.status(503).json({ error: 'AdGuard unavailable' })
    }
})

module.exports = router