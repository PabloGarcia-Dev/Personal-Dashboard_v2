import LastUpdated from "../auxiliary/LastUpdated";

export default function WeatherWidget({lastUpdated, currentWeather}){
    if(!currentWeather) return <div>Loading Weather...</div>

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
        <div className="bg-gray-800 rounded-2xl p-4 flex flex-col gap-3 flex-1 h-fit">
            
            {/* Top: current temp + forecast side by side */}
            <div className="flex gap-6 flex-1">
                
                {/* Current weather - left, all vertical */}
                <div className="flex flex-col gap-2 text-white min-w-fit">
                    <div className="flex items-end gap-2">
                        <h1 className="text-9xl font-bold">{Math.round(currentWeatherObj.temperature_2m)}°</h1>
                    </div>
                    <p className="text-xl text-gray-300 font-bold">{weatherCodes[currentWeatherObj.weather_code] || "Unknown"}</p>
                    <p className="text-xl text-gray-400 font-bold">H: {Math.round(currentWeather.daily.temperature_2m_max[0])}° L: {Math.round(currentWeather.daily.temperature_2m_min[0])}°</p>
                    <div className="flex flex-col gap-1 text-lg text-gray-300 border-t border-gray-700 pt-2 mt-1 font-bold">
                        <span>💧 {currentWeatherObj.relative_humidity_2m}%</span>
                        <span>🌧 {currentWeather.hourly.precipitation_probability[0]}%</span>
                        <span>💨 {currentWeatherObj.wind_speed_10m}mph</span>
                        <span>☀️ UV {currentWeatherObj.uv_index}</span>
                    </div>
                </div>

                {/* Vertical divider */}
                <div className="w-px bg-gray-700 self-stretch" />

                {/* Forecast days */}
                <div className="flex flex-1 h-full">
                    {currentWeather.daily.time.slice(1, 7).map((date, i) => {
                        const dayIndex = i + 1
                        const dayName = new Date(date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short' })
                        const max = Math.round(currentWeather.daily.temperature_2m_max[dayIndex])
                        const min = Math.round(currentWeather.daily.temperature_2m_min[dayIndex])
                        const rain = currentWeather.daily.precipitation_probability_max[dayIndex]

                        return (
                            <div key={date} className="flex flex-col items-center justify-center gap-10 flex-1 text-gray-300 border-r border-gray-700 last:border-0 px-3">
                                <span className="font-bold text-white text-3xl">{dayName}</span>
                                <span className="text-7xl font-bold">
                                    {rain > 80 ? '⛈️' : rain > 60 ? '🌧️' : rain > 40 ? '🌦️' : rain > 20 ? '⛅' : '☀️'}
                                </span>
                                <span className="text-lg font-bold">{max}°/{min}°</span>
                                <span className="text-blue-400 text-sm font-bold">🌧 {rain}%</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}