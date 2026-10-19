const express = require("express")
const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const latitude = 28.586779934551355
        const longitude = -81.20615364774744
        const targetURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&hourly=precipitation_probability&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
        const URLResponse = await fetch(targetURL)

        const data = await URLResponse.json()

        res.json(data)
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
    
})

module.exports = router