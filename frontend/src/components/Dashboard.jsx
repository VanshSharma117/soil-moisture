import React, { useEffect, useState } from 'react'
import { api, socket } from '../api'
import Chart from './Chart'


export default function Dashboard() {
const [readings, setReadings] = useState([]);


useEffect(() => {
let mounted = true;
api.get('/readings/latest/50')
.then(res => { if (mounted) setReadings(res.data.reverse()) })
.catch(console.error);


socket.on('new-reading', (r) => {
setReadings(prev => [...prev, r].slice(-200));
});


return () => { mounted = false; socket.off('new-reading'); }
}, []);


const latest = readings[readings.length - 1];


return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="md:col-span-2">
<div className="card p-4 bg-white rounded shadow">
<h2 className="text-lg font-medium">Soil Moisture Over Time</h2>
<Chart data={readings} />
</div>
</div>
<aside className="p-4 bg-white rounded shadow">
<h3 className="font-semibold">Latest Reading</h3>
{latest ? (
<div>
<p><strong>Device:</strong> {latest.deviceId}</p>
<p><strong>Moisture:</strong> {latest.moisture}%</p>
<p><strong>Temp:</strong> {latest.temperature ?? '—'}°C</p>
<p><strong>Time:</strong> {new Date(latest.timestamp).toLocaleString()}</p>
</div>
) : <p>No data yet</p>}
</aside>
</div>
)
}