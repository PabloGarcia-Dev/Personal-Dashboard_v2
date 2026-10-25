export default function SolarWidget({ daily }){
    if(!daily) return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
    )

    const now = new Date()
    const sunrise = new Date(daily.sunrise[0])
    const sunset = new Date(daily.sunset[0])

    const totalDaylight = (sunset - sunrise) / (1000 * 60)
    const minutesPassed = (now - sunrise) / (1000 * 60)
    const percent = Math.min(Math.max((minutesPassed / totalDaylight) * 100, 0), 100)

    const isNight = now < sunrise || now > sunset
    const sunIcon = isNight ? '🌕' : '☀️'
    const statusText = isNight ? 'Moonlight' : 'Daylight'

    const sunriseStr = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    const sunsetStr = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    // SVG arc math
    const W = 300
    const H = 180
    const startX = 20
    const endX = W - 20
    const baseY = H - 20
    const peakY = 0

    // Place sun along the arc using quadratic bezier formula
    const t = percent / 100
    const cx = (startX + endX) / 2
    const sunX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cx + t * t * endX
    const sunY = (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * peakY + t * t * baseY

    return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex flex-col gap-2">

            {/* Header */}
            <div>
                <h3 className="text-white font-bold text-xl">🌤 Solar Tracker</h3>
                <p className="text-gray-400 text-sm">{statusText}</p>
            </div>

            {/* Arc SVG - flex-1 makes it fill remaining space */}
            <div className="flex-1">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
                    <defs>
                        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#1e3a5f" />
                            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#1e3a5f" />
                        </linearGradient>
                        <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`M ${startX} ${baseY} Q ${cx} ${peakY} ${endX} ${baseY} Z`} fill="url(#fillGrad)" />
                    <path d={`M ${startX} ${baseY} Q ${cx} ${peakY} ${endX} ${baseY}`} fill="none" stroke="url(#arcGrad)" strokeWidth="2" />
                    <line x1={startX} y1={baseY} x2={endX} y2={baseY} stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={sunX} y={sunY} textAnchor="middle" dominantBaseline="middle" fontSize="20">{sunIcon}</text>
                </svg>
            </div>

            {/* Footer */}
            <div className="flex justify-between text-gray-400 text-sm">
                <span>🌅 {sunriseStr}</span>
                <span className="text-white font-bold">{statusText}</span>
                <span>🌇 {sunsetStr}</span>
            </div>
        </div>
    )
}