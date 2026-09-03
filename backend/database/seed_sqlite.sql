-- ==============================================================================
-- DION VENTURES ESTATE SECURITY & WORKFORCE OPERATIONS
-- SQLite Seed Data Script
-- ==============================================================================

-- 1. Insert System Users
INSERT OR IGNORE INTO users (id, name, email, role, station, status, last_login, avatar, phone) VALUES
('USR-ADMIN-01', 'Vikramaditya Singhania', 'admin@dionventures.internal', 'admin', 'Main Command Central', 'active', 'Just now', 'VS', '+91 22 4900 8801'),
('USR-ADMIN-02', 'Devendra Patil', 'd.patil@dionventures.internal', 'admin', 'Sector 4 Governance Wing', 'active', '14 min ago', 'DP', '+91 22 4900 8802'),
('USR-GUARD-01', 'Officer C. Miller', 'c.miller@dionventures.internal', 'guard', 'Main Gate 01', 'active', 'Just now', 'CM', '+91 98201 10001'),
('USR-GUARD-02', 'Officer R. Thorne', 'r.thorne@dionventures.internal', 'guard', 'East Service Gate 02', 'active', '22 min ago', 'RT', '+91 98201 10002'),
('USR-GUARD-03', 'Officer S. Deshmukh', 's.deshmukh@dionventures.internal', 'guard', 'West Exit Gate 03', 'active', '45 min ago', 'SD', '+91 98201 10003'),
('USR-GUARD-04', 'Officer P. Nair', 'p.nair@dionventures.internal', 'guard', 'Clubhouse Gate 04', 'active', '1 hr ago', 'PN', '+91 98201 10004'),
('USR-SUP-01', 'Inspector R. Thorne', 'r.thorne.sup@dionventures.internal', 'supervisor', 'Facility Operations Hub', 'active', 'Just now', 'RT', '+91 98202 20001'),
('USR-SUP-02', 'Officer K. Nair', 'k.nair.sup@dionventures.internal', 'supervisor', 'Maintenance Depot B', 'active', '10 min ago', 'KN', '+91 98202 20002'),
('USR-SUP-03', 'Commander M. Vance', 'm.vance.sup@dionventures.internal', 'supervisor', 'Night Perimeter Post', 'active', '3 hrs ago', 'MV', '+91 98202 20003');

-- 2. Insert Estate Blocks
INSERT OR IGNORE INTO blocks (id, name, floors, total_units, occupied_units, security_officer, status) VALUES
('BLK-A', 'Block A — Sovereign Heights', 8, 48, 44, 'Officer C. Miller', 'Operational'),
('BLK-B', 'Block B — Royale Crest', 8, 48, 45, 'Officer R. Thorne', 'Operational'),
('BLK-C', 'Block C — Monarch Residences', 7, 42, 38, 'Officer S. Deshmukh', 'Operational'),
('BLK-D', 'Block D — Imperial Greens', 7, 42, 36, 'Officer P. Nair', 'Operational'),
('BLK-E', 'Block E — Grand Boulevard', 6, 38, 35, 'Officer K. Verma', 'Operational'),
('BLK-F', 'Block F — Penthouse Suites', 6, 37, 33, 'Officer J. Roy', 'Operational');

