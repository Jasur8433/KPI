import { PrismaClient, Period, Role, SubmissionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.kpiValue.deleteMany();
  await prisma.kpiSubmission.deleteMany();
  await prisma.kpi.deleteMany();
  await prisma.user.deleteMany();
  await prisma.position.deleteMany();
  await prisma.department.deleteMany();

  const departments = await prisma.department.createMany({
    data: [
      { name: 'Центр цифровых технологий' },
      { name: 'Отдел внедрения цифрового образования' },
      { name: 'Сетевое администрирование' },
      { name: 'Техническая поддержка' },
      { name: 'Информационная безопасность' }
    ]
  });

  const allDepartments = await prisma.department.findMany();
  const depByName = Object.fromEntries(allDepartments.map((d) => [d.name, d.id]));

  await prisma.position.createMany({
    data: [
      'Руководитель центра','Начальник отдела','Инженер-программист','Веб-дизайнер','Контент менеджер',
      'Сетевой администратор','Инженер техподдержки','Инженер-электроник','Заведующий компьютерным классом','Специалист по ИБ'
    ].map((name) => ({ name }))
  });

  const allPositions = await prisma.position.findMany();
  const posByName = Object.fromEntries(allPositions.map((p) => [p.name, p.id]));

  const hash = await bcrypt.hash('Password123!', 10);
  const users = [
    { name: 'Super Admin', email: 'superadmin@rttm.uz', role: Role.SUPER_ADMIN },
    { name: 'Директор центра', email: 'director@rttm.uz', role: Role.CENTER_HEAD, departmentId: depByName['Центр цифровых технологий'], positionId: posByName['Руководитель центра'] },
    { name: 'Начальник ИБ', email: 'head.sec@rttm.uz', role: Role.DEPARTMENT_HEAD, departmentId: depByName['Информационная безопасность'], positionId: posByName['Начальник отдела'] },
    { name: 'Dev Engineer', email: 'dev@rttm.uz', role: Role.EMPLOYEE, departmentId: depByName['Центр цифровых технологий'], positionId: posByName['Инженер-программист'] },
    { name: 'Network Admin', email: 'net@rttm.uz', role: Role.EMPLOYEE, departmentId: depByName['Сетевое администрирование'], positionId: posByName['Сетевой администратор'] },
    { name: 'Web Designer', email: 'designer@rttm.uz', role: Role.EMPLOYEE, departmentId: depByName['Отдел внедрения цифрового образования'], positionId: posByName['Веб-дизайнер'] },
    { name: 'Viewer', email: 'viewer@rttm.uz', role: Role.VIEWER }
  ];

  await prisma.user.createMany({
    data: users.map((u) => ({ ...u, passwordHash: hash }))
  });

  const kpis = [
    { title: 'Разработка ПО', description: 'Разработка ПО ≥2 в квартал', unit: 'шт', target: 2, weight: 20, period: Period.QUARTER, positionId: posByName['Инженер-программист'], departmentId: depByName['Центр цифровых технологий'] },
    { title: 'Исправление ошибок', description: 'Устранение багов ≤4 часа', unit: 'часы', target: 4, weight: 20, period: Period.MONTH, positionId: posByName['Инженер-программист'], departmentId: depByName['Центр цифровых технологий'], isHigherBetter: false },
    { title: 'Uptime системы', description: 'Доступность систем ≥99%', unit: '%', target: 99, weight: 20, period: Period.MONTH, positionId: posByName['Инженер-программист'], departmentId: depByName['Центр цифровых технологий'] },
    { title: 'Uptime сети', description: 'Uptime сети ≥99.5%', unit: '%', target: 99.5, weight: 25, period: Period.MONTH, positionId: posByName['Сетевой администратор'], departmentId: depByName['Сетевое администрирование'] },
    { title: 'Устранение инцидентов', description: 'Решение инцидента ≤2 часа', unit: 'часы', target: 2, weight: 20, period: Period.MONTH, positionId: posByName['Сетевой администратор'], departmentId: depByName['Сетевое администрирование'], isHigherBetter: false },
    { title: 'Создание страниц', description: 'Страницы ≥3 в месяц', unit: 'шт', target: 3, weight: 20, period: Period.MONTH, positionId: posByName['Веб-дизайнер'], departmentId: depByName['Отдел внедрения цифрового образования'] }
  ];

  for (const item of kpis) {
    await prisma.kpi.create({ data: item });
  }

  const dev = await prisma.user.findUniqueOrThrow({ where: { email: 'dev@rttm.uz' } });
  const devSubmission = await prisma.kpiSubmission.create({
    data: {
      userId: dev.id,
      month: 3,
      year: 2026,
      status: SubmissionStatus.SUBMITTED,
      submittedAt: new Date(),
      totalScore: 88,
      weightedScore: 82
    }
  });

  const devKpis = await prisma.kpi.findMany({ where: { positionId: posByName['Инженер-программист'] } });
  for (const kpi of devKpis) {
    await prisma.kpiValue.create({
      data: {
        submissionId: devSubmission.id,
        kpiId: kpi.id,
        value: kpi.title === 'Исправление ошибок' ? 3 : kpi.target,
        scorePercent: 92,
        weighted: (92 * kpi.weight) / 100
      }
    });
  }

  await prisma.badge.createMany({
    data: [
      { key: 'top_performer', title: 'Топ-исполнитель', description: 'KPI выше 90%', threshold: 90 },
      { key: 'rising_star', title: 'Прорыв месяца', description: 'Рост KPI за месяц', threshold: 80 }
    ]
  });

  console.log(`Seed complete. Departments: ${departments.count}`);
}

main().finally(async () => prisma.$disconnect());
