import { useState, useEffect } from "react";

export default function useShuttle(){
    const [shuttlePath, setPath] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchShuttlePath = async() => {
        const response = await fetch('http://localhost:3001/shuttle')
        const data = await response.json()
        const route2 = data.find(item => item.RouteDescription === "Route 2")
        setPath(route2)
        setLastUpdated(new Date())
    }

    useEffect(() => {
        fetchShuttlePath()

        const interval = setInterval(fetchShuttlePath, 15000) // Every 15 seconds

        return () => clearInterval(interval)
    }, [])

    return {shuttlePath, lastUpdated}
}