-- 3. Insert Housing Units Sample
INSERT OR IGNORE INTO houses (id, unit_number, block_id, block_name, floor, type, resident_name, resident_phone, parking_slot, intercom, status, vehicles) VALUES
('HSE-A101', 'A-101', 'BLK-A', 'Block A', '1st Floor', '3 BHK Luxury', 'Sunita Sharma', '+91 98200 11221', 'P-A12', '101', 'occupied', '["MH-02-CB-1234", "MH-02-DF-9876"]'),
('HSE-A102', 'A-102', 'BLK-A', 'Block A', '1st Floor', '3 BHK Luxury', 'Dr. Rajesh Varma', '+91 98200 11222', 'P-A13', '102', 'occupied', '["MH-02-AB-5555"]'),
('HSE-A201', 'A-201', 'BLK-A', 'Block A', '2nd Floor', '3 BHK Luxury', 'Ananya Deshmukh', '+91 98200 11223', 'P-A21', '201', 'occupied', '["MH-02-ZZ-9000"]'),
('HSE-A203', 'A-203', 'BLK-A', 'Block A', '2nd Floor', '3 BHK Luxury', 'Sunita Sharma', '+91 98200 11221', 'P-A23', '203', 'occupied', '["MH-02-CB-1234", "MH-02-DF-9876"]'),
('HSE-A301', 'A-301', 'BLK-A', 'Block A', '3rd Floor', '3 BHK Luxury', '—', '—', 'P-A31', '301', 'vacant', '[]'),
('HSE-B101', 'B-101', 'BLK-B', 'Block B', '1st Floor', '4 BHK Grand', 'Harish Mehta', '+91 98200 22331', 'P-B01', '101', 'occupied', '["MH-02-KK-1122"]'),
('HSE-B102', 'B-102', 'BLK-B', 'Block B', '1st Floor', '4 BHK Grand', 'Pooja Singhania', '+91 98200 22332', 'P-B02', '102', 'occupied', '["MH-02-PS-9900"]'),
('HSE-B202', 'B-202', 'BLK-B', 'Block B', '2nd Floor', '4 BHK Grand', 'Vikram Malhotra', '+91 98200 22334', 'P-B12', '202', 'occupied', '["MH-02-VM-4444"]'),
('HSE-C101', 'C-101', 'BLK-C', 'Block C', '1st Floor', '2 BHK Premium', 'Kavita Pillai', '+91 98200 33441', 'P-C01', '101', 'occupied', '["MH-02-KP-7788"]'),
('HSE-C204', 'C-204', 'BLK-C', 'Block C', '2nd Floor', '2 BHK Premium', 'Rahul Nambiar', '+91 98200 33445', 'P-C14', '204', 'occupied', '["MH-02-RN-1123"]'),
('HSE-D101', 'D-101', 'BLK-D', 'Block D', '1st Floor', '3 BHK Luxury', 'Suresh Oberoi', '+91 98200 44551', 'P-D01', '101', 'occupied', '["MH-02-SO-3322"]'),
('HSE-E101', 'E-101', 'BLK-E', 'Block E', '1st Floor', '3 BHK Luxury', 'Manish Kothari', '+91 98200 55661', 'P-E01', '101', 'occupied', '["MH-02-MK-9988"]'),
('HSE-F101', 'F-101', 'BLK-F', 'Block F', '1st Floor', 'Penthouse Duplex', 'Rohan Birla', '+91 98200 66771', 'P-F01', '101', 'occupied', '["MH-02-RB-0001", "MH-02-RB-0002"]');

