import { Response } from 'express';
import { Period, Role } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

function calcPercent(value: number, target: number, isHigherBetter: boolean) {
  if (target === 0) return 0;
  const raw = isHigherBetter ? (value / target) * 100 : (target / value) * 100;
  return Math.max(0, Math.min(120, raw));
}

export async function listKpi(_req: AuthRequest, res: Response) {
  const items = await prisma.kpi.findMany({ include: { department: true, position: true } });
  res.json(items);
}

export async function createKpi(req: AuthRequest, res: Response) {
  if (![Role.SUPER_ADMIN, Role.CENTER_HEAD].includes(req.user!.role)) {
    return res.status(403).json({ message: 'Нет доступа' });
  }
  const payload = req.body as {
    title: string; description: string; unit: string; target: number; weight: number; period: Period; departmentId?: string; positionId?: string;
  };
  const created = await prisma.kpi.create({ data: payload });
  res.status(201).json(created);
}

export async function submitKpi(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const { month, year, entries, comment } = req.body as {
    month: number;
    year: number;
    comment?: string;
    entries: Array<{ kpiId: string; value: number; proofFileUrl?: string }>;
  };

  const submission = await prisma.kpiSubmission.upsert({
    where: { userId_month_year: { userId, month, year } },
    create: { userId, month, year, status: 'SUBMITTED', submittedAt: new Date(), managerNote: comment },
    update: { status: 'SUBMITTED', submittedAt: new Date(), managerNote: comment }
  });

  let totalScore = 0;
  let weightedScore = 0;

  for (const entry of entries) {
    const kpi = await prisma.kpi.findUniqueOrThrow({ where: { id: entry.kpiId } });
    const scorePercent = calcPercent(entry.value, kpi.target, kpi.isHigherBetter);
    const weighted = (scorePercent * kpi.weight) / 100;
    totalScore += scorePercent;
    weightedScore += weighted;

    await prisma.kpiValue.upsert({
      where: { submissionId_kpiId: { submissionId: submission.id, kpiId: entry.kpiId } },
      create: { submissionId: submission.id, kpiId: entry.kpiId, value: entry.value, scorePercent, weighted, proofFileUrl: entry.proofFileUrl },
      update: { value: entry.value, scorePercent, weighted, proofFileUrl: entry.proofFileUrl }
    });
  }

  const updated = await prisma.kpiSubmission.update({ where: { id: submission.id }, data: { totalScore, weightedScore } });
  res.json(updated);
}

export async function reviewKpi(req: AuthRequest, res: Response) {
  if (![Role.SUPER_ADMIN, Role.CENTER_HEAD, Role.DEPARTMENT_HEAD].includes(req.user!.role)) {
    return res.status(403).json({ message: 'Нет доступа' });
  }
  const { id } = req.params;
  const { status, managerNote } = req.body as { status: 'APPROVED' | 'REJECTED'; managerNote?: string };
  const updated = await prisma.kpiSubmission.update({
    where: { id },
    data: { status, managerNote, reviewedAt: new Date(), reviewerId: req.user!.id }
  });
  res.json(updated);
}
