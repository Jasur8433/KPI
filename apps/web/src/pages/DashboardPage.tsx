import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../lib/api';
import { Card } from '../components/ui';

export function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/summary').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Загрузка...</p>;

  const pie = [
    { name: 'Отлично', value: data.employeeRank.filter((x: any) => x.kpi >= 90).length },
    { name: 'Хорошо', value: data.employeeRank.filter((x: any) => x.kpi >= 75 && x.kpi < 90).length },
    { name: 'Удовл.', value: data.employeeRank.filter((x: any) => x.kpi >= 60 && x.kpi < 75).length },
    { name: 'Низкий', value: data.employeeRank.filter((x: any) => x.kpi < 60).length }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm">Средний KPI</p><p className="text-2xl font-bold">{data.averageKpi}%</p></Card>
        <Card><p className="text-sm">Лучшие сотрудники</p><p className="text-2xl font-bold">{data.topEmployees.length}</p></Card>
        <Card><p className="text-sm">Низкий KPI</p><p className="text-2xl font-bold">{data.lowEmployees.length}</p></Card>
        <Card><p className="text-sm">Подразделения</p><p className="text-2xl font-bold">{data.perDepartment.length}</p></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-80"><p>KPI по отделам</p><ResponsiveContainer><BarChart data={data.perDepartment}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="department" /><YAxis /><Tooltip /><Legend /><Bar dataKey="kpi" fill="#3b82f6" /></BarChart></ResponsiveContainer></Card>
        <Card className="h-80"><p>Оценки KPI</p><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" cx="50%" cy="50%" outerRadius={90} fill="#22c55e" label /><Tooltip /></PieChart></ResponsiveContainer></Card>
      </div>

      <Card className="h-80"><p>Динамика KPI</p><ResponsiveContainer><LineChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="kpi" stroke="#22c55e" /></LineChart></ResponsiveContainer></Card>

      <Card>
        <h3 className="mb-2 text-xl font-semibold">Leaderboard сотрудников</h3>
        <div className="space-y-2">
          {data.employeeRank.map((emp: any, idx: number) => (
            <div key={emp.name} className="flex items-center justify-between rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
              <span>{idx + 1}. {emp.name}</span>
              <span>{emp.kpi.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