-- 4. Insert Verified Residents
INSERT OR IGNORE INTO residents (id, name, unit_number, block_name, category, phone, email, since, status, rfid_tag, family_count, vehicles, avatar) VALUES
('RES-001', 'Sunita Sharma', 'A-203', 'Block A', 'Owner', '+91 98200 11221', 'sunita.sharma@example.com', 'Mar 2021', 'active', 'RFID-88190', 3, '["MH-02-CB-1234", "MH-02-DF-9876"]', 'SS'),
('RES-002', 'Dr. Rajesh Varma', 'A-102', 'Block A', 'Owner', '+91 98200 11222', 'dr.varma@medcenter.org', 'Jan 2020', 'active', 'RFID-88191', 4, '["MH-02-AB-5555"]', 'RV'),
('RES-003', 'Harish Mehta', 'B-101', 'Block B', 'Owner', '+91 98200 22331', 'hmehta@mehtacorp.com', 'Aug 2019', 'active', 'RFID-77402', 2, '["MH-02-KK-1122"]', 'HM'),
('RES-004', 'Pooja Singhania', 'B-102', 'Block B', 'Owner', '+91 98200 22332', 'pooja@singhania.in', 'Nov 2021', 'active', 'RFID-77403', 3, '["MH-02-PS-9900"]', 'PS'),
('RES-005', 'Vikram Malhotra', 'B-202', 'Block B', 'Tenant', '+91 98200 22334', 'v.malhotra@techcorp.io', 'Feb 2023', 'active', 'RFID-77415', 2, '["MH-02-VM-4444"]', 'VM'),
('RES-006', 'Kavita Pillai', 'C-101', 'Block C', 'Owner', '+91 98200 33441', 'kavita.p@pillailaw.com', 'May 2020', 'active', 'RFID-66101', 3, '["MH-02-KP-7788"]', 'KP'),
('RES-007', 'Rahul Nambiar', 'C-204', 'Block C', 'Tenant', '+91 98200 33445', 'rahul.nambiar@startup.co', 'Jun 2022', 'active', 'RFID-66114', 1, '["MH-02-RN-1123"]', 'RN'),
('RES-008', 'Rohan Birla', 'F-101', 'Block F', 'Owner', '+91 98200 66771', 'rohan@birlaholdings.com', 'Jan 2019', 'active', 'RFID-99001', 4, '["MH-02-RB-0001", "MH-02-RB-0002"]', 'RB');

-- 5. Insert Family Members
INSERT OR IGNORE INTO family_members (id, resident_id, resident_name, unit_number, name, relation, phone, rfid_tag, status) VALUES
('FAM-001', 'RES-001', 'Sunita Sharma', 'A-203', 'Alok Sharma', 'Spouse', '+91 98200 99111', 'RFID-88190-A', 'active'),
('FAM-002', 'RES-001', 'Sunita Sharma', 'A-203', 'Rhea Sharma', 'Daughter', '+91 98200 99112', 'RFID-88190-B', 'active'),
('FAM-003', 'RES-001', 'Sunita Sharma', 'A-203', 'Kalyani Sharma', 'Mother-in-law', '+91 98200 99113', 'RFID-88190-C', 'active'),
('FAM-004', 'RES-002', 'Dr. Rajesh Varma', 'A-102', 'Dr. Suniti Varma', 'Spouse', '+91 98200 88221', 'RFID-88191-A', 'active'),
('FAM-005', 'RES-003', 'Harish Mehta', 'B-101', 'Nalini Mehta', 'Spouse', '+91 98200 77331', 'RFID-77402-A', 'active');

