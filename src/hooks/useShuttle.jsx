import { useState, useEffect } from "react";

export default function useShuttle(){
    const [shuttlePath, setPath] = useState(null)

    const fetchShuttlePath = async() => {
        const response = await fetch('http://localhost:3001/shuttle')
        const data = await response.json()
        setPath(data)
    }

    useEffect(() => {
        fetchShuttlePath()

        const interval = setInterval(fetchShuttlePath, 20000) // Every 20 seconds

        return () => clearInterval(interval)
    }, [])

    return {shuttlePath}
}