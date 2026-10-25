import ClockWidget from "../components/widgets/ClockWidget"
import ShuttleWidget from "../components/widgets/ShuttleWidget"
import WeatherWidget from "../components/widgets/WeatherWidget"
import LaundryWidget from "../components/widgets/LaundryWidget"
import SolarWidget from "../components/widgets/SolarWidget"
import useWeather from "../hooks/useWeather"
import useShuttle from "../hooks/useShuttle"
import { useNavigate } from 'react-router-dom'

export default function App(){
  const {currentWeather, lastUpdatedWeather} = useWeather()
  const {shuttlePath, lastUpdatedShuttle} = useShuttle()
  const navigate = useNavigate()

  return(
    <div className="relative h-screen p-10 flex flex-col gap-6 bg-gray-900 overflow-hidden">
        {/* Top row */}
        <div className="flex gap-4 items-stretch">
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate('/stats')}
                    className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center justify-center w-16 h-16 text-3xl"
                >
                    ☰
                </button>
                <ClockWidget />
            </div>
            <WeatherWidget currentWeather={currentWeather} lastUpdated={lastUpdatedWeather} />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4 h-160">
            <ShuttleWidget shuttlePath={shuttlePath} lastUpdated={lastUpdatedShuttle} />
            <LaundryWidget />
            <SolarWidget daily={currentWeather?.daily} />
        </div>
    </div>
  )
}