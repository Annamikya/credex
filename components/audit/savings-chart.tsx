'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface SavingsChartProps {
  data: Array<{ name: string; savings: number }>;
}

export function SavingsChart({ data }: SavingsChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl bg-slate-900 text-sm text-slate-500">
        No chart data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="#242835" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(34,41,77,0.75)' }}
          contentStyle={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: 16,
            color: '#e2e8f0'
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly Savings']}
        />
        <Bar dataKey="savings" radius={[12, 12, 0, 0]} barSize={36}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0ea5e9' : '#38bdf8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface MonthlyYearlyChartProps {
  monthly: number;
  yearly: number;
}

export function MonthlyYearlyChart({ monthly, yearly }: MonthlyYearlyChartProps) {
  const data = [
    { name: 'Monthly', value: monthly },
    { name: 'Yearly', value: yearly }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="#242835" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(34,41,77,0.75)' }}
          contentStyle={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: 16,
            color: '#e2e8f0'
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, value === monthly ? 'Monthly Savings' : 'Yearly Savings']}
        />
        <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={48}>
          <Cell fill="#0ea5e9" />
          <Cell fill="#38bdf8" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