-- 6. Insert Workforce Employees
INSERT OR IGNORE INTO employees (id, name, badge_no, role, department, shift, assigned_location, status, daily_wage, monthly_wage, phone, aadhaar, rating, tasks_completed, joining_date, avatar, today_attendance) VALUES
('WRK-1001', 'Ramesh Kumar', 'DION-E101', 'Patrol Guard Level 1', 'Security & Surveillance', 'Morning (06:00 - 14:00)', 'Block A & B Service Bay', 'present', 850, 22100, '+91 98765 43210', 'XXXX-XXXX-4512', 4.9, 142, 'Jan 15, 2023', 'RK', '{"inTime": "05:52 AM", "outTime": "—", "gate": "Gate 01", "status": "present"}'),
('WRK-1002', 'Abdul Karim', 'DION-E102', 'Senior Electrician', 'Facilities & Engineering', 'Morning (06:00 - 14:00)', 'Basement Level -1 Pump Room', 'present', 1100, 28600, '+91 98765 43211', 'XXXX-XXXX-8921', 4.8, 218, 'Nov 10, 2022', 'AK', '{"inTime": "05:58 AM", "outTime": "—", "gate": "Gate 02", "status": "present"}'),
('WRK-1003', 'Suresh Yadav', 'DION-E103', 'Perimeter Boom Guard', 'Security & Surveillance', 'Morning (06:00 - 14:00)', 'Main Gate 01 Boom Barrier', 'present', 850, 22100, '+91 98765 43212', 'XXXX-XXXX-3341', 4.7, 98, 'Feb 01, 2024', 'SY', '{"inTime": "05:45 AM", "outTime": "—", "gate": "Gate 01", "status": "present"}'),
('WRK-1004', 'Mahesh Patil', 'DION-E104', 'Plumbing Technician', 'Facilities & Engineering', 'Morning (06:00 - 14:00)', 'Block C & D Riser Shafts', 'present', 1050, 27300, '+91 98765 43213', 'XXXX-XXXX-7729', 4.6, 174, 'Aug 20, 2023', 'MP', '{"inTime": "06:02 AM", "outTime": "—", "gate": "Gate 02", "status": "present"}'),
('WRK-1005', 'Dinesh Rawat', 'DION-E105', 'Housekeeping Supervisor', 'Housekeeping & Sanitization', 'Morning (06:00 - 14:00)', 'Central Lobby & Club', 'present', 950, 24700, '+91 98765 43214', 'XXXX-XXXX-1190', 4.9, 310, 'May 12, 2022', 'DR', '{"inTime": "05:50 AM", "outTime": "—", "gate": "Gate 01", "status": "present"}'),
('WRK-1006', 'Kishan Lal', 'DION-E106', 'Head Horticulturalist', 'Landscaping & Horticulture', 'Morning (06:00 - 14:00)', 'North Garden Parkway', 'present', 900, 23400, '+91 98765 43215', 'XXXX-XXXX-6602', 4.8, 88, 'Sep 05, 2023', 'KL', '{"inTime": "06:10 AM", "outTime": "—", "gate": "Gate 04", "status": "present"}'),
('WRK-1007', 'Sunil Pawar', 'DION-E107', 'CCTV Monitoring Officer', 'Security & Surveillance', 'Morning (06:00 - 14:00)', 'Central Surveillance Room', 'present', 1000, 26000, '+91 98765 43216', 'XXXX-XXXX-9934', 4.9, 412, 'Jan 02, 2023', 'SP', '{"inTime": "05:48 AM", "outTime": "—", "gate": "Gate 01", "status": "present"}'),
('WRK-1008', 'Vikram Shinde', 'DION-E108', 'Night Patrol Lead', 'Security & Surveillance', 'Night (22:00 - 06:00)', 'Perimeter Boundary Wall', 'absent', 950, 24700, '+91 98765 43217', 'XXXX-XXXX-4419', 4.5, 76, 'Dec 18, 2023', 'VS', '{"inTime": "—", "outTime": "—", "gate": "—", "status": "absent"}'),
('WRK-1009', 'Anand Kulkarni', 'DION-E109', 'HVAC Technician', 'Facilities & Engineering', 'Morning (06:00 - 14:00)', 'Tower A Chiller Plant', 'late', 1150, 29900, '+91 98765 43218', 'XXXX-XXXX-2281', 4.7, 134, 'Mar 15, 2023', 'AK', '{"inTime": "06:28 AM", "outTime": "—", "gate": "Gate 02", "status": "late"}'),
('WRK-1010', 'Prakash Jadhav', 'DION-E110', 'Sanitization Aide', 'Housekeeping & Sanitization', 'Morning (06:00 - 14:00)', 'Block E & F Corridors', 'leave', 800, 20800, '+91 98765 43219', 'XXXX-XXXX-5543', 4.6, 92, 'Jul 08, 2023', 'PJ', '{"inTime": "—", "outTime": "—", "gate": "—", "status": "leave"}'),
('WRK-1011', 'Bhagwan Das', 'DION-E111', 'Landscape Maintenance', 'Landscaping & Horticulture', 'Morning (06:00 - 14:00)', 'Sovereign Boulevard Lawns', 'present', 850, 22100, '+91 98765 43220', 'XXXX-XXXX-7712', 4.8, 64, 'Oct 11, 2023', 'BD', '{"inTime": "05:55 AM", "outTime": "—", "gate": "Gate 04", "status": "present"}'),
('WRK-1012', 'Omkar Rane', 'DION-E112', 'Turnstile Gate Officer', 'Security & Surveillance', 'Morning (06:00 - 14:00)', 'East Gate 02 Turnstiles', 'present', 850, 22100, '+91 98765 43221', 'XXXX-XXXX-9981', 4.7, 85, 'Apr 19, 2023', 'OR', '{"inTime": "05:51 AM", "outTime": "—", "gate": "Gate 02", "status": "present"}');

