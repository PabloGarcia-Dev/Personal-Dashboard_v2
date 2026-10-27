import LastUpdated from '../auxiliary/LastUpdated'

const MachineCard = ({ label, icon, running }) => (
    <div className={`flex flex-col gap-1 p-3 rounded-xl ${running ? 'bg-green-900/40 border border-green-500/50' : 'bg-gray-700'}`}>
        <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-white font-bold text-base">{label}</span>
        </div>
        <span className={`text-sm font-bold ${running ? 'text-green-400' : 'text-gray-400'}`}>
            {running ? '● Running' : '○ Idle'}
        </span>
    </div>
)

export default function LaundryWidget( {laundryData, lastUpdated} ){
    if(!laundryData) return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">Connecting...</p>
        </div>
    )

    if(laundryData.error) return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-2xl">🫧</span>
                <h3 className="text-white font-bold text-lg">Laundry</h3>
            </div>
            <p className="text-gray-500 text-sm">Sensor offline</p>
        </div>
    )

    return (
        <div className="bg-gray-800 rounded-2xl p-4 w-full h-full flex flex-col gap-3">
            
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-2xl">🫧</span>
                <h3 className="text-white font-bold text-lg">Laundry</h3>
            </div>

            {/* Machine cards */}
            <div className="flex flex-col gap-2 flex-1">
                <MachineCard label="Washer" icon="🫣" running={laundryData.washer} />
                <MachineCard label="Dryer" icon="🌀" running={laundryData.dryer} />
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 pt-2">
                <LastUpdated time={lastUpdated} />
            </div>
        </div>
    )
}