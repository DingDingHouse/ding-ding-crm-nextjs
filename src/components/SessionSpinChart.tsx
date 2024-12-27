import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SpinData {
    spinId: string;
    betAmount: number;
    winAmount: number;
}

interface SessionSpinChartProps {
    spinData: SpinData[];
}

export function SessionSpinChart({ spinData }: SessionSpinChartProps) {
    const chartData = spinData.map((spin, index) => ({
        spin: index + 1,
        winPercentage: spin.betAmount > 0 ? (spin.winAmount / spin.betAmount) * 100 : 0,
        betAmount: spin.betAmount,
        winAmount: spin.winAmount,
    }));

    const totalWinPercentage = spinData.reduce(
        (sum, spin) => sum + (spin.betAmount > 0 ? (spin.winAmount / spin.betAmount) * 100 : 0),
        0
    );

    const averageWinPercentage = spinData.length > 0 ? totalWinPercentage / spinData.length : 0;

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">Average Win Percentage : {averageWinPercentage}</p>
            <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="spin"
                            label={{ value: "Spin Number", position: "bottom", offset: 40 }}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{ value: "Win Percentage (%)", angle: -90, position: "insideLeft", offset: -10 }}
                            tick={{ fontSize: 12 }}
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(value) => `${value.toFixed(2)}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="winPercentage"
                            stroke="#82ca9d"
                            name="Win Percentage"
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                        <ReferenceLine
                            y={averageWinPercentage}
                            label={{
                                value: `Avg: ${averageWinPercentage.toFixed(2)}%`,
                                position: 'right',
                                fill: '#8884d8',
                                fontSize: 12,
                            }}
                            stroke="#8884d8"
                            strokeDasharray="3 3"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border rounded p-3 shadow-md">
                <p className="text-green-600">Win Percentage: {data.winPercentage.toFixed(2)}%</p>
                <p className="text-purple-600">Bet Amount: ${data.betAmount.toFixed(3)}</p>
                <p className="text-blue-600">Win Amount: ${data.winAmount.toFixed(3)}</p>
            </div>
        );
    }
    return null;
}