-- 7. Insert Visitors & Passes
INSERT OR IGNORE INTO visitors (id, name, avatar, phone, category, host_resident, host_unit, vehicle_number, purpose, gate, guard_id, entry_time, exit_time, duration, badge_number, status, pre_approved, arrival_code) VALUES
('VIS-9091', 'Vikramaditya Roy', 'VR', '+91 98111 22334', 'Guest / Family', 'Sunita Sharma', 'A-203', 'MH-02-AB-9876', 'Family Dinner', 'Gate 01', 'GRD-1044', '08:02 AM', '—', '1h 18m', 'G-104', 'inside', 1, '991204'),
('VIS-9092', 'Sameer Khan (Uber)', 'SK', '+91 98222 33445', 'Cab / Taxi', 'Harish Mehta', 'B-101', 'MH-01-EE-4521', 'Passenger Pickup', 'Gate 01', 'GRD-1044', '08:45 AM', '—', '35m', 'C-209', 'inside', 1, '881290'),
('VIS-9093', 'Zomato Delivery — Amit', 'ZA', '+91 98333 44556', 'Food Delivery', 'Pooja Singhania', 'B-102', 'MH-02-ZZ-1199', 'Food Delivery', 'Gate 02', 'GRD-1045', '09:05 AM', '—', '15m', 'D-512', 'inside', 0, NULL),
('VIS-9094', 'Amazon Logistics', 'AL', '+91 98444 55667', 'Delivery / Courier', 'Ananya Deshmukh', 'A-201', 'MH-04-TR-8812', 'Parcel Delivery', 'Gate 02', 'GRD-1045', '07:30 AM', '08:15 AM', '45m', 'D-489', 'exited', 0, NULL),
('VIS-9095', 'Dr. Alok Verma', 'AV', '+91 98555 66778', 'Guest / Family', 'Dr. Rajesh Varma', 'A-102', 'MH-02-DR-1001', 'Medical Consultation', 'Gate 01', 'GRD-1044', '—', '—', 'Expected', 'G-110', 'expected', 1, '441920'),
('VIS-9096', 'Urban Company AC Tech', 'UC', '+91 98666 77889', 'Contractor / Service', 'Sunita Sharma', 'A-203', 'MH-02-UC-9900', 'HVAC Servicing', 'Gate 01', 'GRD-1044', '08:10 AM', '—', '1h 10m', 'T-304', 'inside', 1, '119283');

