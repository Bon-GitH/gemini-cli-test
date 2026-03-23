import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Signal, Zap } from 'lucide-react';

const App = () => {
    const [freq, setFreq] = useState(2.4);
    const [dist, setDist] = useState(1.5);
    const [fspl, setFspl] = useState<number | null>(null);
    const [chartData, setChartData] = useState([]);
    const [status, setStatus] = useState("Connecting...");

    const fetchFspl = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/calculate/fspl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frequencyGHz: freq, distanceKm: dist })
            });
            const data = await res.json();
            setFspl(data.lossDb);
        } catch (e) {
            console.error("Failed to fetch FSPL", e);
        }
    };

    const fetchChartData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/simulate/fspl-sweep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frequencyGHz: freq, maxDistanceKm: Math.max(5, dist * 2), steps: 20 })
            });
            const data = await res.json();
            setChartData(data);
        } catch (e) {
            console.error("Failed to fetch chart data", e);
        }
    };

    const checkStatus = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/status');
            const data = await res.json();
            setStatus(data.status);
        } catch (e) {
            setStatus("Offline");
        }
    };

    useEffect(() => {
        checkStatus();
        fetchFspl();
        fetchChartData();
    }, [freq, dist]);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans">
            <header className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-blue-500" />
                    <h1 className="text-2xl font-bold tracking-wider">AI_P Signal Dashboard</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${status === 'Online' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                    <span className="text-sm text-gray-400">Backend: {status}</span>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl flex flex-col space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center mb-4 text-white">
                            <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Control Panel
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Frequency (GHz)</label>
                                <input 
                                    type="number" 
                                    value={freq} 
                                    onChange={(e) => setFreq(Number(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    step="0.1"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Distance (km)</label>
                                <input 
                                    type="number" 
                                    value={dist} 
                                    onChange={(e) => setDist(Number(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    step="0.1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-800">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Free-Space Path Loss</p>
                                <p className="text-4xl font-mono font-bold text-red-400">{fspl ? fspl : '--'}</p>
                            </div>
                            <span className="text-gray-500 pb-1 font-mono">dB</span>
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
                     <h2 className="text-lg font-semibold flex items-center mb-6 text-white">
                        <Signal className="w-5 h-5 mr-2 text-blue-400" /> FSPL vs Distance
                    </h2>
                    
                    <div className="h-80 w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis 
                                        dataKey="distance" 
                                        stroke="#9ca3af" 
                                        tick={{fill: '#9ca3af'}} 
                                    />
                                    <YAxis 
                                        stroke="#9ca3af" 
                                        tick={{fill: '#9ca3af'}} 
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        itemStyle={{ color: '#60a5fa' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="loss" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#1f2937' }} 
                                        activeDot={{ r: 6, fill: '#60a5fa' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Loading visualization data...
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;
