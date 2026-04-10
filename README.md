# RTTM KPI Management System

Production-ready MVP KPI-платформа для Центра цифровых образовательных технологий.

## Стек
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + Recharts + React Router
- **Backend**: Node.js + Express + Prisma ORM + PostgreSQL + JWT + RBAC
- **Infra**: Docker, .env, REST API

## Основной функционал
- Dashboard: средний KPI, KPI по отделам, leaderboard, лучшие/низкие сотрудники, динамика по месяцам.
- KPI справочник: период, вес, целевое значение, единица измерения, отдел, должность.
- Ввод KPI сотрудником и согласование руководителем (approve/reject + комментарий).
- KPI аналитика (MVP): рейтинг, сравнение отделов, динамика.
- Роли: Super Admin, Руководитель центра, Начальник отдела, Сотрудник, Просмотр.
- Двуязычность UI-заготовка (RU/UZ), dark mode.

## Быстрый запуск
```bash
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:4000/api`  
Web: `http://localhost:5173`

## Настройка БД
1. Поднять PostgreSQL локально или через Docker:
```bash
docker compose up -d db
```
2. Выполнить миграцию и сиды:
```bash
npm run prisma:generate -w @rttm-kpi/api
npm run prisma:migrate -w @rttm-kpi/api -- --name init
npm run prisma:seed -w @rttm-kpi/api
```

## Тестовые пользователи
Пароль для всех: `Password123!`
- `superadmin@rttm.uz` — Super Admin
- `director@rttm.uz` — Руководитель центра
- `head.sec@rttm.uz` — Начальник отдела
- `dev@rttm.uz` — Сотрудник (Инженер-программист)
- `net@rttm.uz` — Сотрудник (Сетевой администратор)
- `designer@rttm.uz` — Сотрудник (Веб-дизайнер)
- `viewer@rttm.uz` — Просмотр

## REST API (основные endpoint)
- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `GET /api/kpi`
- `POST /api/kpi`
- `POST /api/kpi/input`
- `PATCH /api/kpi/submissions/:id/review`

## Формула KPI
`Итоговый KPI = сумма(scorePercent × weight / 100)`

Шкала оценки:
- 90–100% — Отлично
- 75–89% — Хорошо
- 60–74% — Удовлетворительно
- <60% — Неудовлетворительно

## Страницы
- `/login`
- `/dashboard`
- `/employees`
- `/kpi`
- `/kpi/input`
- `/kpi/analytics`
- `/departments`
- `/positions`
- `/reports`
- `/settings`

## Docker
```bash
docker compose up --build
```

## Примечания по production
- Добавить object storage для файлов подтверждений (S3/MinIO).
- Подключить queue для reminders/notifications (BullMQ + Redis).
- Реализовать PDF/Excel экспорт через background jobs.
- Добавить e2e/unit тесты и CI/CD pipeline.
