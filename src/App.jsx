import ClockWidget from "./components/widgets/ClockWidget"
import ShuttleWidget from "./components/widgets/ShuttleWidget"
import WeatherWidget from "./components/widgets/WeatherWidget"

export default function App(){
  return(
    <div className="flex items-center">
      <ClockWidget></ClockWidget>
      <WeatherWidget></WeatherWidget>
      <ShuttleWidget></ShuttleWidget>
    </div>
  )
}