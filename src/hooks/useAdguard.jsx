import { useState, useEffect } from 'react'

export default function useAdGuard(){
    const [adGuardData, setAdGuardData] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchAdGuard = async () => {
        try {
            const response = await fetch('http://localhost:3001/adguard')
            const data = await response.json()
            setAdGuardData(data)
            setLastUpdated(new Date())
        } catch(error) {
            console.error('AdGuard fetch error:', error)
        }
    }

    useEffect(() => {
        fetchAdGuard()
        const interval = setInterval(fetchAdGuard, 30000)
        return () => clearInterval(interval)
    }, [])

    return { adGuardData, lastUpdated }
}