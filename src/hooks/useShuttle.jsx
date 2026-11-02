import { useState, useEffect } from "react";

export default function useShuttle(){
    const [shuttlePath, setPath] = useState(null)
    const [gameDayRoute, setGameDay] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchShuttlePath = async() => {
        const response = await fetch('http://localhost:3001/shuttle')
        const data = await response.json()
        const route2 = data.find(item => item.RouteDescription === "Route 2")
        const gameDay = data.find(item => item.RouteDescription === "GAME DAY Route 2")

        setPath(route2 || { noService: true })
        setGameDay(gameDay && gameDay.Times.length > 0 ? gameDay : null)
        setLastUpdated(new Date())
    }

    useEffect(() => {
        fetchShuttlePath()

        const interval = setInterval(fetchShuttlePath, 15000) // Every 15 seconds

        return () => clearInterval(interval)
    }, [])

    return{ shuttlePath, gameDayRoute, lastUpdated }
}