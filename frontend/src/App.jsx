import React from 'react'
import Dashboard from './components/Dashboard'


export default function App() {
return (
<div className="min-h-screen bg-gray-50 p-6">
<header className="mb-6">
<h1 className="text-2xl font-semibold">Soil Moisture Telemetry</h1>
<p className="text-sm text-gray-600">Real-time soil sensor dashboard</p>
</header>
<main>
<Dashboard />
</main>
</div>
)
}