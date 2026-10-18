import useWeather from "../../hooks/useWeather";

export default function WeatherWidget(){
    const {currentWeather} = useWeather()

    let weatherState = (!currentWeather) ? <div>Loading Weather...</div> : <div>{JSON.stringify(currentWeather)}</div>

    return weatherState
}