import { useState, useEffect } from "react"

export default function useWeather(){
    const [currentWeather, setWeather] = useState(null); // starts empty and it get filled later
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchWeather = async() => {
        const response = await fetch('http://localhost:3001/weather')
        const data = await response.json()
        setWeather(data)
        setLastUpdated(new Date())
    }

    useEffect(() => {
        fetchWeather()

        const interval = setInterval(fetchWeather, 900000) // Every 15 minutes

        return () => clearInterval(interval)
    }, [])

    return {currentWeather, lastUpdated} // the component needs to receive this
}