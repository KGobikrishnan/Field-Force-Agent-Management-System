import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, CheckSquare, Wallet, UserCheck, Users, X } from 'lucide-react';

export function MobileNav() {
  const { activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, currentRole, ROLES, tasks, leads } = useApp();

  const openTasksCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const newLeadsCount = leads.filter((l) => l.stage === 'New Enquiry').length;

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: currentRole === ROLES.EXECUTIVE ? 'My Tasks' : 'Dispatcher', icon: CheckSquare, badge: openTasksCount },
    { id: 'collections', label: 'Collect', icon: Wallet },
    { id: 'leads', label: 'Leads', icon: UserCheck, badge: newLeadsCount },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <>
      {/* Mobile Drawer (When hamburger clicked) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white border-r border-slate-200 p-5 flex flex-col justify-between z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-extrabold text-lg text-slate-900">CrediForce Field</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {items.map((it) => {
                  const Icon = it.icon;
                  const isActive = activeTab === it.id;
                  return (
                    <button
                      key={it.id}
                      onClick={() => {
                        setActiveTab(it.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{it.label}</span>
                      </div>
                      {it.badge > 0 && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                          isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {it.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar for Mobile View */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 border-t border-slate-200 backdrop-blur-md flex items-center justify-around px-2 z-40 shadow-lg">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = activeTab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setActiveTab(it.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {it.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {it.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium">{it.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
