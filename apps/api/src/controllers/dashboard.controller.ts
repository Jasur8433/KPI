import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export async function dashboardSummary(_req: AuthRequest, res: Response) {
  const submissions = await prisma.kpiSubmission.findMany({
    include: {
      user: { include: { department: true } },
      values: { include: { kpi: true } }
    }
  });

  const averageKpi = submissions.length
    ? submissions.reduce((acc, s) => acc + s.totalScore, 0) / submissions.length
    : 0;

  const perDepartment = Object.values(
    submissions.reduce((acc, sub) => {
      const key = sub.user.department?.name ?? 'Без отдела';
      if (!acc[key]) acc[key] = { department: key, total: 0, count: 0 };
      acc[key].total += sub.totalScore;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { department: string; total: number; count: number }>)
  ).map((d) => ({ department: d.department, kpi: Number((d.total / d.count).toFixed(2)) }));

  const employeeRank = submissions
    .map((s) => ({ name: s.user.name, kpi: s.totalScore }))
    .sort((a, b) => b.kpi - a.kpi);

  const monthlyTrend = Object.values(
    submissions.reduce((acc, s) => {
      const key = `${s.year}-${String(s.month).padStart(2, '0')}`;
      if (!acc[key]) acc[key] = { month: key, total: 0, count: 0 };
      acc[key].total += s.totalScore;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { month: string; total: number; count: number }>)
  ).map((m) => ({ month: m.month, kpi: Number((m.total / m.count).toFixed(2)) }));

  res.json({
    averageKpi: Number(averageKpi.toFixed(2)),
    perDepartment,
    employeeRank,
    topEmployees: employeeRank.slice(0, 5),
    lowEmployees: [...employeeRank].reverse().slice(0, 5),
    monthlyTrend
  });
}
