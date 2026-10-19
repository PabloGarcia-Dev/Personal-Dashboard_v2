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

    return <div className="flex justify-center size-fit  mx-12 font-bold">
        <div className="text-[200px]">{hours}:{minutes}:{seconds}</div>
        <div className="text-5xl pl-2 bottom-full size-fit mt-46">{ampm}</div>
    </div>
}