import LastUpdated from "../auxiliary/LastUpdated"

export default function ShuttleWidget({lastUpdated, shuttlePath}){
    
    const nextBus = shuttlePath.Times[0] ? shuttlePath.Times[0].Text || `${Math.floor(shuttlePath.Times[0].Seconds / 60)} min away` : 'No incoming shuttles'
    const secondBus =  shuttlePath.Times[1] ? shuttlePath.Times[1].Text || `${Math.floor(shuttlePath.Times[1].Seconds / 60)} min away` : 'No incoming shuttles'

    return(
        <div>
            <h3>Route Name: {shuttlePath.RouteDescription}</h3>
            <p>Stop being Tracked: {shuttlePath.StopDescription}</p>
            <p>Upcoming: {nextBus}</p>
            <p>Following: {secondBus}</p>
            <LastUpdated time={lastUpdated}></LastUpdated>
        </div>
    )
}