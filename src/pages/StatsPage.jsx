import { useNavigate } from 'react-router-dom'
import SystemWidget from '../components/widgets/SystemWidget'
import AdGuardWidget from '../components/widgets/AdGuardWidget'

export default function StatsPage(){
    const navigate = useNavigate()

    return (
        <div className="relative h-screen bg-gray-900 p-4 flex flex-col gap-4 overflow-hidden">
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 z-10 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl transition-colors"
            >
                ← Back
            </button>
            <div className="grid grid-cols-2 gap-4 flex-1 mt-14">
                <SystemWidget />
                <AdGuardWidget />
            </div>
            <div className="text-center text-gray-500 text-sm pb-2">
                <p className="text-lg text-gray-400">Personal Dashboard v2.2</p>
                <p>Created by <span className="text-white font-bold">Pablo Garcia</span></p>
            </div>
        </div>
    )
}