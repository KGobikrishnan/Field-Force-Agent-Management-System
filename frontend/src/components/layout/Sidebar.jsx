import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  UserCheck,
  Users,
  FileBarChart,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Zap,
  Radio,
  Clock,
  BatteryCharging,
} from 'lucide-react';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentRole,
    currentUser,
    tasks,
    leads,
    executiveShift,
    ROLES,
  } = useApp();

  const openTasksCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const newLeadsCount = leads.filter((l) => l.stage === 'New Enquiry').length;
  const pendingApprovalsCount = tasks.filter((t) => t.amountCollected > 0 && !t.settlementApproved).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      roles: [ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.EXECUTIVE],
    },
    {
      id: 'tasks',
      label: currentRole === ROLES.EXECUTIVE ? 'My Field Tasks' : 'Task Dispatcher',
      icon: CheckSquare,
      badge: openTasksCount > 0 ? openTasksCount : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      roles: [ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.EXECUTIVE],
    },
    {
      id: 'collections',
      label: 'Collections Tracker',
      icon: Wallet,
      badge: (currentRole !== ROLES.EXECUTIVE && pendingApprovalsCount > 0) ? `${pendingApprovalsCount} pending` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roles: [ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.EXECUTIVE],
    },
    {
      id: 'leads',
      label: 'Lead Pipeline',
      icon: UserCheck,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : null,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      roles: [ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.EXECUTIVE],
    },
    {
      id: 'team',
      label: 'Team & Hierarchy',
      icon: Users,
      badge: null,
      roles: [ROLES.ADMIN, ROLES.TEAM_LEADER, ROLES.EXECUTIVE],
    },
    {
      id: 'reports',
      label: 'Reports & Audit Logs',
      icon: FileBarChart,
      badge: null,
      roles: [ROLES.ADMIN, ROLES.TEAM_LEADER],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30 select-none shadow-xs ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                <span>CrediForce</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Field
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 truncate font-medium">Loan & Field Force</p>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <div className="flex justify-center py-2 border-b border-slate-100">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Badge Indicator */}
      {!sidebarCollapsed && (
        <div className="px-3.5 py-2.5 mx-3 mt-3 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <div className="text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Active Scope</span>
              <span className="font-bold text-blue-900">{currentRole}</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => item.roles.includes(currentRole))
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                  }`}
                />

                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Dot for collapsed state */}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
      </nav>

      {/* Executive Quick Shift Card (for Field Executive View) */}
      {currentRole === ROLES.EXECUTIVE && !sidebarCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${executiveShift.isPunchedIn ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              Shift Status
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              executiveShift.isPunchedIn
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {executiveShift.isPunchedIn ? 'On Duty' : 'Off Duty'}
            </span>
          </div>

          <div className="text-slate-600 text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" /> Start:
              </span>
              <span className="text-slate-800 font-semibold font-mono">{executiveShift.punchInTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <BatteryCharging className="w-3 h-3 text-emerald-600" /> Battery:
              </span>
              <span className="text-slate-800 font-semibold">{executiveShift.battery}</span>
            </div>
          </div>
        </div>
      )}

      {/* User profile snippet at bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs"
          />
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 truncate font-medium">{currentUser.title}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
