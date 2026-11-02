import ClockWidget from "../components/widgets/ClockWidget"
import ShuttleWidget from "../components/widgets/ShuttleWidget"
import WeatherWidget from "../components/widgets/WeatherWidget"
import LaundryWidget from "../components/widgets/LaundryWidget"
import useWeather from "../hooks/useWeather"
import useShuttle from "../hooks/useShuttle"
import useLaundry from "../hooks/useLaundry"
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const {currentWeather, lastUpdatedWeather} = useWeather()
  const { shuttlePath, gameDayRoute, lastUpdated: lastUpdatedShuttle } = useShuttle()
  const { laundryData, lastUpdated: lastUpdatedLaundry } = useLaundry()
  const navigate = useNavigate()

  return(
    <div className="h-screen p-12 flex flex-col gap-8 bg-gray-900 overflow-hidden">
        {/* Top row */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 h-[42vh]">
            <div className="flex flex-col gap-4 min-w-0">
                <button onClick={() => navigate('/stats')}className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center justify-center w-16 h-16 text-3xl self-start">☰</button>
                <ClockWidget />
            </div>

            <div className="min-w-0 h-full">
                <ShuttleWidget shuttlePath={shuttlePath} gameDayRoute={gameDayRoute} lastUpdated={lastUpdatedShuttle} />
            </div>
            <div className="min-w-0 h-full">
                <LaundryWidget laundryData={laundryData} lastUpdated={lastUpdatedLaundry} />
            </div>
        </div>

        {/* Bottom row */}
        <div className="flex-1 min-h-0">
            <WeatherWidget currentWeather={currentWeather} lastUpdated={lastUpdatedWeather} daily={currentWeather?.daily} />
        </div>
    </div>
  )
}
