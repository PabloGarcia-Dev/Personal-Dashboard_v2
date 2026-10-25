import ClockWidget from "./components/widgets/ClockWidget"
import ShuttleWidget from "./components/widgets/ShuttleWidget"
import WeatherWidget from "./components/widgets/WeatherWidget"
import LaundryWidget from "./components/widgets/LaundryWidget"
import SolarWidget from "./components/widgets/SolarWidget"
import useWeather from "./hooks/useWeather"
import useShuttle from "./hooks/useShuttle"

export default function App(){
  const {currentWeather, lastUpdatedWeather} = useWeather()
  const {shuttlePath, lastUpdatedShuttle} = useShuttle()

  return(
    <div className="h-screen p-4 flex flex-col gap-4 bg-gray-900 min-h-screen ">
        {/* Top row */}
        <div className="flex gap-4 items-stretch">
            <ClockWidget />
            <WeatherWidget currentWeather={currentWeather} lastUpdated={lastUpdatedWeather} />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4 flex-1">
            <ShuttleWidget shuttlePath={shuttlePath} lastUpdated={lastUpdatedShuttle} />
            <LaundryWidget />
            <SolarWidget daily={currentWeather?.daily} />
        </div>
    </div>
  )
}