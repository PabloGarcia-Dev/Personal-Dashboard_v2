import ClockWidget from "../components/widgets/ClockWidget"
import ShuttleWidget from "../components/widgets/ShuttleWidget"
import WeatherWidget from "../components/widgets/WeatherWidget"
import LaundryWidget from "../components/widgets/LaundryWidget"
import useWeather from "../hooks/useWeather"
import useShuttle from "../hooks/useShuttle"
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const {currentWeather, lastUpdatedWeather} = useWeather()
  const {shuttlePath, lastUpdatedShuttle} = useShuttle()
  const navigate = useNavigate()

  return(
    <div className="h-screen p-12 flex flex-col gap-8 bg-gray-900 overflow-hidden">
        
        {/* Top row */}
        <div className="flex gap-4 items-stretch">
            {/* Menu button + Clock */}
            <div className="flex flex-col gap-4 flex-1">
                <button
                    onClick={() => navigate('/stats')}
                    className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center justify-center w-16 h-16 text-3xl self-start"
                >
                    ☰
                </button>
                <ClockWidget />
            </div>

            {/* Shuttle + Laundry side by side - fixed square size */}
            <div className="flex gap-4 items-start">
                <div className="w-[580px] h-[500px]">
                    <ShuttleWidget shuttlePath={shuttlePath} lastUpdated={lastUpdatedShuttle} />
                </div>
                <div className="w-[580px] h-[500px]">
                    <LaundryWidget />
                </div>
            </div>
        </div>

        {/* Bottom row - full width weather */}
        <div className="h-[500px] flex-1 min-h-0">
            <WeatherWidget currentWeather={currentWeather} lastUpdated={lastUpdatedWeather} daily={currentWeather?.daily} />
        </div>
    </div>
  )
}