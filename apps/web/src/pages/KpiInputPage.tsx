import { FormEvent, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Button, Card, Input } from '../components/ui';

export function KpiInputPage() {
  const [kpis, setKpis] = useState<any[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => {
    api.get('/kpi').then((res) => setKpis(res.data));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/kpi/input', {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      entries: Object.entries(values).map(([kpiId, value]) => ({ kpiId, value }))
    });
    alert('Отправлено');
  };

  return (
    <Card>
      <h2 className="mb-3 text-2xl font-bold">Ввод KPI</h2>
      <form onSubmit={submit} className="space-y-3">
        {kpis.map((kpi) => (
          <div key={kpi.id}>
            <label className="text-sm">{kpi.title} (цель: {kpi.target} {kpi.unit})</label>
            <Input type="number" value={values[kpi.id] ?? ''} onChange={(e) => setValues((prev) => ({ ...prev, [kpi.id]: Number(e.target.value) }))} />
          </div>
        ))}
        <Button type="submit">Отправить отчет</Button>
      </form>
    </Card>
  );
}
