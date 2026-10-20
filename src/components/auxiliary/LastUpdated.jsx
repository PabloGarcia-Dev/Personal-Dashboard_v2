export default function LastUpdated({time}){
    if(!time) return null

    let hours = time.getHours(); // .padStart() function adds whatever character is specified at the beginning of the string if it doesn't have the required number of characters: in this case 2
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = String(hours % 12 || 12).padStart(2, '0')

    return(
        <div>
            <p>{hours}:{minutes} {ampm}</p>
        </div>
    )
}
