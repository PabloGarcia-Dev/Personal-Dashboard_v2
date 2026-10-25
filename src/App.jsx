import ClockWidget from "./components/widgets/ClockWidget"
import ShuttleWidget from "./components/widgets/ShuttleWidget"
import WeatherWidget from "./components/widgets/WeatherWidget"
import useWeather from "./hooks/useWeather"
import useShuttle from "./hooks/useShuttle"

export default function App(){
  const {currentWeather, lastUpdatedWeather} = useWeather()
  const {shuttlePath, lastUpdatedShuttle} = useShuttle()

  if(!currentWeather) return <div>Loading Weather...</div>  
  if(!shuttlePath) return <div>Loading Data...</div>


  return(
    <div className="flex items-center">
      <ClockWidget></ClockWidget>
      <ForecastBar daily={currentWeather.daily} />  // {/* spans full width */}
      <div className="grid grid-cols-3 gap-4">
          <WeatherWidget lastUpdated={lastUpdatedWeather} currentWeather={currentWeather}/>
          <ShuttleWidget lastUpdated={lastUpdatedShuttle} shuttlePath={shuttlePath}/>
          <LaundryWidget />
      </div>
    </div>
  )
}