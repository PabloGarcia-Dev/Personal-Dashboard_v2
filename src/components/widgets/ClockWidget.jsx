import { useState, useEffect } from "react"

export default function ClockWidget(){
    const [time, setTime] = useState(new Date()); // Created time variable watched by react to reload when it chnages

    useEffect(() => {
        const interval = setInterval(() => { // updates time every second, which triggered a re-render each tick
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval) // cleanup on Unmount
    }, []) // This is the standard React Patter for anything that needs to be on a timer

    let hours = time.getHours()
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = String(hours % 12 || 12).padStart(2, '0')

    return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col justify-center items-center h-full">
        {/* Time */}
        <div className="flex items-end gap-2">
            <span className="text-[150px] font-bold text-white leading-none">{hours}:{minutes}:{seconds}</span>
            <span className="text-6xl text-gray-400 mb-4">{ampm}</span>
        </div>
        {/* Date */}
        <p className="text-4xl text-gray-400 mt-4">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
    </div>
)
}