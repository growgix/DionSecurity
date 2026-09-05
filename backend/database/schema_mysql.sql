-- ==============================================================================
-- DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
-- MySQL 8.0 Relational Database Schema
-- Compatible with MySQL 8.0+ / InnoDB / utf8mb4
-- Note: 'users' table is already present; this script creates the remaining 12 tables.
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- Drop tables in reverse dependency order if resetting
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS task_remarks;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS family_members;
DROP TABLE IF EXISTS residents;
DROP TABLE IF EXISTS houses;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS gate_logs;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS blocks;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. ESTATE BLOCKS (Infrastructure)
-- ------------------------------------------------------------------------------
CREATE TABLE blocks (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    floors INT NOT NULL DEFAULT 8,
    total_units INT NOT NULL DEFAULT 40,
    occupied_units INT NOT NULL DEFAULT 36,
    security_officer VARCHAR(150) NOT NULL DEFAULT 'Officer C. Miller',
    status VARCHAR(30) NOT NULL DEFAULT 'Operational',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. WORKFORCE EMPLOYEES (80 Staff)
-- ------------------------------------------------------------------------------
CREATE TABLE employees (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    badge_no VARCHAR(50) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    assigned_location VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'present',
    daily_wage DECIMAL(10, 2) NOT NULL DEFAULT 850.00,
    monthly_wage DECIMAL(10, 2) NOT NULL DEFAULT 22000.00,
    phone VARCHAR(50) NOT NULL DEFAULT '+91 98000 00000',
    aadhaar VARCHAR(50) NOT NULL DEFAULT 'XXXX-XXXX-1234',
    rating DECIMAL(3, 1) NOT NULL DEFAULT 4.8,
    tasks_completed INT NOT NULL DEFAULT 42,
    joining_date VARCHAR(30) NOT NULL DEFAULT 'Jan 15, 2024',
    avatar VARCHAR(10) NOT NULL DEFAULT 'WR',
    today_attendance JSON DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_employees_badge (badge_no),
    KEY idx_employees_badge (badge_no),
    KEY idx_employees_dept (department),
    KEY idx_employees_status (status),
    KEY idx_employees_shift (shift),
    CONSTRAINT chk_employees_status CHECK (status IN ('present', 'absent', 'leave', 'late'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. VISITORS & PASSES
-- ------------------------------------------------------------------------------
CREATE TABLE visitors (
    id VARCHAR(50) NOT NULL,
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
    status VARCHAR(20) NOT NULL DEFAULT 'inside',
    pre_approved TINYINT(1) NOT NULL DEFAULT 0,
    arrival_code VARCHAR(20) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_visitors_status (status),
    KEY idx_visitors_badge (badge_number),
    KEY idx_visitors_host_unit (host_unit),
    CONSTRAINT chk_visitors_status CHECK (status IN ('inside', 'exited', 'expected', 'cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. GATE LOGS (Turnstile & Telemetry Audit Stream)
-- ------------------------------------------------------------------------------
CREATE TABLE gate_logs (
    id VARCHAR(50) NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    person VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    vehicle VARCHAR(50) NOT NULL,
    gate VARCHAR(50) NOT NULL,
    guard VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Cleared',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_gate_logs_type (type),
    KEY idx_gate_logs_gate (gate),
    CONSTRAINT chk_gate_logs_type CHECK (type IN ('ENTRY', 'EXIT'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. FORENSIC AUDIT LOGS (Immutable Security Stream)
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id VARCHAR(50) NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    actor VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip VARCHAR(100) NOT NULL DEFAULT '10.0.1.44 (Active Session)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_audit_logs_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. ESTATE SETTINGS & POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE settings (
    id INT NOT NULL DEFAULT 1,
    society_name VARCHAR(200) NOT NULL DEFAULT 'Dion Ventures Sector 4',
    address TEXT NOT NULL,
    emergency_contact VARCHAR(50) NOT NULL DEFAULT '+91 22 4900 8888',
    security_hotline VARCHAR(50) NOT NULL DEFAULT '+91 22 4900 9999',
    visitor_pass_expiry_hours INT NOT NULL DEFAULT 12,
    require_resident_approval TINYINT(1) NOT NULL DEFAULT 1,
    auto_gate_barrier TINYINT(1) NOT NULL DEFAULT 1,
    intercom_voip TINYINT(1) NOT NULL DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT chk_settings_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. HOUSING UNITS (Flats & Apartments)
-- ------------------------------------------------------------------------------
CREATE TABLE houses (
    id VARCHAR(50) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    block_id VARCHAR(50) DEFAULT NULL,
    block_name VARCHAR(100) NOT NULL,
    floor VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT '3 BHK Luxury',
    resident_name VARCHAR(150) NOT NULL DEFAULT '—',
    resident_phone VARCHAR(50) NOT NULL DEFAULT '—',
    parking_slot VARCHAR(50) NOT NULL DEFAULT 'P-A01',
    intercom VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'occupied',
    vehicles JSON DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_houses_unit_number (unit_number),
    KEY idx_houses_unit_number (unit_number),
    KEY idx_houses_block (block_name),
    KEY idx_houses_status (status),
    KEY fk_houses_block_id (block_id),
    CONSTRAINT fk_houses_blocks FOREIGN KEY (block_id) REFERENCES blocks (id) ON DELETE SET NULL,
    CONSTRAINT chk_houses_status CHECK (status IN ('occupied', 'vacant', 'reserved', 'maintenance'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. VERIFIED RESIDENTS
-- ------------------------------------------------------------------------------
CREATE TABLE residents (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    block_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Owner',
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    since VARCHAR(20) NOT NULL DEFAULT 'Jan 2022',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    rfid_tag VARCHAR(50) NOT NULL,
    family_count INT NOT NULL DEFAULT 1,
    vehicles JSON DEFAULT NULL,
    avatar VARCHAR(10) NOT NULL DEFAULT 'RE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_residents_unit (unit_number),
    KEY idx_residents_rfid (rfid_tag),
    CONSTRAINT chk_residents_category CHECK (category IN ('Owner', 'Tenant', 'Armed Forces / Institutional')),
    CONSTRAINT chk_residents_status CHECK (status IN ('active', 'pending', 'inactive'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. FAMILY MEMBERS & DEPENDENTS
-- ------------------------------------------------------------------------------
CREATE TABLE family_members (
    id VARCHAR(50) NOT NULL,
    resident_id VARCHAR(50) DEFAULT NULL,
    resident_name VARCHAR(150) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    rfid_tag VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_family_unit (unit_number),
    KEY fk_family_members_resident_id (resident_id),
    CONSTRAINT fk_family_members_residents FOREIGN KEY (resident_id) REFERENCES residents (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. TASKS & WORK ORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE tasks (
    id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    assigned_to_id VARCHAR(50) DEFAULT NULL,
    assigned_to_name VARCHAR(150) NOT NULL,
    assigned_role VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    created_at VARCHAR(50) NOT NULL,
    completed_at VARCHAR(50) DEFAULT NULL,
    verified_by VARCHAR(150) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'created',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_tasks_status (status),
    KEY idx_tasks_priority (priority),
    KEY idx_tasks_assigned_to (assigned_to_id),
    CONSTRAINT fk_tasks_employees FOREIGN KEY (assigned_to_id) REFERENCES employees (id) ON DELETE SET NULL,
    CONSTRAINT chk_tasks_priority CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    CONSTRAINT chk_tasks_status CHECK (status IN ('created', 'assigned', 'in_progress', 'completed', 'verified'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. TASK REMARKS (Timeline & Field Notes)
-- ------------------------------------------------------------------------------
CREATE TABLE task_remarks (
    id INT NOT NULL AUTO_INCREMENT,
    task_id VARCHAR(50) NOT NULL,
    author VARCHAR(150) NOT NULL,
    time VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_task_remarks_task_id (task_id),
    CONSTRAINT fk_task_remarks_tasks FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 12. PAYMENTS & WAGE ADVANCE VOUCHERS
-- ------------------------------------------------------------------------------
CREATE TABLE payments (
    id VARCHAR(50) NOT NULL,
    reference_no VARCHAR(50) NOT NULL,
    employee_id VARCHAR(50) DEFAULT NULL,
    employee_name VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    mode VARCHAR(50) NOT NULL DEFAULT 'NEFT / Direct Bank',
    payment_date VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'paid',
    remarks TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payments_ref (reference_no),
    KEY idx_payments_employee (employee_id),
    KEY idx_payments_ref (reference_no),
    CONSTRAINT fk_payments_employees FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE SET NULL,
    CONSTRAINT chk_payments_type CHECK (type IN ('Monthly Salary', 'Wage Advance', 'Overtime Allowance', 'Festival Bonus')),
    CONSTRAINT chk_payments_status CHECK (status IN ('paid', 'pending', 'rejected', 'processing'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;