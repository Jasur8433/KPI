import { NavLink, Outlet } from 'react-router-dom';

const links = ['/dashboard','/employees','/kpi','/kpi/input','/kpi/analytics','/departments','/positions','/reports','/settings'];

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-4 text-xl font-bold">RTTM KPI</h1>
        <nav className="space-y-2">
          {links.map((item) => (
            <NavLink key={item} to={item} className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              {item}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
