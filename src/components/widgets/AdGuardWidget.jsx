import LastUpdated from '../auxiliary/LastUpdated'
import useAdGuard from '../../hooks/useAdguard'

export default function AdGuardWidget(){
    const { adGuardData, lastUpdated } = useAdGuard()

    if(!adGuardData || adGuardData.error) return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex items-center justify-center">
            <p className="text-gray-400">AdGuard unavailable</p>
        </div>
    )

    const blockPercent = adGuardData.num_dns_queries > 0
        ? ((adGuardData.num_blocked_filtering / adGuardData.num_dns_queries) * 100).toFixed(1)
        : 0

    const topBlocked = adGuardData.top_blocked_domains[0]
        ? Object.keys(adGuardData.top_blocked_domains[0])[0]
        : 'None'

    const avgTime = (adGuardData.avg_processing_time * 1000).toFixed(1)

    return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-center gap-3">
                <span className="text-3xl">🛡️</span>
                <div>
                    <h3 className="text-white font-bold text-xl">AdGuard</h3>
                    <p className="text-gray-400 text-sm">Network Ad Blocker</p>
                </div>
            </div>

            <div className="border-t border-gray-700" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 flex-1">
                <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Total Queries</span>
                    <span className="text-2xl font-bold text-white">{adGuardData.num_dns_queries.toLocaleString()}</span>
                </div>

                <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Blocked</span>
                    <span className="text-2xl font-bold text-red-400">{adGuardData.num_blocked_filtering.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs">{blockPercent}% of queries</span>
                </div>

                <div className="bg-gray-700 rounded-xl p-4 col-span-2 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Top Blocked Domain</span>
                    <span className="text-white text-sm truncate">{topBlocked}</span>
                </div>

                <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Avg Response</span>
                    <span className="text-2xl font-bold text-white">{avgTime}ms</span>
                </div>

                <div className="bg-gray-700 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Block Rate</span>
                    <span className="text-2xl font-bold text-green-400">{blockPercent}%</span>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
                <LastUpdated time={lastUpdated} />
            </div>
        </div>
    )
}