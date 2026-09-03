import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_BLOCKS,
  INITIAL_HOUSES,
  INITIAL_RESIDENTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_EMPLOYEES,
  INITIAL_VISITORS,
  INITIAL_GATE_LOGS,
  INITIAL_TASKS,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS
} from '../data/initialData';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const DataStoreContext = createContext();

const DATA_STORAGE_PREFIX = 'dion_ventures_data_v2_';

export const DataStoreProvider = ({ children }) => {
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  // Helper to load or init from localStorage
  const loadState = (key, fallback) => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_PREFIX + key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(`Error loading ${key}`, e);
    }
    return fallback;
  };

  // State slices
  const [users, setUsers] = useState(() => loadState('users', INITIAL_USERS));
  const [blocks, setBlocks] = useState(() => loadState('blocks', INITIAL_BLOCKS));
  const [houses, setHouses] = useState(() => loadState('houses', INITIAL_HOUSES));
  const [residents, setResidents] = useState(() => loadState('residents', INITIAL_RESIDENTS));
  const [familyMembers, setFamilyMembers] = useState(() => loadState('family_members', INITIAL_FAMILY_MEMBERS));
  const [employees, setEmployees] = useState(() => loadState('employees', INITIAL_EMPLOYEES));
  const [visitors, setVisitors] = useState(() => loadState('visitors', INITIAL_VISITORS));
  const [gateLogs, setGateLogs] = useState(() => loadState('gate_logs', INITIAL_GATE_LOGS));
  const [tasks, setTasks] = useState(() => loadState('tasks', INITIAL_TASKS));
  const [payments, setPayments] = useState(() => loadState('payments', INITIAL_PAYMENTS));
  const [auditLogs, setAuditLogs] = useState(() => loadState('audit_logs', INITIAL_AUDIT_LOGS));
  const [settings, setSettings] = useState(() => loadState('settings', INITIAL_SETTINGS));
  const [backendConnected, setBackendConnected] = useState(false);

  // Initial fetch from PHP + PostgreSQL backend on mount
  useEffect(() => {
    async function syncFromBackend() {
      try {
        const health = await api.getHealth();
        if (health && health.status === 'online') {
          setBackendConnected(true);
          console.log('[Dion Backend] Connected to PHP + PostgreSQL Gateway:', health);

          const [uRes, bRes, hRes, rRes, fRes, eRes, vRes, gRes, tRes, pRes, sRes, aRes] = await Promise.allSettled([
            api.getUsers(),
            api.getBlocks(),
            api.getHouses(),
            api.getResidents(),
            api.getFamilyMembers(),
            api.getEmployees(),
            api.getVisitors(),
            api.getGateLogs(),
            api.getTasks(),
            api.getPayments(),
            api.getSettings(),
            api.getAuditLogs()
          ]);

          if (uRes.status === 'fulfilled' && uRes.value.data) setUsers(uRes.value.data);
          if (bRes.status === 'fulfilled' && bRes.value.data) setBlocks(bRes.value.data);
          if (hRes.status === 'fulfilled' && hRes.value.data) setHouses(hRes.value.data);
          if (rRes.status === 'fulfilled' && rRes.value.data) setResidents(rRes.value.data);
          if (fRes.status === 'fulfilled' && fRes.value.data) setFamilyMembers(fRes.value.data);
          if (eRes.status === 'fulfilled' && eRes.value.data) setEmployees(eRes.value.data);
          if (vRes.status === 'fulfilled' && vRes.value.data) setVisitors(vRes.value.data);
          if (gRes.status === 'fulfilled' && gRes.value.data) setGateLogs(gRes.value.data);
          if (tRes.status === 'fulfilled' && tRes.value.data) setTasks(tRes.value.data);
          if (pRes.status === 'fulfilled' && pRes.value.data) setPayments(pRes.value.data);
          if (sRes.status === 'fulfilled' && sRes.value.data) setSettings(sRes.value.data);
          if (aRes.status === 'fulfilled' && aRes.value.data) setAuditLogs(aRes.value.data);
        }
      } catch (err) {
        console.log('[Dion Backend] Running in resilient offline mode with local storage persistence.');
        setBackendConnected(false);
      }
    }

    syncFromBackend();
  }, []);

  // Local storage persistence effects
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'blocks', JSON.stringify(blocks)); }, [blocks]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'houses', JSON.stringify(houses)); }, [houses]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'residents', JSON.stringify(residents)); }, [residents]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'family_members', JSON.stringify(familyMembers)); }, [familyMembers]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'visitors', JSON.stringify(visitors)); }, [visitors]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'gate_logs', JSON.stringify(gateLogs)); }, [gateLogs]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(DATA_STORAGE_PREFIX + 'settings', JSON.stringify(settings)); }, [settings]);

  // Record an audit entry
  const recordAudit = async (action, details) => {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: currentUser ? `${currentUser.name} (${currentUser.roleLabel || currentUser.role})` : 'System Operator',
      action,
      details,
      ip: '10.0.1.44 (Active Session)'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    try {
      await api.recordAudit({ actor: newLog.actor, action, details });
    } catch (e) {
      // Graceful fallback
    }
  };

  // 1. VISITOR MUTATIONS
  const registerVisitor = async (visitorData) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newId = `VIS-${Math.floor(9090 + Math.random() * 900)}`;
    const newBadge = visitorData.category.startsWith('Cab') ? `C-${Math.floor(200 + Math.random() * 800)}`
      : visitorData.category.startsWith('Delivery') || visitorData.category.startsWith('Food') ? `D-${Math.floor(500 + Math.random() * 400)}`
      : `G-${Math.floor(100 + Math.random() * 900)}`;

    const newVisitor = {
      id: newId,
      name: visitorData.name,
      avatar: visitorData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'VI',
      phone: visitorData.phone || '+91 98000 00000',
      category: visitorData.category || 'Guest / Family',
      hostResident: visitorData.hostResident || 'Resident',
      hostUnit: visitorData.hostUnit || 'A-101',
      vehicleNumber: visitorData.vehicleNumber || 'Walk-in',
      purpose: visitorData.purpose || 'General Visit',
      gate: visitorData.gate || 'Gate 01',
      guardId: currentUser?.id || 'GRD-1044',
      entryTime: timeString,
      exitTime: '—',
      duration: 'Just now',
      badgeNumber: newBadge,
      status: 'inside',
      preApproved: !!visitorData.preApproved
    };

    setVisitors(prev => [newVisitor, ...prev]);

    const newGateLog = {
      id: `LOG-${Math.floor(8900 + Math.random() * 1000)}`,
      timestamp: timeString,
      type: 'ENTRY',
      person: newVisitor.name,
      category: newVisitor.category,
      destination: newVisitor.hostUnit,
      vehicle: newVisitor.vehicleNumber,
      gate: newVisitor.gate,
      guard: currentUser?.name || 'Officer C. Miller',
      status: 'Cleared'
    };
    setGateLogs(prev => [newGateLog, ...prev]);

    recordAudit('VISITOR_CHECKIN', `Authorized entry for ${newVisitor.name} (${newVisitor.category}) to Unit ${newVisitor.hostUnit}. Pass #${newBadge}.`);
    addToast(`Visitor entry recorded. Digital badge #${newBadge} generated!`, 'success');

    // Async backend persist
    try {
      const res = await api.registerVisitor({
        name: newVisitor.name,
        phone: newVisitor.phone,
        category: newVisitor.category,
        hostResident: newVisitor.hostResident,
        hostUnit: newVisitor.hostUnit,
        vehicleNumber: newVisitor.vehicleNumber,
        purpose: newVisitor.purpose,
        gate: newVisitor.gate,
        guardId: newVisitor.guardId,
        preApproved: newVisitor.preApproved
      });
      if (res && res.data) {
        setVisitors(prev => prev.map(v => v.id === newVisitor.id ? { ...v, ...res.data } : v));
      }
    } catch (e) {
      // Kept in optimistic local state
    }

    return newVisitor;
  };

  const checkoutVisitor = async (visitorId, exitGate = 'Gate 01') => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let checkedOutVisitor = null;

    setVisitors(prev => prev.map(v => {
      if (v.id === visitorId) {
        checkedOutVisitor = v;
        return {
          ...v,
          status: 'exited',
          exitTime: timeString
        };
      }
      return v;
    }));

    if (checkedOutVisitor) {
      const exitLog = {
        id: `LOG-${Math.floor(8900 + Math.random() * 1000)}`,
        timestamp: timeString,
        type: 'EXIT',
        person: checkedOutVisitor.name,
        category: checkedOutVisitor.category,
        destination: checkedOutVisitor.hostUnit,
        vehicle: checkedOutVisitor.vehicleNumber,
        gate: exitGate,
        guard: currentUser?.name || 'Officer C. Miller',
        status: 'Pass Returned'
      };
      setGateLogs(prev => [exitLog, ...prev]);

      recordAudit('VISITOR_CHECKOUT', `Visitor ${checkedOutVisitor.name} checked out at ${exitGate}. Badge #${checkedOutVisitor.badgeNumber} surrendered.`);
      addToast(`Visitor ${checkedOutVisitor.name} checked out. Badge #${checkedOutVisitor.badgeNumber} surrendered.`, 'info');

      try {
        await api.checkoutVisitor(visitorId);
      } catch (e) {
        // Kept in optimistic local state
      }
    }
  };

  // 2. WORKFORCE & ATTENDANCE MUTATIONS
  const updateWorkerAttendance = async (workerId, newStatus) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedWorker = null;

    setEmployees(prev => prev.map(emp => {
      if (emp.id === workerId || emp.badgeNo === workerId) {
        const currAtt = emp.todayAttendance || {};
        const inTime = (newStatus === 'absent' || newStatus === 'leave') ? '—' : (currAtt.inTime || timeString);
        updatedWorker = {
          ...emp,
          status: newStatus,
          todayAttendance: {
            ...currAtt,
            status: newStatus,
            inTime
          }
        };
        return updatedWorker;
      }
      return emp;
    }));

    if (updatedWorker) {
      recordAudit('ATTENDANCE_UPDATED', `Muster status for ${updatedWorker.name} (${updatedWorker.badgeNo}) updated to ${newStatus.toUpperCase()}`);
      addToast(`Attendance for ${updatedWorker.name} updated to ${newStatus}.`, 'success');

      try {
        await api.updateAttendance(workerId, newStatus);
      } catch (e) {
        // Fallback
      }
    }
  };

  const checkoutWorker = async (workerId) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedWorker = null;

    setEmployees(prev => prev.map(emp => {
      if (emp.id === workerId || emp.badgeNo === workerId) {
        updatedWorker = {
          ...emp,
          todayAttendance: {
            ...(emp.todayAttendance || {}),
            outTime: timeString
          }
        };
        return updatedWorker;
      }
      return emp;
    }));

    if (updatedWorker) {
      recordAudit('WORKER_CHECKOUT', `Worker ${updatedWorker.name} (${updatedWorker.badgeNo}) clocked out of shift at ${timeString}`);
      addToast(`Shift checkout recorded for ${updatedWorker.name}.`, 'info');

      try {
        await api.checkoutWorker(workerId);
      } catch (e) {
        // Fallback
      }
    }
  };

  // 3. TASK MUTATIONS
  const createTask = async (taskData) => {
    const newId = `TSK-${Math.floor(886 + Math.random() * 100)}`;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let assignedEmp = employees.find(e => e.id === taskData.assignedToId) || { name: 'Assigned Worker', role: 'Duty Officer' };

    const newTask = {
      id: newId,
      title: taskData.title,
      description: taskData.description || 'Task dispatched via supervisor console.',
      category: taskData.category || 'Facilities & Engineering',
      priority: taskData.priority || 'medium',
      assignedToId: taskData.assignedToId || 'WRK-1002',
      assignedToName: assignedEmp.name,
      assignedRole: assignedEmp.role,
      location: taskData.location || 'Estate Perimeter',
      dueDate: taskData.dueDate || 'Today, 05:00 PM',
      createdAt: timeString,
      completedAt: null,
      verifiedBy: null,
      status: 'assigned',
      remarks: []
    };

    setTasks(prev => [newTask, ...prev]);
    recordAudit('TASK_CREATED', `Created work order ${newId}: "${newTask.title}" assigned to ${newTask.assignedToName}`);
    addToast(`Task ${newId} dispatched to ${newTask.assignedToName}.`, 'success');

    try {
      const res = await api.createTask({
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        assignedToId: newTask.assignedToId,
        location: newTask.location,
        dueDate: newTask.dueDate
      });
      if (res && res.data) {
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, ...res.data } : t));
      }
    } catch (e) {
      // Fallback
    }

    return newTask;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isCompleted = newStatus === 'completed' || newStatus === 'verified';
        return {
          ...t,
          status: newStatus,
          completedAt: isCompleted ? (t.completedAt || timeString) : t.completedAt,
          verifiedBy: newStatus === 'verified' ? (currentUser?.name || 'Inspector R. Thorne') : t.verifiedBy
        };
      }
      return t;
    }));

    recordAudit('TASK_STATUS_UPDATED', `Task ${taskId} moved to ${newStatus.toUpperCase()}`);
    addToast(`Task ${taskId} status updated to ${newStatus}.`, 'info');

    try {
      await api.updateTaskStatus(taskId, newStatus);
    } catch (e) {
      // Fallback
    }
  };

  const addTaskRemark = async (taskId, remarkText) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const author = currentUser ? `${currentUser.name} (${currentUser.roleLabel || currentUser.role})` : 'Supervisor';

    const remarkObj = {
      author,
      time: timeString,
      text: remarkText
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          remarks: [...(t.remarks || []), remarkObj]
        };
      }
      return t;
    }));

    recordAudit('TASK_REMARK_ADDED', `Remark added to ${taskId}: "${remarkText.substring(0, 40)}..."`);
    addToast('Remark posted to work order timeline.', 'success');

    try {
      await api.addTaskRemark(taskId, { author, text: remarkText });
    } catch (e) {
      // Fallback
    }
  };

  // 4. FINANCIAL MUTATIONS
  const addPayment = async (paymentData) => {
    const newId = `PAY-${Math.floor(905 + Math.random() * 90)}`;
    const refNo = `VCH-${new Date().getFullYear()}-${Math.floor(900 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const newPayment = {
      id: newId,
      referenceNo: refNo,
      employeeId: paymentData.employeeId || 'WRK-1001',
      employeeName: paymentData.employeeName || 'Workforce Staff',
      amount: parseFloat(paymentData.amount) || 0,
      type: paymentData.type || 'Monthly Salary',
      mode: paymentData.mode || 'NEFT / Direct Bank',
      paymentDate: dateStr,
      status: 'paid',
      remarks: paymentData.remarks || 'Wage settlement processed'
    };

    setPayments(prev => [newPayment, ...prev]);
    recordAudit('PAYMENT_DISBURSED', `Disbursed ₹${newPayment.amount.toLocaleString()} (${newPayment.type}) to ${newPayment.employeeName}. Ref #${refNo}.`);
    addToast(`Payment voucher #${refNo} issued successfully.`, 'success');

    try {
      await api.createPayment(paymentData);
    } catch (e) {
      // Fallback
    }

    return newPayment;
  };

  // 5. INFRASTRUCTURE & SETTINGS
  const updateBlock = async (blockId, blockData) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...blockData } : b));
    recordAudit('BLOCK_UPDATED', `Updated block configuration for ${blockId}`);
    try {
      await api.updateBlock(blockId, blockData);
    } catch (e) {}
  };

  const updateHouse = async (houseId, houseData) => {
    setHouses(prev => prev.map(h => (h.id === houseId || h.unitNumber === houseId) ? { ...h, ...houseData } : h));
    recordAudit('HOUSE_UPDATED', `Updated unit configuration for ${houseId}`);
    try {
      await api.updateHouse(houseId, houseData);
    } catch (e) {}
  };

  const triggerPanicAlert = async (location = 'Sector 4 Main Gate') => {
    recordAudit('PANIC_ALARM_TRIGGERED', `EMERGENCY PANIC TRIGGERED at ${location}! High-priority audio sirens engaged.`);
    addToast(`EMERGENCY PROTOCOL ACTIVATED: Perimeter gates sealed and local police alerted!`, 'error');
    try {
      await api.triggerPanic({ location });
    } catch (e) {}
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    recordAudit('SETTINGS_SAVED', 'Updated estate security and perimeter parameters.');
    addToast('Estate parameters saved.', 'success');
    try {
      await api.updateSettings(newSettings);
    } catch (e) {}
  };

  const createResident = async (residentData) => {
    const newId = `RES-${Math.floor(100 + Math.random() * 900)}`;
    const newRfid = `RFID-${Math.floor(50000 + Math.random() * 49999)}`;
    const avatar = residentData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'RE';
    const blockName = `Block ${residentData.unitNumber ? residentData.unitNumber.charAt(0) : 'A'}`;

    const newRes = {
      id: newId,
      name: residentData.name,
      unitNumber: residentData.unitNumber,
      blockName: blockName,
      category: residentData.category || 'Owner',
      phone: residentData.phone || '+91 98000 00000',
      email: residentData.email || 'resident@example.com',
      since: residentData.since || 'Jan 2024',
      status: 'active',
      rfidTag: newRfid,
      familyCount: residentData.familyCount || 1,
      vehicles: residentData.vehicles || [],
      avatar
    };

    setResidents(prev => [newRes, ...prev]);
    recordAudit('RESIDENT_ONBOARDED', `Resident ${newRes.name} registered for Unit ${newRes.unitNumber}`);
    addToast(`Resident ${newRes.name} registered successfully.`, 'success');

    try {
      const res = await api.createResident(newRes);
      if (res && res.data) {
        setResidents(prev => prev.map(r => r.id === newRes.id ? { ...r, ...res.data } : r));
      }
    } catch (e) {}

    return newRes;
  };

  const createFamilyMember = async (memberData) => {
    const newId = `FAM-${Math.floor(100 + Math.random() * 900)}`;
    const newRfid = `RFID-${Math.floor(50000 + Math.random() * 49999)}-D`;

    const newFam = {
      id: newId,
      residentId: memberData.residentId || 'RES-001',
      residentName: memberData.residentName || 'Resident Host',
      unitNumber: memberData.unitNumber || 'A-101',
      name: memberData.name,
      relation: memberData.relation || 'Dependent',
      phone: memberData.phone || '+91 98000 00000',
      rfidTag: newRfid,
      status: 'active'
    };

    setFamilyMembers(prev => [newFam, ...prev]);
    recordAudit('FAMILY_MEMBER_ADDED', `Added family dependent ${newFam.name} (${newFam.relation}) for Unit ${newFam.unitNumber}`);
    addToast(`Family member ${newFam.name} registered.`, 'success');

    try {
      const res = await api.createFamilyMember(newFam);
      if (res && res.data) {
        setFamilyMembers(prev => prev.map(f => f.id === newFam.id ? { ...f, ...res.data } : f));
      }
    } catch (e) {}

    return newFam;
  };

  const enrolEmployee = async (employeeData) => {
    const newId = `WRK-${Math.floor(1020 + Math.random() * 8900)}`;
    const badgeNo = `DION-E${Math.floor(200 + Math.random() * 800)}`;
    const avatar = employeeData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'WR';

    const newEmp = {
      id: newId,
      name: employeeData.name,
      badgeNo,
      role: employeeData.role || 'Patrol Officer',
      department: employeeData.department || 'Security & Surveillance',
      shift: employeeData.shift || 'Morning (06:00 - 14:00)',
      assignedLocation: employeeData.assignedLocation || 'Main Gate 01',
      status: 'present',
      dailyWage: parseFloat(employeeData.dailyWage) || 850,
      monthlyWage: parseFloat(employeeData.monthlyWage) || 22100,
      phone: employeeData.phone || '+91 98000 00000',
      aadhaar: employeeData.aadhaar || 'XXXX-XXXX-9999',
      rating: 5.0,
      tasksCompleted: 0,
      joiningDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      avatar,
      todayAttendance: {
        inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        outTime: '—',
        gate: 'Gate 01',
        status: 'present'
      }
    };

    setEmployees(prev => [newEmp, ...prev]);
    recordAudit('EMPLOYEE_ENROLLED', `New workforce staff enrolled: ${newEmp.name} (${newEmp.badgeNo}) - ${newEmp.role}`);
    addToast(`Employee ${newEmp.name} enrolled with Badge #${badgeNo}.`, 'success');

    try {
      const res = await api.enrolEmployee(newEmp);
      if (res && res.data) {
        setEmployees(prev => prev.map(e => e.id === newEmp.id ? { ...e, ...res.data } : e));
      }
    } catch (e) {}

    return newEmp;
  };

  const value = {
    users,
    blocks,
    houses,
    residents,
    familyMembers,
    employees,
    visitors,
    gateLogs,
    tasks,
    payments,
    auditLogs,
    settings,
    backendConnected,
    registerVisitor,
    checkoutVisitor,
    updateWorkerAttendance,
    checkoutWorker,
    createTask,
    updateTaskStatus,
    addTaskRemark,
    addPayment,
    updateBlock,
    updateHouse,
    triggerPanicAlert,
    updateSettings,
    createResident,
    createFamilyMember,
    enrolEmployee,
    recordAudit
  };

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
};
