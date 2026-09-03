-- ==============================================================================
-- DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
-- PostgreSQL Relational Database Schema
-- Compatible with PostgreSQL 14+ / 16
-- ==============================================================================

-- Create database if executed manually in PostgreSQL CLI:
-- CREATE DATABASE dion_security;
-- \c dion_security;

-- Drop tables in reverse dependency order if resetting
DROP TABLE IF EXISTS task_remarks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS gate_logs CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS residents CASCADE;
DROP TABLE IF EXISTS houses CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- ------------------------------------------------------------------------------
-- 1. SYSTEM USERS & ROLE-BASED ACCESS (RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) DEFAULT '$2y$10$abcdefghijklmnopqrstuv',
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'guard', 'supervisor')),
    station VARCHAR(100) NOT NULL DEFAULT 'Main Command Central',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login VARCHAR(50) DEFAULT 'Just now',
    avatar VARCHAR(10) NOT NULL DEFAULT 'DV',
    phone VARCHAR(30) NOT NULL DEFAULT '+91 22 4900 8800',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ------------------------------------------------------------------------------
-- 2. ESTATE BLOCKS (Infrastructure)
-- ------------------------------------------------------------------------------
CREATE TABLE blocks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    floors INT NOT NULL DEFAULT 8,
    total_units INT NOT NULL DEFAULT 40,
    occupied_units INT NOT NULL DEFAULT 36,
    security_officer VARCHAR(150) NOT NULL DEFAULT 'Officer C. Miller',
    status VARCHAR(30) NOT NULL DEFAULT 'Operational',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. HOUSING UNITS (Flats & Apartments)
-- ------------------------------------------------------------------------------
CREATE TABLE houses (
    id VARCHAR(50) PRIMARY KEY,
    unit_number VARCHAR(20) UNIQUE NOT NULL,
    block_id VARCHAR(50) REFERENCES blocks(id) ON DELETE SET NULL,
    block_name VARCHAR(100) NOT NULL,
    floor VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT '3 BHK Luxury',
    resident_name VARCHAR(150) NOT NULL DEFAULT '—',
    resident_phone VARCHAR(50) NOT NULL DEFAULT '—',
    parking_slot VARCHAR(50) NOT NULL DEFAULT 'P-A01',
    intercom VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'occupied' CHECK (status IN ('occupied', 'vacant', 'reserved', 'maintenance')),
    vehicles JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_houses_unit_number ON houses(unit_number);
CREATE INDEX idx_houses_block ON houses(block_name);
CREATE INDEX idx_houses_status ON houses(status);

-- ------------------------------------------------------------------------------
-- 4. VERIFIED RESIDENTS
-- ------------------------------------------------------------------------------
CREATE TABLE residents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    block_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Owner' CHECK (category IN ('Owner', 'Tenant', 'Armed Forces / Institutional')),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    since VARCHAR(20) NOT NULL DEFAULT 'Jan 2022',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
    rfid_tag VARCHAR(50) NOT NULL,
    family_count INT NOT NULL DEFAULT 1,
    vehicles JSONB DEFAULT '[]'::jsonb,
    avatar VARCHAR(10) NOT NULL DEFAULT 'RE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_residents_unit ON residents(unit_number);
CREATE INDEX idx_residents_rfid ON residents(rfid_tag);

-- ------------------------------------------------------------------------------
-- 5. FAMILY MEMBERS & DEPENDENTS
-- ------------------------------------------------------------------------------
CREATE TABLE family_members (
    id VARCHAR(50) PRIMARY KEY,
    resident_id VARCHAR(50) REFERENCES residents(id) ON DELETE CASCADE,
    resident_name VARCHAR(150) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    rfid_tag VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_family_unit ON family_members(unit_number);

-- ------------------------------------------------------------------------------
-- 6. WORKFORCE EMPLOYEES (80 Staff)
-- ------------------------------------------------------------------------------
CREATE TABLE employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    badge_no VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    assigned_location VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'leave', 'late')),
    daily_wage NUMERIC(10, 2) NOT NULL DEFAULT 850.00,
    monthly_wage NUMERIC(10, 2) NOT NULL DEFAULT 22000.00,
    phone VARCHAR(50) NOT NULL DEFAULT '+91 98000 00000',
    aadhaar VARCHAR(50) NOT NULL DEFAULT 'XXXX-XXXX-1234',
    rating NUMERIC(3, 1) NOT NULL DEFAULT 4.8,
    tasks_completed INT NOT NULL DEFAULT 42,
    joining_date VARCHAR(30) NOT NULL DEFAULT 'Jan 15, 2024',
    avatar VARCHAR(10) NOT NULL DEFAULT 'WR',
    today_attendance JSONB DEFAULT '{"inTime": "05:50 AM", "outTime": "—", "gate": "Gate 01", "status": "present"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_badge ON employees(badge_no);
