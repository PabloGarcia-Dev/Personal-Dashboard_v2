import useShuttle from "../../hooks/useShuttle"

export default function ShuttleWidget(){
    const {shuttlePath} = useShuttle()
    
    if(!shuttlePath) return <div>Loading Data...</div>

    return(
        <div>
            <h3>Route Name: {shuttlePath.RouteDescription}</h3>
            <p>Stop being Tracked: {shuttlePath.StopDescription}</p>
        </div>
    )

    return 
}