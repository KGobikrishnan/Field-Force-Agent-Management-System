import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { AgentDetailsModal } from './AgentDetailsModal';
import {
  Shield,
  Briefcase,
  ChevronDown,
  ChevronRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export function TeamHierarchy() {
  const { teamLeaders, fieldExecutives, tasks, selectedZone, ZONES, setSelectedZone } = useApp();

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [expandedTLs, setExpandedTLs] = useState({ 'TL-101': true, 'TL-102': true });

  const toggleTLExpand = (tlId) => {
    setExpandedTLs((prev) => ({ ...prev, [tlId]: !prev[tlId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Team Force & Hierarchy Tree</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Operations Structure
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Command hierarchy: Super Admin → Zone Team Leaders → Assigned Field Recovery Executives
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-semibold hidden sm:inline">Zone Filter:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none shadow-xs"
          >
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TOP ROOT NODE: Super Admin / Operations Head */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-white border-2 border-blue-600 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
              alt="Arvind Singhal"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full">
              <Shield className="w-4 h-4 text-blue-600" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">Arvind Singhal</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Chief Risk & Recovery Officer • Headquarters</p>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Scope</span>
          <span className="font-extrabold text-blue-600">2 Zones • 5 Agents</span>
        </div>
      </div>

      {/* Connecting Vertical Stem */}
      <div className="w-0.5 h-6 bg-blue-300 mx-auto" />

      {/* LEVEL 2: Team Leaders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {teamLeaders.map((tl) => {
          const isExpanded = !!expandedTLs[tl.id];
          const assignedAgents = fieldExecutives.filter((e) =>
            tl.assignedExecutiveIds.includes(e.id)
          );
          const tlPercent = Math.min(100, Math.round((tl.dailyAchieved / tl.dailyTarget) * 100));

          return (
            <div
              key={tl.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm relative"
            >
              {/* TL Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={tl.avatar}
                      alt={tl.name}
                      className="w-11 h-11 rounded-xl object-cover border-2 border-blue-500"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{tl.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Team Leader
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {tl.zoneName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleTLExpand(tl.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Expand/Collapse Team"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>

              {/* TL Target Progress */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Team Target Attainment:</span>
                  <span className="text-blue-600 font-extrabold font-mono">
                    ₹{tl.dailyAchieved.toLocaleString('en-IN')} / ₹{tl.dailyTarget.toLocaleString('en-IN')} ({tlPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${tlPercent}%` }} />
                </div>
              </div>

              {/* LEVEL 3: Assigned Field Executives Sub-Tree */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Reporting Executives ({assignedAgents.length})
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {assignedAgents.map((agent) => {
                      const agentPercent = Math.min(
                        100,
                        Math.round((agent.dailyCollected / agent.dailyTarget) * 100)
                      );

                      return (
                        <div
                          key={agent.id}
                          onClick={() => setSelectedAgent(agent)}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all cursor-pointer space-y-2.5 group shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={agent.avatar}
                                alt={agent.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {agent.name}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">({agent.id})</span>
                                  <Badge variant={agent.status} size="xs">
                                    {agent.status}
                                  </Badge>
                                </div>
                                <span className="text-[11px] text-slate-500 block truncate max-w-xs font-medium">
                                  {agent.gpsStatus}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-extrabold font-mono text-blue-600">
                                {agent.efficiencyScore}%
                              </span>
                              <span className="text-[10px] text-slate-400 block font-medium">Score</span>
                            </div>
                          </div>

                          {/* Target bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">Collected:</span>
                              <span className="font-mono text-blue-600 font-bold">
                                ₹{agent.dailyCollected.toLocaleString('en-IN')} / ₹{agent.dailyTarget.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-600"
                                style={{ width: `${agentPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Micro stats */}
                          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
                            <span>Tasks: {agent.activeTasksCount} active • {agent.completedTasksCount} done</span>
                            <span className="flex items-center gap-1 text-blue-600 font-bold group-hover:underline">
                              <span>Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Agent Details Drill-Down Modal */}
      <AgentDetailsModal
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
        tasks={tasks}
      />
    </div>
  );
}
