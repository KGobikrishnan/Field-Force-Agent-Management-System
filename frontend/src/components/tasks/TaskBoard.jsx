import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { CollectPaymentModal } from './CollectPaymentModal';
import { TaskStatusModal } from './TaskStatusModal';
import { RoutePreviewModal } from './RoutePreviewModal';
import { DispatchTaskModal } from './DispatchTaskModal';
import {
  Table,
  Kanban,
  Search,
  Plus,
  Navigation,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
} from 'lucide-react';

export function TaskBoard() {
  const { filteredTasks, currentRole, ROLES } = useApp();

  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modals state
  const [selectedTaskForPayment, setSelectedTaskForPayment] = useState(null);
  const [selectedTaskForStatus, setSelectedTaskForStatus] = useState(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Filter tasks
  const displayTasks = useMemo(() => {
    return filteredTasks.filter((task) => {
      const matchSearch =
        task.customerName.toLowerCase().includes(search.toLowerCase()) ||
        task.loanId.toLowerCase().includes(search.toLowerCase()) ||
        task.assignedExecutiveName.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [filteredTasks, search, statusFilter, priorityFilter]);

  // Kanban columns definition
  const kanbanColumns = [
    { id: 'Pending', label: 'Pending Visits', color: 'border-amber-300' },
    { id: 'In Progress', label: 'In Progress / Reached', color: 'border-blue-300' },
    { id: 'Collected', label: 'Payment Collected', color: 'border-emerald-300' },
    { id: 'Escalated', label: 'Escalated / Rescheduled', color: 'border-rose-300' },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              {currentRole === ROLES.EXECUTIVE ? 'My Field Task Allocations' : 'Task Dispatcher & Allocation Board'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {displayTasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Manage EMI collection visits, track customer dispositions, and review real-time settlements
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Route Map Preview */}
          <button
            onClick={() => setIsRouteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Route Map</span>
          </button>

          {/* Dispatch Task (Only for Admin & TL) */}
          {currentRole !== ROLES.EXECUTIVE && (
            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dispatch Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by customer, loan ID, or agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Collected">Collected</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Customer Unavailable">Customer Unavailable</option>
            <option value="Escalated">Escalated</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Render View: Table or Kanban */}
      {viewMode === 'table' ? (
        /* Data Table View */
        <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer & Loan</th>
                  <th className="py-3 px-4">Amount Due</th>
                  <th className="py-3 px-4">DPD & Priority</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4">Scheduled Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayTasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No field tasks matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  displayTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Customer & Loan */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {task.customerName}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                            <span>{task.loanId}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{task.loanType}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-xs font-medium">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {task.address}
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-extrabold text-slate-900 text-sm">
                          ₹{task.emiAmountDue.toLocaleString('en-IN')}
                        </div>
                        {task.amountCollected > 0 && (
                          <div className="text-[11px] text-emerald-600 font-bold font-mono">
                            Collected: ₹{task.amountCollected.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Overdue */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <Badge variant={task.overdueSeverity} size="xs">
                            {task.overdueDays} DPD
                          </Badge>
                          <div>
                            <Badge variant={task.priority} size="xs">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </td>

                      {/* Agent */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{task.assignedExecutiveName}</div>
                        <div className="text-[11px] text-slate-500">{task.zoneName.split('-')[0]}</div>
                      </td>

                      {/* Slot */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.scheduledTime}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={task.status} size="xs">
                          {task.status}
                        </Badge>
                        {task.amountCollected > 0 && !task.settlementApproved && (
                          <span className="block mt-1 text-[10px] text-amber-700 font-bold font-mono">
                            Awaiting TL Approval
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${task.customerPhone}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title={`Call ${task.customerName}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={`https://wa.me/${task.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                            title={`WhatsApp ${task.customerName}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => setSelectedTaskForStatus(task)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                          >
                            Status
                          </button>

                          <button
                            onClick={() => setSelectedTaskForPayment(task)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                              task.status === 'Collected'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            }`}
                          >
                            {task.status === 'Collected' ? 'Receipt' : 'Collect'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const columnTasks = displayTasks.filter((t) => {
              if (col.id === 'Escalated') {
                return (
                  t.status === 'Escalated' ||
                  t.status === 'Rescheduled' ||
                  t.status === 'Customer Unavailable'
                );
              }
              return t.status === col.id;
            });

            return (
              <div
                key={col.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{col.label}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-mono font-bold">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {columnTasks.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400">No items</div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
                            {task.loanId}
                          </span>
                          <Badge variant={task.overdueSeverity} size="xs">
                            {task.overdueDays} DPD
                          </Badge>
                        </div>

                        <div>
                          <h5 className="font-bold text-xs text-slate-900">{task.customerName}</h5>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{task.address}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">EMI Due</span>
                            <span className="text-xs font-bold font-mono text-blue-600">
                              ₹{task.emiAmountDue.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedTaskForPayment(task)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          >
                            {task.status === 'Collected' ? 'Receipt' : 'Collect'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CollectPaymentModal
        task={selectedTaskForPayment}
        isOpen={!!selectedTaskForPayment}
        onClose={() => setSelectedTaskForPayment(null)}
      />

      <TaskStatusModal
        task={selectedTaskForStatus}
        isOpen={!!selectedTaskForStatus}
        onClose={() => setSelectedTaskForStatus(null)}
      />

      <RoutePreviewModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        tasks={displayTasks}
      />

      <DispatchTaskModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
      />
    </div>
  );
}
