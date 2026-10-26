import { useState, useRef, useEffect } from "react"
import LastUpdated from "../auxiliary/LastUpdated"

const getBusInfo = (entry) => {  // move this OUTSIDE the component
    if(!entry) return null
    const minutes = Math.floor(entry.Seconds / 60)
    const arrivalTime = new Date(parseInt(entry.EstimateTime.replace('/Date(', '').replace(')/', '')))
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    return { minutes, arrivalTime, isArriving: entry.IsArriving, onTime: entry.OnTimeStatus === 0, text: entry.Text, vehicleId: entry.VehicleId }
}

export default function ShuttleWidget({lastUpdated, shuttlePath}){
    const [lastChanged, setLastChanged] = useState(new Date())
    const prevMessage = useRef(null)
    const nextBus = shuttlePath?.Times ? getBusInfo(shuttlePath.Times[0]) : null
    const currentMessage = nextBus?.isArriving ? 'Arriving' : `${nextBus?.minutes} min`

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

    if(shuttlePath.noService) return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🚌</span>
                <div>
                    <h3 className="text-xl font-bold text-green-400">Route 2</h3>
                    <p className="text-gray-400 text-sm">Boardwalk Apt Stop 1</p>
                </div>
            </div>
            <div className="border-t border-gray-700" />
            <div className="flex flex-1 items-center justify-center">
                <p className="text-gray-400 text-center">No active shuttles at this time</p>
            </div>
        </div>
    )

    const routeColor = shuttlePath.Color || '#30FF91'
    const secondBus = getBusInfo(shuttlePath.Times[1])

    const BusCard = ({ bus, label }) => {
        return (
            <div className={`flex items-center justify-between p-3 rounded-xl ${bus.isArriving ? 'bg-green-900/40 border border-green-500/50' : 'bg-gray-700'}`}>
                <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">{label}</span>
                    <span className={`text-2xl font-bold ${bus.isArriving ? 'text-green-400' : 'text-white'}`}>
                        {bus.isArriving ? '🚨 Arriving!' : `${bus.minutes} min`}
                    </span>
                    <span className="text-gray-400 text-sm">at {bus.arrivalTime}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${bus.onTime ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                        {bus.onTime ? 'On Time' : 'Delayed'}
                    </span>
                    <span className="text-gray-500 text-xs">Bus #{bus.vehicleId}</span>
                </div>
            </div>
        )
    }

    if(!shuttlePath || shuttlePath.Times.length === 0) return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🚌</span>
                <div>
                    <h3 className="text-xl font-bold text-green-400">Route 2</h3>
                    <p className="text-gray-400 text-sm">Boardwalk Apt Stop 1</p>
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
            
            {/* Header */}
            <div className="flex items-center gap-3">
                <span className="text-3xl">🚌</span>
                <div>
                    <h3 className="text-white font-bold text-xl" style={{color: routeColor}}>
                        {shuttlePath.RouteDescription}
                    </h3>
                    <p className="text-gray-400 text-sm">{shuttlePath.StopDescription}</p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700" />

            {/* Bus arrivals */}
            {/* Bus arrivals */}
            <div className="flex flex-col gap-3 flex-1">
                <BusCard bus={nextBus} label="Next" />
                {secondBus && <BusCard bus={secondBus} label="Following" />}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 pt-3">
                <LastUpdated time={lastChanged} />
            </div>
        </div>
    )
}