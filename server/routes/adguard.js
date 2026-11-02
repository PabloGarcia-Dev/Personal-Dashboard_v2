const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const auth = Buffer.from(`${process.env.ADGUARD_USER}:${process.env.ADGUARD_PASS}`).toString('base64')
        const response = await fetch(`${process.env.ADGUARD_URL}/control/stats`, {
            headers: { 'Authorization': `Basic ${auth}` }
        })
        if(!response.ok) throw new Error('AdGuard unreachable')
        const data = await response.json()
        res.json(data)
    } catch(error) {
        res.status(503).json({ error: 'AdGuard unavailable' })
    }
})

module.exports = router