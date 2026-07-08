import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LineChartCardProps<T extends object> {
  title: string;
  data: T[];
  dataKey: keyof T & string;
  xKey: keyof T & string;
}

export function LineChartCard<T extends object>({ title, data, dataKey, xKey }: LineChartCardProps<T>) {
  return (
    <div className="flex flex-col gap-4 border border-brand-gray-200 bg-brand-white p-5">
      <h3 className="font-display text-sm uppercase tracking-wide">{title}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#dcdcdc" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey={xKey as any} tick={{ fontSize: 12, fill: '#4a4a4a' }} axisLine={{ stroke: '#dcdcdc' }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#4a4a4a' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ border: '1px solid #dcdcdc', borderRadius: 0, fontSize: 12 }}
              labelStyle={{ color: '#0a0a0a', fontWeight: 600 }}
            />
            <Line type="monotone" dataKey={dataKey as any} stroke="#7a0f0f" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
