import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ROLES,
  ZONES,
  TEAM_LEADERS,
  FIELD_EXECUTIVES,
  INITIAL_TASKS,
  INITIAL_LEADS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // RBAC State
  const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);
  const [selectedZone, setSelectedZone] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Search & Dialogs
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Entities State
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [fieldExecutives, setFieldExecutives] = useState(FIELD_EXECUTIVES);
  const [teamLeaders] = useState(TEAM_LEADERS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Shift & Punch In State for Field Executive Demo
  const [executiveShift, setExecutiveShift] = useState({
    isPunchedIn: true,
    punchInTime: '08:45 AM',
    gpsLocked: true,
    currentLocation: 'Connaught Place Block B, Delhi',
    battery: '88%',
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Current logged in user info depending on Role
  const currentUser = useMemo(() => {
    if (currentRole === ROLES.ADMIN) {
      return {
        id: 'ADM-001',
        name: 'Arvind Singhal',
        role: ROLES.ADMIN,
        title: 'Chief Operations & Risk Head',
        email: 'arvind.singhal@finflow.io',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        badge: 'Super Admin',
      };
    }
    if (currentRole === ROLES.TEAM_LEADER) {
      return {
        id: 'TL-101',
        name: 'Rajesh Sharma',
        role: ROLES.TEAM_LEADER,
        title: 'North Zone Team Leader',
        email: 'rajesh.sharma@finflow.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        badge: 'Zone Lead',
        zoneId: 'north-metro',
      };
    }
    // Field Executive (default: Rahul Verma)
    return {
      id: 'AGT-001',
      name: 'Rahul Verma',
      role: ROLES.EXECUTIVE,
      title: 'Senior Field Recovery Officer',
      email: 'rahul.verma@finflow.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      badge: 'Field Exec',
      zoneId: 'north-metro',
    };
  }, [currentRole]);

  // Role Switcher helper
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    addToast(`Switched view to ${newRole} mode`, 'info');
  };

  // Helper to add audit log
  const logAction = (action, details, severity = 'info', loanId = 'N/A') => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      action,
      user: `${currentUser.name} (${currentUser.id})`,
      role: currentRole,
      loanId,
      details,
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Collect Payment Action
  const collectPayment = (taskId, { amount, paymentMode, notes, proofPhoto }) => {
    const numAmount = Number(amount);
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedTaskObj = null;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isFull = numAmount >= t.emiAmountDue;
          const status = isFull ? 'Collected' : 'In Progress';
          const updated = {
            ...t,
            amountCollected: (t.amountCollected || 0) + numAmount,
            status,
            paymentMode,
            receiptNo,
            collectedAt: nowTime,
            notes: notes ? `${t.notes ? t.notes + ' | ' : ''}${notes}` : t.notes,
            settlementApproved: currentRole === ROLES.ADMIN || currentRole === ROLES.TEAM_LEADER,
            proofPhoto: proofPhoto || null,
          };
          updatedTaskObj = updated;
          return updated;
        }
        return t;
      })
    );

    // Update Executive metrics
    setFieldExecutives((prev) =>
      prev.map((exec) => {
        if (exec.id === (updatedTaskObj?.assignedExecutiveId || currentUser.id)) {
          return {
            ...exec,
            dailyCollected: exec.dailyCollected + numAmount,
            completedTasksCount: exec.completedTasksCount + 1,
            activeTasksCount: Math.max(0, exec.activeTasksCount - 1),
          };
        }
        return exec;
      })
    );

    logAction(
      'Payment Collected',
      `Collected ₹${numAmount.toLocaleString('en-IN')} via ${paymentMode}. Receipt #${receiptNo} generated.`,
      'success',
      updatedTaskObj?.loanId || 'N/A'
    );

    addToast(`Payment of ₹${numAmount.toLocaleString('en-IN')} successfully logged! Receipt #${receiptNo}`, 'success');

    // Add notification
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'Payment Recorded',
      message: `${currentUser.name} collected ₹${numAmount.toLocaleString('en-IN')} (${paymentMode}) for ${updatedTaskObj?.customerName || 'customer'}.`,
      time: 'Just now',
      read: false,
      type: 'success',
      linkTab: 'collections',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { receiptNo, task: updatedTaskObj };
  };

  // Update Task Status (e.g. Rescheduled, Customer Unavailable, Escalated)
  const updateTaskStatus = (taskId, { status, notes, rescheduleDate, priority }) => {
    let taskName = '';
    let loanId = '';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          taskName = t.customerName;
          loanId = t.loanId;
          return {
            ...t,
            status,
            priority: priority || t.priority,
            notes: notes ? `${notes} (Updated on ${new Date().toLocaleDateString()})` : t.notes,
            rescheduledDate: rescheduleDate || t.rescheduledDate,
          };
        }
        return t;
      })
    );

    const severityMap = {
      'Escalated': 'danger',
      'Customer Unavailable': 'warning',
      'Rescheduled': 'warning',
      'Collected': 'success',
    };

    logAction(
      `Task Status -> ${status}`,
      `Task for ${taskName} updated to status "${status}". Note: ${notes || 'No note added'}`,
      severityMap[status] || 'info',
      loanId
    );

    addToast(`Task for ${taskName} updated to ${status}`, 'info');
  };

  // Approve Settlement (TL or Admin)
  const approveSettlement = (taskId) => {
    let target = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          target = t;
          return { ...t, settlementApproved: true };
        }
        return t;
      })
    );

    if (target) {
      logAction(
        'Settlement Approved',
        `Approved collection settlement of ₹${(target.amountCollected || target.emiAmountDue).toLocaleString('en-IN')} for ${target.customerName}.`,
        'success',
        target.loanId
      );
      addToast(`Settlement approved for Loan ${target.loanId} (${target.customerName})`, 'success');
    }
  };

  // Reject Settlement
  const rejectSettlement = (taskId, reason = 'Requires physical receipt verification') => {
    let target = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          target = t;
          return { ...t, settlementApproved: false, status: 'In Progress', notes: `${t.notes || ''} [Settlement Rejected: ${reason}]` };
        }
        return t;
      })
    );

    if (target) {
      logAction(
        'Settlement Rejected',
        `Rejected settlement for ${target.customerName} (${target.loanId}). Reason: ${reason}`,
        'danger',
        target.loanId
      );
      addToast(`Settlement rejected for ${target.loanId}`, 'warning');
    }
  };

  // Dispatch / Create Task
  const dispatchTask = (taskPayload) => {
    const newTask = {
      id: `TSK-${Math.floor(2000 + Math.random() * 8000)}`,
      status: 'Pending',
      amountCollected: 0,
      settlementApproved: false,
      lastContactDate: new Date().toISOString().split('T')[0],
      ...taskPayload,
    };

    setTasks((prev) => [newTask, ...prev]);

    // Update assigned executive count
    setFieldExecutives((prev) =>
      prev.map((e) =>
        e.id === taskPayload.assignedExecutiveId
          ? { ...e, activeTasksCount: e.activeTasksCount + 1 }
          : e
      )
    );

    logAction(
      'Task Dispatched',
      `New task ${newTask.id} assigned to ${taskPayload.assignedExecutiveName} for customer ${taskPayload.customerName}.`,
      'info',
      taskPayload.loanId
    );

    addToast(`Task dispatched to ${taskPayload.assignedExecutiveName}`, 'success');
  };

  // Update Lead Stage
  const updateLeadStage = (leadId, newStage) => {
    let leadObj = null;
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          leadObj = l;
          return { ...l, stage: newStage };
        }
        return l;
      })
    );

    if (leadObj) {
      logAction(
        `Lead Stage -> ${newStage}`,
        `Lead ${leadObj.id} (${leadObj.customerName}) moved to "${newStage}" stage.`,
        newStage === 'Approved' ? 'success' : newStage === 'Rejected' ? 'danger' : 'info',
        leadObj.id
      );
      addToast(`Lead stage updated to ${newStage}`, 'info');
    }
  };

  // Toggle KYC Document Item
  const toggleKycDoc = (leadId, docKey) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updatedChecklist = {
            ...l.documentChecklist,
            [docKey]: !l.documentChecklist[docKey],
          };
          return {
            ...l,
            documentChecklist: updatedChecklist,
          };
        }
        return l;
      })
    );
  };

  // Assign Lead to Agent
  const assignLead = (leadId, agentId) => {
    const agent = fieldExecutives.find((e) => e.id === agentId);
    let customer = '';
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          customer = l.customerName;
          return {
            ...l,
            assignedExecutiveId: agentId,
            assignedExecutiveName: agent ? agent.name : 'Assigned',
            stage: l.stage === 'New Enquiry' ? 'Customer Visit' : l.stage,
          };
        }
        return l;
      })
    );

    if (agent) {
      setFieldExecutives((prev) =>
        prev.map((e) =>
          e.id === agentId ? { ...e, pendingLeadsCount: e.pendingLeadsCount + 1 } : e
        )
      );
    }

    logAction(
      'Lead Assigned',
      `Assigned lead for ${customer} to field agent ${agent?.name || agentId}.`,
      'info',
      leadId
    );

    addToast(`Lead assigned to ${agent?.name}`, 'success');
  };

  // Add New Lead
  const addNewLead = (newLeadData) => {
    const id = `LEAD-${Math.floor(600 + Math.random() * 400)}`;
    const fullLead = {
      id,
      stage: 'New Enquiry',
      createdAt: new Date().toISOString().split('T')[0],
      documentChecklist: {
        aadhaar: false,
        pan: false,
        bankStatement: false,
        addressProof: false,
        businessProof: false,
        guarantorConsent: false,
      },
      ...newLeadData,
    };

    setLeads((prev) => [fullLead, ...prev]);

    logAction('New Lead Created', `Enquiry created for ${newLeadData.customerName} (₹${Number(newLeadData.requestedAmount).toLocaleString('en-IN')})`, 'info', id);
    addToast(`New lead #${id} successfully created!`, 'success');
  };

  // Punch In / Out Toggle for Field Agent
  const togglePunchIn = () => {
    setExecutiveShift((prev) => {
      const nextState = !prev.isPunchedIn;
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (nextState) {
        addToast(`Punched in at ${nowTime}. GPS live tracking enabled.`, 'success');
        logAction('Executive Punch In', `Shift started by ${currentUser.name} at ${nowTime}`, 'info');
        return {
          ...prev,
          isPunchedIn: true,
          punchInTime: nowTime,
          gpsLocked: true,
        };
      } else {
        addToast(`Punched out at ${nowTime}. Shift closed.`, 'info');
        logAction('Executive Punch Out', `Shift closed by ${currentUser.name} at ${nowTime}`, 'warning');
        return {
          ...prev,
          isPunchedIn: false,
          gpsLocked: false,
        };
      }
    });
  };

  // Mark notification read
  const markNotificationRead = (notifId) => {
    if (notifId === 'all') {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    }
  };

  // Filtered views based on selectedZone and currentRole
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    // If Executive role, show tasks for that executive by default (or allow viewing others if filtered)
    if (currentRole === ROLES.EXECUTIVE) {
      result = result.filter((t) => t.assignedExecutiveId === currentUser.id);
    } else if (currentRole === ROLES.TEAM_LEADER) {
      // TL oversees their assigned executives
      const tl = teamLeaders.find((tl) => tl.id === currentUser.id) || teamLeaders[0];
      result = result.filter((t) => tl.assignedExecutiveIds.includes(t.assignedExecutiveId));
    }

    if (selectedZone !== 'all') {
      result = result.filter((t) => t.zoneId === selectedZone);
    }

    return result;
  }, [tasks, currentRole, currentUser.id, selectedZone, teamLeaders]);

  const filteredLeads = useMemo(() => {
    let result = [...leads];
    if (currentRole === ROLES.EXECUTIVE) {
      result = result.filter((l) => l.assignedExecutiveId === currentUser.id);
    } else if (currentRole === ROLES.TEAM_LEADER) {
      const tl = teamLeaders.find((tl) => tl.id === currentUser.id) || teamLeaders[0];
      result = result.filter(
        (l) => !l.assignedExecutiveId || tl.assignedExecutiveIds.includes(l.assignedExecutiveId)
      );
    }

    if (selectedZone !== 'all') {
      result = result.filter((l) => l.zoneId === selectedZone);
    }

    return result;
  }, [leads, currentRole, currentUser.id, selectedZone, teamLeaders]);

  const filteredExecutives = useMemo(() => {
    let result = [...fieldExecutives];
    if (currentRole === ROLES.TEAM_LEADER) {
      const tl = teamLeaders.find((tl) => tl.id === currentUser.id) || teamLeaders[0];
      result = result.filter((e) => tl.assignedExecutiveIds.includes(e.id));
    }
    if (selectedZone !== 'all') {
      result = result.filter((e) => e.zoneId === selectedZone);
    }
    return result;
  }, [fieldExecutives, currentRole, currentUser.id, selectedZone, teamLeaders]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCollectedToday = tasks.reduce((sum, t) => sum + (t.amountCollected || 0), 0);
    const totalDueToday = tasks.reduce((sum, t) => sum + (t.emiAmountDue || 0), 0);
    const totalOverdue = tasks
      .filter((t) => t.overdueDays > 0 && t.status !== 'Collected')
      .reduce((sum, t) => sum + t.emiAmountDue, 0);
    const openTasksCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
    const pendingApprovalsCount = tasks.filter((t) => t.amountCollected > 0 && !t.settlementApproved).length;
    const criticalOverdueCount = tasks.filter((t) => t.overdueSeverity === 'Critical' && t.status !== 'Collected').length;
    const totalLeadsCount = leads.length;
    const approvedLeadsCount = leads.filter((l) => l.stage === 'Approved').length;
    const leadConversionRate = totalLeadsCount > 0 ? Math.round((approvedLeadsCount / totalLeadsCount) * 100) : 0;

    return {
      totalCollectedToday,
      totalDueToday,
      totalOverdue,
      openTasksCount,
      pendingApprovalsCount,
      criticalOverdueCount,
      totalLeadsCount,
      leadConversionRate,
    };
  }, [tasks, leads]);

  return (
    <AppContext.Provider
      value={{
        // Role & Auth
        currentRole,
        currentUser,
        switchRole,
        ROLES,
        ZONES,
        selectedZone,
        setSelectedZone,

        // Navigation
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,

        // Search & Notifications
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        notifications,
        markNotificationRead,

        // Data & Lists
        tasks,
        filteredTasks,
        leads,
        filteredLeads,
        fieldExecutives,
        filteredExecutives,
        teamLeaders,
        auditLogs,
        metrics,

        // Operations
        collectPayment,
        updateTaskStatus,
        approveSettlement,
        rejectSettlement,
        dispatchTask,
        updateLeadStage,
        toggleKycDoc,
        assignLead,
        addNewLead,

        // Executive Shift
        executiveShift,
        togglePunchIn,

        // Toasts
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
