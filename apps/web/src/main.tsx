import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { GenericPage } from './pages/GenericPage';
import { KpiInputPage } from './pages/KpiInputPage';
import { LoginPage } from './pages/LoginPage';

function PrivateRoutes() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employees" element={<GenericPage title="Сотрудники" description="Управление сотрудниками, роли, бейджи и рейтинг." />} />
        <Route path="/kpi" element={<GenericPage title="KPI" description="Справочник KPI, назначение KPI должностям и отделам." />} />
        <Route path="/kpi/input" element={<KpiInputPage />} />
        <Route path="/kpi/analytics" element={<GenericPage title="Аналитика KPI" description="Heatmap KPI, топ-10 сотрудников, худшие показатели, сравнение отделов." />} />
        <Route path="/departments" element={<GenericPage title="Отделы" description="Центр цифровых технологий и профильные подразделения." />} />
        <Route path="/positions" element={<GenericPage title="Должности" description="Каталог должностей для назначения KPI." />} />
        <Route path="/reports" element={<GenericPage title="Отчеты" description="Экспорт месячных KPI отчетов в PDF/Excel." />} />
        <Route path="/settings" element={<GenericPage title="Настройки" description="Темная тема, языки RU/UZ, уведомления и напоминания." />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<PrivateRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
