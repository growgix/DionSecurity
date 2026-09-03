-- ==============================================================================
-- DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
-- SQLite Relational Database Schema
-- ==============================================================================

DROP TABLE IF EXISTS task_remarks;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS gate_logs;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS family_members;
DROP TABLE IF EXISTS residents;
DROP TABLE IF EXISTS houses;
DROP TABLE IF EXISTS blocks;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;

-- 1. SYSTEM USERS & ROLE-BASED ACCESS
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT DEFAULT '$2y$10$abcdefghijklmnopqrstuv',
    role TEXT NOT NULL CHECK (role IN ('admin', 'guard', 'supervisor')),
    station TEXT NOT NULL DEFAULT 'Main Command Central',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TEXT DEFAULT 'Just now',
    avatar TEXT NOT NULL DEFAULT 'DV',
    phone TEXT NOT NULL DEFAULT '+91 22 4900 8800',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- 2. ESTATE BLOCKS
CREATE TABLE blocks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    floors INTEGER NOT NULL DEFAULT 8,
    total_units INTEGER NOT NULL DEFAULT 40,
    occupied_units INTEGER NOT NULL DEFAULT 36,
    security_officer TEXT NOT NULL DEFAULT 'Officer C. Miller',
    status TEXT NOT NULL DEFAULT 'Operational',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. HOUSING UNITS
CREATE TABLE houses (
    id TEXT PRIMARY KEY,
    unit_number TEXT UNIQUE NOT NULL,
    block_id TEXT REFERENCES blocks(id) ON DELETE SET NULL,
    block_name TEXT NOT NULL,
    floor TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT '3 BHK Luxury',
    resident_name TEXT NOT NULL DEFAULT '—',
    resident_phone TEXT NOT NULL DEFAULT '—',
    parking_slot TEXT NOT NULL DEFAULT 'P-A01',
    intercom TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'occupied' CHECK (status IN ('occupied', 'vacant', 'reserved', 'maintenance')),
    vehicles TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_houses_unit_number ON houses(unit_number);
CREATE INDEX idx_houses_block ON houses(block_name);
CREATE INDEX idx_houses_status ON houses(status);

-- 4. VERIFIED RESIDENTS
CREATE TABLE residents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit_number TEXT NOT NULL,
    block_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Owner' CHECK (category IN ('Owner', 'Tenant', 'Armed Forces / Institutional')),
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    since TEXT NOT NULL DEFAULT 'Jan 2022',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
    rfid_tag TEXT NOT NULL,
    family_count INTEGER NOT NULL DEFAULT 1,
    vehicles TEXT DEFAULT '[]',
    avatar TEXT NOT NULL DEFAULT 'RE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_residents_unit ON residents(unit_number);
CREATE INDEX idx_residents_rfid ON residents(rfid_tag);

-- 5. FAMILY MEMBERS & DEPENDENTS
CREATE TABLE family_members (
    id TEXT PRIMARY KEY,
    resident_id TEXT REFERENCES residents(id) ON DELETE CASCADE,
    resident_name TEXT NOT NULL,
    unit_number TEXT NOT NULL,
    name TEXT NOT NULL,
    relation TEXT NOT NULL,
    phone TEXT NOT NULL,
    rfid_tag TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_family_unit ON family_members(unit_number);

-- 6. WORKFORCE EMPLOYEES
CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    badge_no TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    shift TEXT NOT NULL,
    assigned_location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'leave', 'late')),
    daily_wage REAL NOT NULL DEFAULT 850.00,
    monthly_wage REAL NOT NULL DEFAULT 22000.00,
    phone TEXT NOT NULL DEFAULT '+91 98000 00000',
    aadhaar TEXT NOT NULL DEFAULT 'XXXX-XXXX-1234',
    rating REAL NOT NULL DEFAULT 4.8,
    tasks_completed INTEGER NOT NULL DEFAULT 42,
    joining_date TEXT NOT NULL DEFAULT 'Jan 15, 2024',
    avatar TEXT NOT NULL DEFAULT 'WR',
    today_attendance TEXT DEFAULT '{"inTime": "05:50 AM", "outTime": "—", "gate": "Gate 01", "status": "present"}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_badge ON employees(badge_no);
CREATE INDEX idx_employees_dept ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_shift ON employees(shift);

-- 7. VISITORS & PASSES
CREATE TABLE visitors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT 'VI',
    phone TEXT NOT NULL,
    category TEXT NOT NULL,
    host_resident TEXT NOT NULL,
    host_unit TEXT NOT NULL,
    vehicle_number TEXT NOT NULL DEFAULT 'Walk-in',
    purpose TEXT NOT NULL DEFAULT 'Personal Visit',
    gate TEXT NOT NULL DEFAULT 'Gate 01',
    guard_id TEXT NOT NULL DEFAULT 'GRD-1044',
    entry_time TEXT NOT NULL,
    exit_time TEXT DEFAULT '—',
    duration TEXT DEFAULT 'Just now',
    badge_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'inside' CHECK (status IN ('inside', 'exited', 'expected', 'cancelled')),
    pre_approved INTEGER NOT NULL DEFAULT 0,
    arrival_code TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_badge ON visitors(badge_number);
CREATE INDEX idx_visitors_host_unit ON visitors(host_unit);

-- 8. GATE LOGS
CREATE TABLE gate_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ENTRY', 'EXIT')),
    person TEXT NOT NULL,
    category TEXT NOT NULL,
    destination TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    gate TEXT NOT NULL,
    guard TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Cleared',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gate_logs_type ON gate_logs(type);
CREATE INDEX idx_gate_logs_gate ON gate_logs(gate);

-- 9. TASKS & WORK ORDERS
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    assigned_to_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    assigned_to_name TEXT NOT NULL,
    assigned_role TEXT NOT NULL,
    location TEXT NOT NULL,
    due_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    completed_at TEXT DEFAULT NULL,
    verified_by TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'assigned', 'in_progress', 'completed', 'verified')),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);

-- 10. TASK REMARKS
CREATE TABLE task_remarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    time TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_remarks_task_id ON task_remarks(task_id);

-- 11. PAYMENTS & WAGE ADVANCE VOUCHERS
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    reference_no TEXT UNIQUE NOT NULL,
    employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    employee_name TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Monthly Salary', 'Wage Advance', 'Overtime Allowance', 'Festival Bonus')),
    mode TEXT NOT NULL DEFAULT 'NEFT / Direct Bank',
    payment_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'rejected', 'processing')),
    remarks TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_employee ON payments(employee_id);
CREATE INDEX idx_payments_ref ON payments(reference_no);

-- 12. FORENSIC AUDIT LOGS
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    ip TEXT NOT NULL DEFAULT '10.0.1.44 (Active Session)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- 13. ESTATE SETTINGS
CREATE TABLE settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    society_name TEXT NOT NULL DEFAULT 'Dion Ventures Sector 4',
    address TEXT NOT NULL DEFAULT 'Plot 104, Sovereign Parkway, Sector 4, Dion Enclave',
    emergency_contact TEXT NOT NULL DEFAULT '+91 22 4900 8888',
    security_hotline TEXT NOT NULL DEFAULT '+91 22 4900 9999',
    visitor_pass_expiry_hours INTEGER NOT NULL DEFAULT 12,
    require_resident_approval INTEGER NOT NULL DEFAULT 1,
    auto_gate_barrier INTEGER NOT NULL DEFAULT 1,
    intercom_voip INTEGER NOT NULL DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
