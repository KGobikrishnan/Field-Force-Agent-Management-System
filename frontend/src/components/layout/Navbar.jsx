import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  MapPin,
  ChevronDown,
  Shield,
  UserCheck,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Menu,
  Clock,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const {
    currentRole,
    currentUser,
    switchRole,
    ROLES,
    ZONES,
    selectedZone,
    setSelectedZone,
    setIsSearchOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    setActiveTab,
    setMobileMenuOpen,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);

  const roleRef = useRef(null);
  const zoneRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setRoleDropdownOpen(false);
      }
      if (zoneRef.current && !zoneRef.current.contains(e.target)) {
        setZoneDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotificationOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentZoneObj = ZONES.find((z) => z.id === selectedZone) || ZONES[0];

  const roleConfig = {
    [ROLES.ADMIN]: {
      label: 'Admin (Super Admin)',
      icon: Shield,
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      description: 'Full organization access, risk analytics & audit logs',
    },
    [ROLES.TEAM_LEADER]: {
      label: 'Team Leader (TL)',
      icon: Briefcase,
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      description: 'Team target oversight, task dispatching & settlements',
    },
    [ROLES.EXECUTIVE]: {
      label: 'Field Executive (Agent)',
      icon: UserCheck,
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      description: 'Daily agenda, collections receipting & lead verification',
    },
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-blue-300 hover:bg-white cursor-pointer transition-all duration-200 text-sm group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          <span className="hidden sm:inline truncate text-xs font-medium">Search customer, loan ID (LN-...), or agent...</span>
          <span className="sm:hidden truncate text-xs font-medium">Search...</span>
          <kbd className="ml-auto hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Branch Filter, Role Switcher, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Branch / Zone Filter Dropdown */}
        <div className="relative hidden md:block" ref={zoneRef}>
          <button
            onClick={() => setZoneDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-700 font-semibold transition-all shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-[140px] truncate">{currentZoneObj.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {zoneDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs animate-in fade-in-50">
              <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Filter by Branch / Zone
              </div>
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone.id);
                    setZoneDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedZone === zone.id
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{zone.name}</span>
                  {selectedZone === zone.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LIVE ROLE SWITCHER (Core Blue Accent Dropdown) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 border border-blue-600 text-xs font-bold text-white shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-blue-100 block leading-none font-medium">Role View:</span>
              <span className="text-white">{currentRole}</span>
            </div>
            <span className="sm:hidden text-white">{currentRole.split(' ')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Switch Role Persona (RBAC Demo)
                </span>
                <span className="text-[11px] text-slate-400">
                  Instant real-time permission & layout shift
                </span>
              </div>

              {Object.values(ROLES).map((roleKey) => {
                const conf = roleConfig[roleKey];
                const Icon = conf.icon;
                const isSelected = currentRole === roleKey;

                return (
                  <button
                    key={roleKey}
                    onClick={() => {
                      switchRole(roleKey);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 my-1 ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-slate-900 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${conf.badgeColor} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{conf.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{conf.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Drawer Trigger */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in-50">
              <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Live Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markNotificationRead('all')}
                    className="text-[11px] text-blue-600 font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 py-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">No new alerts</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkTab) setActiveTab(notif.linkTab);
                        setIsNotificationOpen(false);
                      }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                        notif.read
                          ? 'bg-slate-50/50 border-slate-100 text-slate-500'
                          : 'bg-blue-50/50 border-blue-100 text-slate-800'
                      } hover:bg-blue-50`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          {notif.type === 'critical' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
            <span className="text-[10px] text-slate-500 block font-medium">{currentUser.badge}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