CREATE INDEX idx_employees_dept ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_shift ON employees(shift);

-- ------------------------------------------------------------------------------
-- 7. VISITORS & PASSES
-- ------------------------------------------------------------------------------
CREATE TABLE visitors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    avatar VARCHAR(10) NOT NULL DEFAULT 'VI',
    phone VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    host_resident VARCHAR(150) NOT NULL,
    host_unit VARCHAR(20) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL DEFAULT 'Walk-in',
    purpose VARCHAR(255) NOT NULL DEFAULT 'Personal Visit',
    gate VARCHAR(50) NOT NULL DEFAULT 'Gate 01',
    guard_id VARCHAR(50) NOT NULL DEFAULT 'GRD-1044',
    entry_time VARCHAR(50) NOT NULL,
    exit_time VARCHAR(50) DEFAULT '—',
    duration VARCHAR(50) DEFAULT 'Just now',
    badge_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'inside' CHECK (status IN ('inside', 'exited', 'expected', 'cancelled')),
    pre_approved BOOLEAN NOT NULL DEFAULT false,
    arrival_code VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_badge ON visitors(badge_number);
CREATE INDEX idx_visitors_host_unit ON visitors(host_unit);

-- ------------------------------------------------------------------------------
-- 8. GATE LOGS (Turnstile & Telemetry Audit Stream)
-- ------------------------------------------------------------------------------
CREATE TABLE gate_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ENTRY', 'EXIT')),
    person VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    vehicle VARCHAR(50) NOT NULL,
    gate VARCHAR(50) NOT NULL,
    guard VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Cleared',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gate_logs_type ON gate_logs(type);
CREATE INDEX idx_gate_logs_gate ON gate_logs(gate);

-- ------------------------------------------------------------------------------
-- 9. TASKS & WORK ORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    assigned_to_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
    assigned_to_name VARCHAR(150) NOT NULL,
    assigned_role VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    created_at VARCHAR(50) NOT NULL,
    completed_at VARCHAR(50) DEFAULT NULL,
    verified_by VARCHAR(150) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'assigned', 'in_progress', 'completed', 'verified')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);

-- ------------------------------------------------------------------------------
-- 10. TASK REMARKS (Timeline & Field Notes)
-- ------------------------------------------------------------------------------
CREATE TABLE task_remarks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author VARCHAR(150) NOT NULL,
    time VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_remarks_task_id ON task_remarks(task_id);

-- ------------------------------------------------------------------------------
-- 11. PAYMENTS & WAGE ADVANCE VOUCHERS
-- ------------------------------------------------------------------------------
CREATE TABLE payments (
    id VARCHAR(50) PRIMARY KEY,
    reference_no VARCHAR(50) UNIQUE NOT NULL,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
    employee_name VARCHAR(150) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Monthly Salary', 'Wage Advance', 'Overtime Allowance', 'Festival Bonus')),
    mode VARCHAR(50) NOT NULL DEFAULT 'NEFT / Direct Bank',
    payment_date VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'rejected', 'processing')),
    remarks TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_employee ON payments(employee_id);
CREATE INDEX idx_payments_ref ON payments(reference_no);

-- ------------------------------------------------------------------------------
-- 12. FORENSIC AUDIT LOGS (Immutable Security Stream)
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    actor VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip VARCHAR(100) NOT NULL DEFAULT '10.0.1.44 (Active Session)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ------------------------------------------------------------------------------
-- 13. ESTATE SETTINGS & POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    society_name VARCHAR(200) NOT NULL DEFAULT 'Dion Ventures Sector 4',
    address TEXT NOT NULL DEFAULT 'Plot 104, Sovereign Parkway, Sector 4, Dion Enclave',
    emergency_contact VARCHAR(50) NOT NULL DEFAULT '+91 22 4900 8888',
    security_hotline VARCHAR(50) NOT NULL DEFAULT '+91 22 4900 9999',
    visitor_pass_expiry_hours INT NOT NULL DEFAULT 12,
    require_resident_approval BOOLEAN NOT NULL DEFAULT true,
    auto_gate_barrier BOOLEAN NOT NULL DEFAULT true,
    intercom_voip BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- END OF SCHEMA
-- ==============================================================================
