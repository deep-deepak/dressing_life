import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartCardProps {
  title: string;
  data: { name: string; value: number }[];
}

const COLORS = ['#0a0a0a', '#7a0f0f', '#b32626', '#cf4747', '#8f8f8f', '#bdbdbd'];

export function DonutChartCard({ title, data }: DonutChartCardProps) {
  return (
    <div className="flex flex-col gap-4 border border-brand-gray-200 bg-brand-white p-5">
      <h3 className="font-display text-sm uppercase tracking-wide">{title}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2} isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ border: '1px solid #dcdcdc', borderRadius: 0, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
