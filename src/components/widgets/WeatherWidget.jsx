import LastUpdated from "../auxiliary/LastUpdated";

function SolarBar({ daily }){
    if(!daily) return null

    const now = new Date()
    const sunrise = new Date(daily.sunrise[0])
    const sunset = new Date(daily.sunset[0])

    const totalDaylight = (sunset - sunrise) / (1000 * 60)
    const minutesPassed = (now - sunrise) / (1000 * 60)
    const percent = Math.min(Math.max((minutesPassed / totalDaylight) * 100, 0), 100)

    const isNight = now < sunrise || now > sunset
    const sunIcon = isNight ? '🌕' : '☀️'

    const sunriseStr = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    const sunsetStr = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-gray-400 text-2xl">
                <span>🌅 {sunriseStr}</span>
                <span>🌇 {sunsetStr}</span>
            </div>
            <div className="relative h-4 rounded-full bg-gradient-to-r from-blue-900 via-yellow-400 to-blue-900">
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-4xl"
                    style={{ left: `${percent}%` }}
                >
                    {sunIcon}
                </div>
            </div>
        </div>
    )
}

export default function WeatherWidget({lastUpdated, currentWeather, daily}){
    if(!currentWeather) return (
        <div className="bg-gray-800 rounded-2xl p-4 flex gap-6 h-full animate-pulse">
            <div className="flex flex-col gap-3 min-w-fit justify-around">
                <div className="h-16 w-32 bg-gray-700 rounded-xl"/>
                <div className="h-4 w-24 bg-gray-700 rounded-lg"/>
                <div className="h-4 w-20 bg-gray-700 rounded-lg"/>
                <div className="h-4 w-16 bg-gray-700 rounded-lg"/>
                <div className="h-4 w-16 bg-gray-700 rounded-lg"/>
            </div>
            <div className="w-px bg-gray-700 self-stretch"/>
            <div className="flex flex-1 justify-around">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="h-4 w-8 bg-gray-700 rounded"/>
                        <div className="h-8 w-8 bg-gray-700 rounded-full"/>
                        <div className="h-4 w-12 bg-gray-700 rounded"/>
                        <div className="h-4 w-8 bg-gray-700 rounded"/>
                    </div>
                ))}
            </div>
        </div>
    )

    const currentWeatherObj = currentWeather.current;
    const weatherCodes = {
        0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Fog", 48: "Rime Fog",
        51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
        61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
        80: "Slight Showers", 95: "Thunderstorm"
    }

    return(
        <div className="bg-gray-800 rounded-2xl p-4 flex gap-6 h-full">
            
            {/* Left: current weather */}
            <div className="flex flex-col text-white min-w-[250px] justify-center gap-5 py-2 p-7">
                <h1 className="text-9xl font-bold">{Math.round(currentWeatherObj.temperature_2m)}°</h1>
                <p className="text-4xl text-gray-300">{weatherCodes[currentWeatherObj.weather_code] || "Unknown"}</p>
                <p className="text-2xl text-gray-400">H: {Math.round(currentWeather.daily.temperature_2m_max[0])}° L: {Math.round(currentWeather.daily.temperature_2m_min[0])}°</p>
                <div className="flex flex-col gap-2 text-2xl text-gray-300 border-t border-gray-700 pt-2">
                    <span>💧 {currentWeatherObj.relative_humidity_2m}%</span>
                    <span>🌧 {currentWeather.hourly.precipitation_probability[0]}%</span>
                    <span>💨 {currentWeatherObj.wind_speed_10m}mph</span>
                    <span>☀️ UV {currentWeatherObj.uv_index}</span>
                </div>
                <LastUpdated className="text-9xl" time={lastUpdated}></LastUpdated>
            </div>

            {/* Vertical divider */}
            <div className="w-px bg-gray-700 self-stretch" />

            {/* Right: forecast + solar bar */}
            <div className="flex flex-col flex-1 gap-4">
                
                {/* Forecast days */}
                <div className="flex flex-1">
                    {currentWeather.daily.time.slice(1, 7).map((date, i) => {
                        const dayIndex = i + 1
                        const dayName = new Date(date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short' })
                        const max = Math.round(currentWeather.daily.temperature_2m_max[dayIndex])
                        const min = Math.round(currentWeather.daily.temperature_2m_min[dayIndex])
                        const rain = currentWeather.daily.precipitation_probability_max[dayIndex]

                        return (
                            <div key={date} className="flex flex-col items-center justify-around flex-1 text-gray-300 border-r border-gray-700 last:border-0 px-2">
                                <span className="font-bold text-white text-4xl">{dayName}</span>
                                <span className="text-8xl">
                                    {rain > 80 ? '⛈️' : rain > 60 ? '🌧️' : rain > 40 ? '🌦️' : rain > 20 ? '⛅' : '☀️'}
                                </span>
                                <span className="text-2xl">H:{max}°/L: {min}°</span>
                                <span className="text-blue-400 text-2xl">🌧 {rain}%</span>
                            </div>
                        )
                    })}
                </div>

                {/* Solar bar */}
                <div className="border-t border-gray-700 pt-3">
                    <SolarBar daily={daily} />
                </div>
            </div>
        </div>
    )
}