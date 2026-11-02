import { useState, useEffect, useRef } from 'react'
import LastUpdated from '../auxiliary/LastUpdated'

const ACTIVATION_OFFSET = 15   // firmware needs ~15 active seconds (ON_SCORE) before it reports running

function useRunTime(running){
    const startRef = useRef(null)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        if(!running){
            startRef.current = null
            setSeconds(0)
            return
        }

        if(startRef.current === null){
            startRef.current = Date.now() - ACTIVATION_OFFSET * 1000
        }

        const tick = () => setSeconds(Math.floor((Date.now() - startRef.current) / 1000))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [running])

    return seconds
}

const formatRun = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}h ${m}m ${sec}s`
    if (m > 0) return `${m}m ${sec}s`
    return `${sec}s`
}

const MachineCard = ({ label, icon, running, warnAfter }) => {
    const seconds = useRunTime(running)
    const warn = running && warnAfter && seconds >= warnAfter

    const box = warn
        ? 'bg-amber-900/40 border border-amber-500/60 animate-pulse'
        : running
            ? 'bg-green-900/40 border border-green-500/50'
            : 'bg-gray-700'
    const status = warn ? 'text-amber-400' : running ? 'text-green-400' : 'text-gray-400'

    return (
        <div className={`flex flex-col gap-1 p-3 rounded-xl ${box}`}>
            <div className="flex items-center gap-2">
                <span className="text-6xl">{icon}</span>
                <span className="text-white font-bold text-base text-xl">{label}</span>
                {running && (
                    <span className={`ml-auto text-3xl font-bold ${status}`}>{formatRun(seconds)}</span>
                )}
            </div>
            <span className={`m-2 text-xl font-bold ${status}`}>
                {warn ? '⚠ Check on the dryer' : running ? '● Running' : '○ Idle'}
            </span>
        </div>
    )
}

export default function LaundryWidget( {laundryData, lastUpdated} ){
    if(!laundryData) return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">Connecting...</p>
        </div>
    )

    if(laundryData.error) return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-6xl">🫧</span>
                <h3 className="text-white font-bold text-2xl">Laundry</h3>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 mt-3" />

            <div className="flex flex-1 items-center justify-center">
                <p className="text-gray-500 text-sm">Sensor offline</p>
            </div>
        </div>
    )

    return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-3">
            
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-6xl">🫧</span>
                <h3 className="text-white font-bold text-2xl">Laundry</h3>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700" />

            {/* Machine cards */}
            <div className="flex flex-col gap-2 flex-1">
                <MachineCard label="Washer" icon="🧼" running={laundryData.washer} />
                <MachineCard label="Dryer" icon="🌀" running={laundryData.dryer} />
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 pt-3 text-white">
                <LastUpdated time={lastUpdated} />
            </div>
        </div>
    )
}