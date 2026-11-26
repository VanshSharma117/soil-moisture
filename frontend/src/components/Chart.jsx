import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'


export default function Chart({ data }) {
const formatted = data.map(r => ({
time: new Date(r.timestamp).toLocaleTimeString(),
moisture: r.moisture
}))


return (
<ResponsiveContainer width="100%" height={300}>
<LineChart data={formatted}>
<XAxis dataKey="time" />
<YAxis domain={[0, 100]} />
<Tooltip />
<Line type="monotone" dataKey="moisture" stroke="#8884d8" dot={false} />
</LineChart>
</ResponsiveContainer>
)
}