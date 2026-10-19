import useShuttle from "../../hooks/useShuttle"

export default function ShuttleWidget(){
    const {shuttlePath} = useShuttle()
    console.log(shuttlePath)
    
    if(!shuttlePath) return <div>Loading Data...</div>

    const nextBus = shuttlePath.Times[0]
    const secondBus = shuttlePath.Times[1]

    return(
        <div>
            <h3>Route Name: {shuttlePath.RouteDescription}</h3>
            <p>Stop being Tracked: {shuttlePath.StopDescription}</p>
            <p>Upcoming: {nextBus ? nextBus.Text || `${Math.floor(nextBus.Seconds / 60)} min away` : 'No incoming shuttles'}</p>
            <p>Following: {secondBus ? secondBus.Text || `${Math.floor(secondBus.Seconds / 60)} min away` : 'No incoming shuttles'}</p>
        </div>
    )
}