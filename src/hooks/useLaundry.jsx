import { useState, useEffect } from 'react'

export default function useLaundry(){
    const [laundryData, setLaundryData] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchLaundry = async () => {
        try {
            const response = await fetch('http://localhost:3001/laundry')
            const data = await response.json()
            setLaundryData(data)
            setLastUpdated(new Date())
        } catch(error) {
            console.error('Laundry fetch error:', error)
        }
    }

    useEffect(() => {
        fetchLaundry()
        const interval = setInterval(fetchLaundry, 5000)
        return () => clearInterval(interval)
    }, [])

    return { laundryData, lastUpdated }
}