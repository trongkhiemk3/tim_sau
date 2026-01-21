import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { GameStats } from '../types';

interface ResultsChartProps {
  stats: GameStats;
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ stats }) => {
  const data = [
    {
      name: 'Sâu Xanh',
      caught: stats.caughtGreen,
      total: stats.totalGreen,
      survivalRate: ((stats.totalGreen - stats.caughtGreen) / stats.totalGreen * 100).toFixed(1),
      color: '#16a34a' // green-600
    },
    {
      name: 'Sâu Khác',
      caught: stats.caughtOthers,
      total: stats.totalOthers,
      survivalRate: ((stats.totalOthers - stats.caughtOthers) / stats.totalOthers * 100).toFixed(1),
      color: '#ef4444' // red-500
    },
  ];

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-inner border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 'dataMax']} />
          <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
          <Tooltip 
            formatter={(value: number, name: string) => [value, name === 'caught' ? 'Số lượng bị bắt' : name]}
            labelStyle={{ color: '#374151' }}
          />
          <Legend />
          <Bar dataKey="caught" name="Số lượng bị bắt" fill="#8884d8" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-2 grid grid-cols-2 gap-4 text-center text-sm font-medium">
        <div className="text-green-700">
          Tỷ lệ sống sót: {data[0].survivalRate}%
        </div>
        <div className="text-red-700">
          Tỷ lệ sống sót: {data[1].survivalRate}%
        </div>
      </div>
    </div>
  );
};