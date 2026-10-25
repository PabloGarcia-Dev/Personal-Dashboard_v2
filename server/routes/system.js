const express = require('express')
const router = express.Router()
const os = require('os')
const { exec } = require('child_process')

router.get('/', (req, res) => {
    const nets = os.networkInterfaces()
    let localIP = 'N/A'
    for(const name of Object.keys(nets)){
        for(const net of nets[name]){
            if(net.family === 'IPv4' && !net.internal){
                localIP = net.address
                break
            }
        }
        if(localIP !== 'N/A') break
    }

    let results = {}
    let pending = 4

    const done = () => {
        if(--pending === 0){
            res.json({
                cpu: Math.round(os.loadavg()[0] * 100 / os.cpus().length),
                ramUsed: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
                ramTotal: Math.round(os.totalmem() / 1024 / 1024),
                temp: results.temp || 'N/A',
                uptime: Math.round(os.uptime() / 3600) + ' hours',
                disk: results.disk || 'N/A',
                throttled: results.throttled || 'N/A',
                ip: localIP,
                wifi: results.wifi
            })
        }
    }

    exec('vcgencmd measure_temp', (err, stdout) => {
        results.temp = stdout ? stdout.replace('temp=', '').replace("'C\n", '').trim() : 'N/A'
        done()
    })

    exec("df -h / | awk 'NR==2 {print $2, $3, $5}'", (err, stdout) => {
        if(stdout){
            const parts = stdout.trim().split(' ')
            results.disk = { total: parts[0], used: parts[1], percent: parts[2] }
        } else {
            results.disk = { total: 'N/A', used: 'N/A', percent: 'N/A' }
        }
        done()
    })

    exec('vcgencmd get_throttled', (err, stdout) => {
        if(stdout){
            const raw = stdout.replace('throttled=', '').trim()
            const val = parseInt(raw, 16)
            if(val === 0){
                results.throttled = { status: 'HEALTHY', code: raw, detail: 'No issues detected' }
            } else {
                const flags = []
                if(val & 0x1) flags.push('Under-voltage!')
                if(val & 0x2) flags.push('Freq capped')
                if(val & 0x4) flags.push('Throttled!')
                if(val & 0x10000) flags.push('Under-voltage occurred')
                if(val & 0x20000) flags.push('Freq cap occurred')
                if(val & 0x40000) flags.push('Throttle occurred')
                results.throttled = { status: 'WARNING', code: raw, detail: flags.join(', ') }
            }
        } else {
            results.throttled = { status: 'N/A', code: 'N/A', detail: 'vcgencmd unavailable' }
        }
        done()
    })

    exec("iwconfig wlan0 2>/dev/null | grep 'ESSID'", (err, stdout) => {
        if(stdout && !stdout.includes('off/any')){
            const ssid = stdout.match(/ESSID:"(.+?)"/)
            const quality = stdout.match(/Link Quality=(\d+)\/(\d+)/)
            results.wifi = {
                connected: true,
                ssid: ssid ? ssid[1] : 'Unknown',
                quality: quality ? Math.round((parseInt(quality[1]) / parseInt(quality[2])) * 100) + '%' : 'N/A'
            }
        } else {
            results.wifi = { connected: false, ssid: 'Not connected', quality: 'N/A' }
        }
        done()
    })
})

module.exports = router