const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const targetURL = `https://ucf.transloc.com/Services/JSONPRelay.svc/GetStopArrivalTimes?apiKey=8882812681&stopIds=54&version=2`
        const URLResponse = await fetch(targetURL)
        const data = await URLResponse.json()

        res.json(data)
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})

module.exports = router