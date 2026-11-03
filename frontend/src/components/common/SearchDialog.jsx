import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, User, FileText, ArrowRight, Wallet, MapPin } from 'lucide-react';
import { Badge } from './Badge';

export function SearchDialog() {
  const { isSearchOpen, setIsSearchOpen, tasks, leads, fieldExecutives, setActiveTab } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global key combo: Cmd+K or Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { tasks: [], leads: [], agents: [] };
    const q = query.toLowerCase();

    const matchedTasks = tasks.filter(
      (t) =>
        t.customerName.toLowerCase().includes(q) ||
        t.loanId.toLowerCase().includes(q) ||
        t.assignedExecutiveName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
    );

    const matchedLeads = leads.filter(
      (l) =>
        l.customerName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        (l.assignedExecutiveName && l.assignedExecutiveName.toLowerCase().includes(q)) ||
        l.loanType.toLowerCase().includes(q)
    );

    const matchedAgents = fieldExecutives.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.zoneName.toLowerCase().includes(q)
    );

    return {
      tasks: matchedTasks.slice(0, 4),
      leads: matchedLeads.slice(0, 3),
      agents: matchedAgents.slice(0, 3),
    };
  }, [query, tasks, leads, fieldExecutives]);

  const totalResults = results.tasks.length + results.leads.length + results.agents.length;

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search box */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/70 gap-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search customers, Loan IDs (LN-...), agents, or leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 bg-white">
          {!query.trim() && (
            <div className="text-center py-10 text-slate-500 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Type customer name (e.g. <span className="text-blue-600 font-semibold">Suresh</span>), loan ID (<span className="text-blue-600 font-semibold">LN-8842</span>), or agent name...
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {/* Collection Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-blue-600" />
                Collection Tasks ({results.tasks.length})
              </div>
              <div className="space-y-1.5">
                {results.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('tasks');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 transition-colors cursor-pointer group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {task.customerName}
                        </span>
                        <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
                          {task.loanId}
                        </span>
                        <Badge variant={task.status} size="xs">
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {task.address.slice(0, 45)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600">
                        ₹{task.emiAmountDue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500">{task.assignedExecutiveName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {results.leads.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                New Enquiries / Leads ({results.leads.length})
              </div>
              <div className="space-y-1.5">
                {results.leads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('leads');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {lead.customerName}
                        </span>
                        <span className="text-xs font-mono font-semibold text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded border border-sky-200">
                          {lead.id}
                        </span>
                        <Badge variant={lead.stage} size="xs">
                          {lead.stage}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{lead.loanType} • {lead.zoneName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-800">
                        ₹{lead.requestedAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500">{lead.assignedExecutiveName || 'Unassigned'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agents */}
          {results.agents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Field Executives ({results.agents.length})
              </div>
              <div className="space-y-1.5">
                {results.agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('team');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {agent.name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">({agent.id})</span>
                          <Badge variant={agent.status} size="xs">
                            {agent.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">{agent.zoneName}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
