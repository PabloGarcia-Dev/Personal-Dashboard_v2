import { useState, useEffect } from "react"

export default function useWeather(){
    const [currentWeather, setWeather] = useState(null); // starts empty and it get filled later

    const fetchWeather = async () => {
        const response = await fetch('http://localhost:3001/weather')
        const data = await response.json()
        setWeather(data)
    }

    useEffect(() => {
        fetchWeather()

        const interval = setInterval(fetchWeather, 1200000) // Every 20 minutes

        return () => clearInterval(interval)
    }, [])

    return {currentWeather} // the component needs to receive this
}