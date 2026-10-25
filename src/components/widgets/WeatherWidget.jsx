import LastUpdated from "../auxiliary/LastUpdated";

export default function WeatherWidget({lastUpdated, currentWeather}){
    const currentWeatherObj = currentWeather.current;
    const weatherCodes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        61: "Slight Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        80: "Slight Showers",
        95: "Thunderstorm"
    }

    return(
        <div className="bg-red-900 rounded-2x1 p-6 flex">
            <div className="flex">
                <div>
                    <h1 className="text-[80px] bg-blue-400">{Math.round(currentWeatherObj.temperature_2m)}°F</h1>
                </div>
                <div className="">
                    <p className="bg-green-200">{weatherCodes[currentWeatherObj.weather_code] || "Unknown Weather"}</p>
                    <div className="bg-amber-400">
                        <p>High: {Math.round(currentWeather.daily.temperature_2m_max[0])}°</p>
                        <p>Low: {Math.round(currentWeather.daily.temperature_2m_min[0])}°</p>
                    </div>
                </div>
            </div>
            <div className="day-stats">
                <div className="bg-gray-200">
                    <h3>Humidity</h3>
                    <p>{currentWeatherObj.relative_humidity_2m}%</p>
                </div>
                <div className="bg-blue-200">
                    <h3>Risk of Rain</h3>
                    <p>{currentWeather.hourly.precipitation_probability[0]}%</p>
                </div>
                <div className="bg-green-200">
                    <h3>Wind Speed</h3>
                    <p>{currentWeatherObj.wind_speed_10m}mph</p>
                </div>
                <div className="bg-purple-600">
                    <h3>UV Index</h3>
                    <p>{currentWeatherObj.uv_index}</p>
                </div>
            </div>
            <div>
                <LastUpdated time={lastUpdated}></LastUpdated>
            </div>
        </div>
    )
}