-- 8. Insert Gate Logs
INSERT OR IGNORE INTO gate_logs (id, timestamp, type, person, category, destination, vehicle, gate, guard, status) VALUES
('LOG-8901', '09:05 AM', 'ENTRY', 'Zomato Delivery — Amit', 'Food Delivery', 'B-102', 'MH-02-ZZ-1199', 'Gate 02', 'Officer R. Thorne', 'Cleared'),
('LOG-8902', '08:45 AM', 'ENTRY', 'Sameer Khan (Uber)', 'Cab / Taxi', 'B-101', 'MH-01-EE-4521', 'Gate 01', 'Officer C. Miller', 'Cleared'),
('LOG-8903', '08:15 AM', 'EXIT', 'Amazon Logistics', 'Delivery / Courier', 'A-201', 'MH-04-TR-8812', 'Gate 02', 'Officer R. Thorne', 'Pass Returned'),
('LOG-8904', '08:10 AM', 'ENTRY', 'Urban Company AC Tech', 'Contractor', 'A-203', 'MH-02-UC-9900', 'Gate 01', 'Officer C. Miller', 'Cleared'),
('LOG-8905', '08:02 AM', 'ENTRY', 'Vikramaditya Roy', 'Guest', 'A-203', 'MH-02-AB-9876', 'Gate 01', 'Officer C. Miller', 'Cleared'),
('LOG-8906', '07:30 AM', 'ENTRY', 'Amazon Logistics', 'Delivery / Courier', 'A-201', 'MH-04-TR-8812', 'Gate 02', 'Officer R. Thorne', 'Cleared');

-- 9. Insert Tasks & Work Orders
INSERT OR IGNORE INTO tasks (id, title, description, category, priority, assigned_to_id, assigned_to_name, assigned_role, location, due_date, created_at, completed_at, verified_by, status) VALUES
('TSK-881', 'Block A Main Elevator Sensor Recalibration', 'Optical leveling sensor on Elevator #02 triggering false alarm on 4th floor landing. Inspect contacts, realign bracket and recalibrate micro-switches.', 'Facilities & Engineering', 'urgent', 'WRK-1002', 'Abdul Karim', 'Senior Electrician', 'Block A, Elevator Shaft #02', 'Today, 02:00 PM', '07:15 AM', NULL, NULL, 'in_progress'),
('TSK-882', 'Perimeter Barrier Gate 01 Loop Detector Calibration', 'Inductive loop detector sensor at entry lane experiencing intermittent delay with low-chassis sedans. Check loop sensitivity setting and harness.', 'Security & Surveillance', 'high', 'WRK-1007', 'Sunil Pawar', 'CCTV Monitoring Officer', 'Main Gate 01 Inbound Lane', 'Today, 04:00 PM', '08:00 AM', NULL, NULL, 'assigned'),
('TSK-883', 'Basement -2 Sump Pump #03 Automated Float Test', 'Quarterly preventive maintenance on automated drainage sump float switch in Southwest corner of Basement -2.', 'Facilities & Engineering', 'medium', 'WRK-1004', 'Mahesh Patil', 'Plumbing Technician', 'Basement -2 Utility Room', 'Tomorrow, 11:00 AM', '08:30 AM', NULL, NULL, 'created'),
('TSK-884', 'Central Clubhouse Parkway Deep Pressure Sanitization', 'High-pressure water washing of pedestrian travertine walkways around swimming pavilion and tennis academy courts.', 'Housekeeping & Sanitization', 'low', 'WRK-1005', 'Dinesh Rawat', 'Housekeeping Supervisor', 'Central Amenity Deck', 'Sep 05, 05:00 PM', '09:00 AM', 'Sep 03, 10:00 AM', 'Inspector R. Thorne', 'verified'),
('TSK-885', 'East Garden Boundary Hedge Trim & Sprinkler Re-alignment', 'Trim perimeter foliage away from CCTV Zone 4 infrared sensor beams and align rotor heads.', 'Landscaping & Horticulture', 'low', 'WRK-1006', 'Kishan Lal', 'Head Horticulturalist', 'North Garden Parkway', 'Today, 06:00 PM', '06:45 AM', 'Sep 03, 08:30 AM', 'Inspector R. Thorne', 'completed');

