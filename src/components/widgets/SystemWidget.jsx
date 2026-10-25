import { useState, useEffect } from 'react'
import LastUpdated from '../auxiliary/LastUpdated'

function useSystem(){
    const [systemData, setSystemData] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchSystem = async () => {
        try {
            const response = await fetch('http://localhost:3001/system')
            const data = await response.json()
            setSystemData(data)
            setLastUpdated(new Date())
        } catch(error) {
            console.error('System fetch error:', error)
        }
    }

    useEffect(() => {
        fetchSystem()
        const interval = setInterval(fetchSystem, 2000)
        return () => clearInterval(interval)
    }, [])

    return { systemData, lastUpdated }
}

const StatCard = ({ label, value, sub, color = 'text-white' }) => (
    <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
        <span className="text-gray-400 text-xs uppercase tracking-wide">{label}</span>
        <span className={`text-5xl font-bold ${color}`}>{value}</span>
        {sub && <span className="text-gray-400 text-xs">{sub}</span>}
    </div>
)

const ProgressBar = ({ percent, color }) => (
    <div className="h-1.5 bg-gray-600 rounded-full mt-2">
        <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
        />
    </div>
)

export default function SystemWidget(){
    const { systemData, lastUpdated } = useSystem()

    if(!systemData) return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex items-center justify-center">
            <p className="text-gray-400">Loading System Stats...</p>
        </div>
    )

    const ramPercent = Math.round((systemData.ramUsed / systemData.ramTotal) * 100)
    const diskPercent = systemData.disk?.percent ? parseInt(systemData.disk.percent) : 0
    const isHealthy = systemData.throttled?.status === 'HEALTHY'
    const tempF = systemData.temp !== 'N/A' ? ((parseFloat(systemData.temp) * 9/5) + 32).toFixed(1) : 'N/A'

    return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🖥️</span>
                    <div>
                        <h3 className="text-white font-bold text-xl">System</h3>
                        <p className="text-gray-400 text-sm">Personal-Dashboard</p>
                    </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${isHealthy ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                    {systemData.throttled?.status || 'N/A'}
                </span>
            </div>

            <div className="border-t border-gray-700" />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 flex-1">
                <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">CPU Load</span>
                    <span className="text-5xl font-bold text-white">{systemData.cpu}%</span>
                    <ProgressBar percent={systemData.cpu} color="bg-blue-500" />
                </div>

                <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Memory</span>
                    <span className="text-5xl font-bold text-white">{systemData.ramUsed}MB</span>
                    <span className="text-gray-400 text-xs">of {systemData.ramTotal}MB</span>
                    <ProgressBar percent={ramPercent} color="bg-green-500" />
                </div>

                <StatCard
                    label="Temperature"
                    value={`${tempF}°F`}
                    color={parseFloat(tempF) > 158 ? 'text-red-400' : 'text-white'}
                />

                <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Disk</span>
                    <span className="text-5xl font-bold text-white">{systemData.disk?.percent || 'N/A'}</span>
                    <span className="text-gray-400 text-xs">{systemData.disk?.used} / {systemData.disk?.total}</span>
                    <ProgressBar percent={diskPercent} color={diskPercent >= 90 ? 'bg-red-500' : 'bg-orange-500'} />
                </div>

                <StatCard label="Uptime" value={systemData.uptime} />
                <StatCard label="Local IP" value={systemData.ip} />
            </div>

            <div className="border-t border-gray-700 pt-3">
                <LastUpdated time={lastUpdated} />
            </div>
        </div>
    )
}