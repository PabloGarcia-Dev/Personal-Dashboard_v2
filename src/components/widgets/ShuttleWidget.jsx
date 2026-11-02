import { useState, useRef, useEffect } from "react"
import LastUpdated from "../auxiliary/LastUpdated"

const getBusInfo = (entry) => {
    if(!entry) return null
    const minutes = Math.floor(entry.Seconds / 60)
    const arrivalTime = new Date(parseInt(entry.EstimateTime.replace('/Date(', '').replace(')/', '')))
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    return { minutes, arrivalTime, isArriving: entry.IsArriving, onTime: entry.OnTimeStatus === 0, text: entry.Text, vehicleId: entry.VehicleId }
}

export default function ShuttleWidget({lastUpdated, shuttlePath, gameDayRoute}){
    const [lastChanged, setLastChanged] = useState(new Date())
    const prevMessage = useRef(null)

    const nextBus = shuttlePath?.Times?.length ? getBusInfo(shuttlePath.Times[0]) : null
    const currentMessage = nextBus ? (nextBus.isArriving ? 'Arriving' : `${nextBus.minutes} min`) : 'none'

    useEffect(() => {
        if(prevMessage.current !== null && prevMessage.current !== currentMessage){
            setLastChanged(new Date())
        }
        prevMessage.current = currentMessage
    }, [currentMessage])

    if(!shuttlePath) return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex items-center justify-center">
            <p className="text-gray-400">Loading Shuttle...</p>
        </div>
    )

    const routeColor = shuttlePath.Color || '#30FF91'

    const BusCard = ({ bus, label }) => {
        return (
            <div className={`flex items-center justify-between p-4 rounded-xl h-[160px] ${bus.isArriving ? 'bg-green-900/40 border border-green-500/50' : 'bg-gray-700'}`}>
                <div className="flex flex-col">
                    <span className="text-gray-400 text-xl uppercase tracking-wide">{label}</span>
                    <span className={`my-5 text-5xl font-bold ${bus.isArriving ? 'text-green-400' : 'text-white'}`}>
                        {bus.isArriving ? '🚨 Arriving!' : `${bus.minutes} min`}
                    </span>
                    <span className="text-gray-400 text-2xl">at {bus.arrivalTime}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold text-2xl px-4 py-2 rounded-full ${bus.onTime ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                        {bus.onTime ? 'On Time' : 'Delayed'}
                    </span>
                    <span className="text-gray-500 text-xl mr-3 mt-3">Bus #{bus.vehicleId}</span>
                </div>
            </div>
        )
    }

    const GameDayCard = ({ route }) => {
        if(!route) return null
        const bus = getBusInfo(route.Times[0])
        return (
            <div className={`flex items-center justify-between p-4 rounded-xl h-[160px] ${bus.isArriving ? 'bg-green-900/40 border border-green-500/50' : 'bg-amber-900/40 border border-amber-500/60'}`}>
                <div className="flex flex-col">
                    <span className="text-amber-400 text-xl uppercase tracking-wide">🏈 Game Day</span>
                    <span className="my-5 text-5xl font-bold text-white">
                        {bus.isArriving ? '🚨 Arriving!' : `${bus.minutes} min`}
                    </span>
                    <span className="text-gray-400 text-2xl">at {bus.arrivalTime}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold text-2xl px-4 py-2 rounded-full ${bus.onTime ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                        {bus.onTime ? 'On Time' : 'Delayed'}
                    </span>
                    <span className="text-gray-500 text-xl mr-3 mt-3">Bus #{bus.vehicleId}</span>
                </div>
            </div>
        )
    }

    if(!nextBus && !gameDayRoute) return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="text-6xl">🚌</span>
                <div>
                    <h3 className="text-3xl font-bold text-green-400">Route 2</h3>
                    <p className="text-gray-400 text-2xl">Boardwalk Apt Stop 1</p>
                </div>
            </div>
            <div className="border-t border-gray-700" />
            <div className="flex flex-1 items-center justify-center">
                <p className="text-gray-400 text-center">No active shuttles at this time</p>
            </div>
        </div>
    )

    return(
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="text-6xl">🚌</span>
                <div>
                    <h3 className="text-white font-bold text-3xl" style={{color: routeColor}}>
                        {shuttlePath.RouteDescription ?? 'Route 2'}
                    </h3>
                    <p className="text-gray-400 text-2xl">
                        {shuttlePath.StopDescription ?? 'Boardwalk Apt Stop 1'}
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-700" />

            <div className="flex flex-col gap-3 flex-1">
                {nextBus
                    ? <BusCard bus={nextBus} label="Next Shuttle" />
                    : <p className="text-gray-400 text-2xl">No Route 2 shuttles right now</p>}
                <GameDayCard route={gameDayRoute} />
            </div>

            <div className="border-t border-gray-700 pt-3 text-white">
                <LastUpdated time={lastChanged} />
            </div>
        </div>
    )
}