-- 10. Insert Task Remarks
INSERT OR IGNORE INTO task_remarks (id, task_id, author, time, text) VALUES
(1, 'TSK-881', 'Abdul Karim (Senior Electrician)', '08:30 AM', 'Accessed shaft via machine room. Sensor optic lens has slight dust accumulation; running recalibration routine now.'),
(2, 'TSK-881', 'Inspector R. Thorne (Supervisor)', '08:45 AM', 'Approved. Ensure emergency brake contact is isolated before full cycle diagnostic test.'),
(3, 'TSK-882', 'Sunil Pawar (Security Tech)', '08:15 AM', 'Confirmed signal drop on loop #01. Ordering replacement amplifier module from Central Depot.'),
(4, 'TSK-884', 'Inspector R. Thorne (Supervisor)', '10:05 AM', 'Field inspection complete. Walkway dry and compliant with slip-resistance standard. Verified and signed off.');

-- 11. Insert Payments
INSERT OR IGNORE INTO payments (id, reference_no, employee_id, employee_name, amount, type, mode, payment_date, status, remarks) VALUES
('PAY-901', 'VCH-2026-0901', 'WRK-1001', 'Ramesh Kumar', 22100, 'Monthly Salary', 'NEFT / Direct Bank', 'Sep 01, 2026', 'paid', 'August 2026 Monthly Full Cycle Settlement'),
('PAY-902', 'VCH-2026-0902', 'WRK-1002', 'Abdul Karim', 28600, 'Monthly Salary', 'NEFT / Direct Bank', 'Sep 01, 2026', 'paid', 'August 2026 Monthly Full Cycle Settlement'),
('PAY-903', 'VCH-2026-0903', 'WRK-1004', 'Mahesh Patil', 5000, 'Wage Advance', 'IMPS Instant', 'Sep 02, 2026', 'paid', 'Mid-cycle emergency draw approved by Supervisor'),
('PAY-904', 'VCH-2026-0904', 'WRK-1007', 'Sunil Pawar', 3200, 'Overtime Allowance', 'NEFT / Direct Bank', 'Sep 01, 2026', 'paid', 'Night surveillance coverage overtime (16 hrs)');

-- 12. Insert Forensic Audit Logs
INSERT OR IGNORE INTO audit_logs (id, timestamp, actor, action, details, ip) VALUES
('AUD-901', '09:05:12 AM', 'Officer R. Thorne (Gate Guard)', 'VISITOR_CHECKIN', 'Issued digital badge #D-512 to Zomato Delivery for Unit B-102.', '10.0.1.44 (Gate 02)'),
('AUD-902', '08:45:00 AM', 'Officer C. Miller (Gate Guard)', 'VISITOR_CHECKIN', 'Issued digital badge #C-209 to Sameer Khan (Uber) for Unit B-101.', '10.0.1.41 (Gate 01)'),
('AUD-903', '08:30:22 AM', 'Inspector R. Thorne (Supervisor)', 'TASK_STATUS_UPDATED', 'Updated Task TSK-881 to in_progress.', '10.0.1.20 (Operations Hub)'),
('AUD-904', '08:15:40 AM', 'Officer R. Thorne (Gate Guard)', 'VISITOR_CHECKOUT', 'Checked out Amazon Logistics (D-489). Pass returned.', '10.0.1.44 (Gate 02)'),
('AUD-905', '08:00:10 AM', 'Inspector R. Thorne (Supervisor)', 'TASK_CREATED', 'Dispatched Task TSK-882 to Sunil Pawar.', '10.0.1.20 (Operations Hub)'),
('AUD-906', '06:00:00 AM', 'System Scheduler', 'MUSTER_INITIALIZED', 'Morning Shift Muster initialized for 80 workforce personnel.', '127.0.0.1 (System Cron)');

-- 13. Insert Estate Settings
INSERT OR REPLACE INTO settings (id, society_name, address, emergency_contact, security_hotline, visitor_pass_expiry_hours, require_resident_approval, auto_gate_barrier, intercom_voip) VALUES
(1, 'Dion Ventures Sector 4', 'Plot 104, Sovereign Parkway, Sector 4, Dion Enclave', '+91 22 4900 8888', '+91 22 4900 9999', 12, 1, 1, 1);
