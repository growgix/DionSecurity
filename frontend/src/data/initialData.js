// Central Initial Data Store for Dion Ventures Security & Workforce System

export const INITIAL_USERS = [
  {
    id: 'ADM-9402',
    name: 'Commander M. Vance',
    role: 'admin',
    roleLabel: 'Super Admin',
    title: 'Estate Operations Lead',
    email: 'm.vance@dionventures.internal',
    phone: '+91 98201 94020',
    avatar: 'MV',
    station: 'Central Command',
    status: 'active',
    lastActive: 'Just now',
    permissions: ['all']
  },
  {
    id: 'GRD-1044',
    name: 'Officer C. Miller',
    role: 'guard',
    roleLabel: 'Main Gate Guard',
    title: 'Perimeter Security Officer',
    email: 'c.miller@dionventures.internal',
    phone: '+91 98202 10440',
    avatar: 'CM',
    station: 'Main Gate 01',
    status: 'active',
    lastActive: 'Just now',
    permissions: ['gate', 'visitor', 'scan']
  },
  {
    id: 'SUP-2081',
    name: 'Inspector R. Thorne',
    role: 'supervisor',
    roleLabel: 'Field Supervisor',
    title: 'Workforce & Facilities Supervisor',
    email: 'r.thorne@dionventures.internal',
    phone: '+91 98203 20810',
    avatar: 'RT',
    station: 'Facility Operations Hub',
    status: 'active',
    lastActive: 'Just now',
    permissions: ['workforce', 'tasks', 'attendance', 'payments']
  }
];

export const INITIAL_BLOCKS = [
  {
    id: 'BLK-A',
    name: 'Block A',
    sector: 'Sector 1 (North Wing)',
    wings: 'Wings A1 – A4',
    totalHouses: 40,
    occupiedHouses: 36,
    vacantHouses: 4,
    residentsCount: 92,
    occupancyRate: 90.0,
    status: 'active',
    supervisor: 'Inspector R. Thorne',
    gateAccess: 'Gate 01 & Gate 02',
    elevators: 4,
    lastInspected: 'Today, 08:30 AM'
  },
  {
    id: 'BLK-B',
    name: 'Block B',
    sector: 'Sector 1 (East Wing)',
    wings: 'Wings B1 – B4',
    totalHouses: 45,
    occupiedHouses: 41,
    vacantHouses: 4,
    residentsCount: 104,
    occupancyRate: 91.1,
    status: 'active',
    supervisor: 'Inspector R. Thorne',
    gateAccess: 'Gate 01',
    elevators: 4,
    lastInspected: 'Today, 09:15 AM'
  },
  {
    id: 'BLK-C',
    name: 'Block C',
    sector: 'Sector 2 (Central Boulevard)',
    wings: 'Wings C1 – C5',
    totalHouses: 50,
    occupiedHouses: 46,
    vacantHouses: 4,
    residentsCount: 118,
    occupancyRate: 92.0,
    status: 'active',
    supervisor: 'Inspector R. Thorne',
    gateAccess: 'Gate 02 & Gate 03',
    elevators: 6,
    lastInspected: 'Yesterday'
  },
  {
    id: 'BLK-D',
    name: 'Block D',
    sector: 'Sector 2 (Parkview Terraces)',
    wings: 'Wings D1 – D4',
    totalHouses: 40,
    occupiedHouses: 35,
    vacantHouses: 5,
    residentsCount: 88,
    occupancyRate: 87.5,
    status: 'active',
    supervisor: 'Inspector R. Thorne',
    gateAccess: 'Gate 03',
    elevators: 4,
    lastInspected: 'Sep 01, 2026'
  },
  {
    id: 'BLK-E',
    name: 'Block E',
    sector: 'Sector 3 (Clubhouse Enclave)',
    wings: 'Wings E1 – E4',
    totalHouses: 40,
    occupiedHouses: 37,
    vacantHouses: 3,
    residentsCount: 91,
    occupancyRate: 92.5,
    status: 'active',
    supervisor: 'Inspector R. Thorne',
    gateAccess: 'Gate 04',
    elevators: 4,
    lastInspected: 'Aug 31, 2026'
  },
  {
    id: 'BLK-F',
    name: 'Block F',
    sector: 'Sector 4 (Executive Villas)',
    wings: 'Wings F1 – F4',
    totalHouses: 40,
    occupiedHouses: 36,
    vacantHouses: 4,
    residentsCount: 86,
    occupancyRate: 90.0,
    status: 'active',
    supervisor: 'Inspector R. Thorne',
    gateAccess: 'Gate 04',
    elevators: 4,
    lastInspected: 'Aug 30, 2026'
  }
];

export const INITIAL_HOUSES = [
  { id: 'H-A101', unitNumber: 'A-101', blockId: 'BLK-A', blockName: 'Block A', floor: '1st Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Sunita Sharma', residentPhone: '+91 98201 11203', residentEmail: 'sunita.sharma@example.com', parkingSlot: 'P-A12', intercom: '101', occupants: 4, vehicles: ['MH-02-CB-1234', 'MH-02-DF-9876'] },
  { id: 'H-A102', unitNumber: 'A-102', blockId: 'BLK-A', blockName: 'Block A', floor: '1st Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Dr. Rajesh Varma', residentPhone: '+91 98202 22304', residentEmail: 'r.varma@greenwood.in', parkingSlot: 'P-A13', intercom: '102', occupants: 3, vehicles: ['MH-02-AA-5555'] },
  { id: 'H-A103', unitNumber: 'A-103', blockId: 'BLK-A', blockName: 'Block A', floor: '1st Floor', type: '2 BHK Premium', status: 'vacant', residentName: '—', residentPhone: '—', residentEmail: '—', parkingSlot: 'P-A14', intercom: '103', occupants: 0, vehicles: [] },
  { id: 'H-A201', unitNumber: 'A-201', blockId: 'BLK-A', blockName: 'Block A', floor: '2nd Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Col. Vikram Malhotra', residentPhone: '+91 98203 33405', residentEmail: 'col.malhotra@residence.net', parkingSlot: 'P-A21', intercom: '201', occupants: 2, vehicles: ['DL-01-AX-9999'] },
  { id: 'H-A202', unitNumber: 'A-202', blockId: 'BLK-A', blockName: 'Block A', floor: '2nd Floor', type: '2 BHK Premium', status: 'occupied', residentName: 'Ananya Deshmukh', residentPhone: '+91 98204 44506', residentEmail: 'ananya.d@deshmukh.org', parkingSlot: 'P-A22', intercom: '202', occupants: 3, vehicles: ['MH-02-EZ-4411'] },
  { id: 'H-A203', unitNumber: 'A-203', blockId: 'BLK-A', blockName: 'Block A', floor: '2nd Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Priya Narang', residentPhone: '+91 98205 55607', residentEmail: 'priya.narang@innovate.co', parkingSlot: 'P-A23', intercom: '203', occupants: 4, vehicles: ['MH-02-ZZ-8822'] },
  { id: 'H-A301', unitNumber: 'A-301', blockId: 'BLK-A', blockName: 'Block A', floor: '3rd Floor', type: '4 BHK Penthouse', status: 'occupied', residentName: 'Vikramaditya Singhania', residentPhone: '+91 98206 66708', residentEmail: 'v.singhania@holding.com', parkingSlot: 'P-A31 & P-A32', intercom: '301', occupants: 5, vehicles: ['MH-01-VS-0001', 'MH-01-VS-0007'] },
  { id: 'H-A302', unitNumber: 'A-302', blockId: 'BLK-A', blockName: 'Block A', floor: '3rd Floor', type: '3 BHK Luxury', status: 'vacant', residentName: '—', residentPhone: '—', residentEmail: '—', parkingSlot: 'P-A33', intercom: '302', occupants: 0, vehicles: [] },
  { id: 'H-B101', unitNumber: 'B-101', blockId: 'BLK-B', blockName: 'Block B', floor: '1st Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Harish Mehta', residentPhone: '+91 98207 77809', residentEmail: 'hmehta@mehtacapital.in', parkingSlot: 'P-B11', intercom: '2101', occupants: 4, vehicles: ['MH-02-HM-3322'] },
  { id: 'H-B102', unitNumber: 'B-102', blockId: 'BLK-B', blockName: 'Block B', floor: '1st Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Meera Iyer', residentPhone: '+91 98208 88910', residentEmail: 'meera.iyer@fintech.io', parkingSlot: 'P-B12', intercom: '2102', occupants: 3, vehicles: ['KA-03-MY-7788'] },
  { id: 'H-B201', unitNumber: 'B-201', blockId: 'BLK-B', blockName: 'Block B', floor: '2nd Floor', type: '2 BHK Premium', status: 'occupied', residentName: 'Karan Kapoor', residentPhone: '+91 98209 99011', residentEmail: 'karan.k@studio.design', parkingSlot: 'P-B21', intercom: '2201', occupants: 2, vehicles: ['MH-02-KK-1199'] },
  { id: 'H-C101', unitNumber: 'C-101', blockId: 'BLK-C', blockName: 'Block C', floor: '1st Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Rohan Sen', residentPhone: '+91 98210 10112', residentEmail: 'rsen@globalventures.com', parkingSlot: 'P-C11', intercom: '3101', occupants: 3, vehicles: ['WB-02-RS-4567'] },
  { id: 'H-C201', unitNumber: 'C-201', blockId: 'BLK-C', blockName: 'Block C', floor: '2nd Floor', type: '3 BHK Luxury', status: 'occupied', residentName: 'Deepa Krishnan', residentPhone: '+91 98211 21213', residentEmail: 'deepa.k@ayurveda.org', parkingSlot: 'P-C21', intercom: '3201', occupants: 4, vehicles: ['TN-07-DK-8899'] },
  { id: 'H-D101', unitNumber: 'D-101', blockId: 'BLK-D', blockName: 'Block D', floor: '1st Floor', type: '4 BHK Duplex', status: 'occupied', residentName: 'Sanjay Bansal', residentPhone: '+91 98212 32314', residentEmail: 'sbansal@bansalsteel.com', parkingSlot: 'P-D11', intercom: '4101', occupants: 5, vehicles: ['HR-26-SB-0005'] }
];

export const INITIAL_RESIDENTS = [
  {
    id: 'RES-101',
    name: 'Sunita Sharma',
    avatar: 'SS',
    unitNumber: 'A-203',
    blockId: 'BLK-A',
    blockName: 'Block A',
    phone: '+91 98201 11203',
    email: 'sunita.sharma@example.com',
    category: 'Owner',
    familyCount: 4,
    vehicles: ['MH-02-CB-1234', 'MH-02-DF-9876'],
    rfidTag: 'RFID-A203-01',
    status: 'verified',
    since: 'Jan 2022',
    intercomActive: true
  },
  {
    id: 'RES-102',
    name: 'Dr. Rajesh Varma',
    avatar: 'RV',
    unitNumber: 'A-102',
    blockId: 'BLK-A',
    blockName: 'Block A',
    phone: '+91 98202 22304',
    email: 'r.varma@greenwood.in',
    category: 'Owner',
    familyCount: 3,
    vehicles: ['MH-02-AA-5555'],
    rfidTag: 'RFID-A102-01',
    status: 'verified',
    since: 'Mar 2021',
    intercomActive: true
  },
  {
    id: 'RES-103',
    name: 'Col. Vikram Malhotra',
    avatar: 'VM',
    unitNumber: 'A-201',
    blockId: 'BLK-A',
    blockName: 'Block A',
    phone: '+91 98203 33405',
    email: 'col.malhotra@residence.net',
    category: 'Owner (Rtd. Armed Forces)',
    familyCount: 2,
    vehicles: ['DL-01-AX-9999'],
    rfidTag: 'RFID-A201-01',
    status: 'verified',
    since: 'Nov 2020',
    intercomActive: true
  },
  {
    id: 'RES-104',
    name: 'Ananya Deshmukh',
    avatar: 'AD',
    unitNumber: 'A-202',
    blockId: 'BLK-A',
    blockName: 'Block A',
    phone: '+91 98204 44506',
    email: 'ananya.d@deshmukh.org',
    category: 'Tenant',
    familyCount: 3,
    vehicles: ['MH-02-EZ-4411'],
    rfidTag: 'RFID-A202-01',
    status: 'verified',
    since: 'Jul 2023',
    intercomActive: true
  },
  {
    id: 'RES-105',
    name: 'Vikramaditya Singhania',
    avatar: 'VS',
    unitNumber: 'A-301',
    blockId: 'BLK-A',
    blockName: 'Block A',
    phone: '+91 98206 66708',
    email: 'v.singhania@holding.com',
    category: 'Owner',
    familyCount: 5,
    vehicles: ['MH-01-VS-0001', 'MH-01-VS-0007'],
    rfidTag: 'RFID-A301-01',
    status: 'verified',
    since: 'Feb 2020',
    intercomActive: true
  },
  {
    id: 'RES-106',
    name: 'Harish Mehta',
    avatar: 'HM',
    unitNumber: 'B-101',
    blockId: 'BLK-B',
    blockName: 'Block B',
    phone: '+91 98207 77809',
    email: 'hmehta@mehtacapital.in',
    category: 'Owner',
    familyCount: 4,
    vehicles: ['MH-02-HM-3322'],
    rfidTag: 'RFID-B101-01',
    status: 'verified',
    since: 'Sep 2021',
    intercomActive: true
  },
  {
    id: 'RES-107',
    name: 'Meera Iyer',
    avatar: 'MI',
    unitNumber: 'B-102',
    blockId: 'BLK-B',
    blockName: 'Block B',
    phone: '+91 98208 88910',
    email: 'meera.iyer@fintech.io',
    category: 'Owner',
    familyCount: 3,
    vehicles: ['KA-03-MY-7788'],
    rfidTag: 'RFID-B102-01',
    status: 'verified',
    since: 'Jan 2023',
    intercomActive: true
  }
];

export const INITIAL_FAMILY_MEMBERS = [
  { id: 'FAM-101', residentId: 'RES-101', residentName: 'Sunita Sharma', name: 'Alok Sharma', relation: 'Spouse', phone: '+91 98201 11204', rfidTag: 'RFID-A203-02', unitNumber: 'A-203', status: 'verified' },
  { id: 'FAM-102', residentId: 'RES-101', residentName: 'Sunita Sharma', name: 'Rhea Sharma', relation: 'Daughter', phone: '+91 98201 11205', rfidTag: 'RFID-A203-03', unitNumber: 'A-203', status: 'verified' },
  { id: 'FAM-103', residentId: 'RES-101', residentName: 'Sunita Sharma', name: 'Kavita Sharma', relation: 'Mother-in-law', phone: '+91 98201 11206', rfidTag: 'RFID-A203-04', unitNumber: 'A-203', status: 'verified' },
  { id: 'FAM-104', residentId: 'RES-102', residentName: 'Dr. Rajesh Varma', name: 'Sujata Varma', relation: 'Spouse', phone: '+91 98202 22305', rfidTag: 'RFID-A102-02', unitNumber: 'A-102', status: 'verified' },
  { id: 'FAM-105', residentId: 'RES-102', residentName: 'Dr. Rajesh Varma', name: 'Arnav Varma', relation: 'Son', phone: '+91 98202 22306', rfidTag: 'RFID-A102-03', unitNumber: 'A-102', status: 'verified' },
  { id: 'FAM-106', residentId: 'RES-103', residentName: 'Col. Vikram Malhotra', name: 'Gayatri Malhotra', relation: 'Spouse', phone: '+91 98203 33406', rfidTag: 'RFID-A201-02', unitNumber: 'A-201', status: 'verified' },
  { id: 'FAM-107', residentId: 'RES-105', residentName: 'Vikramaditya Singhania', name: 'Radhika Singhania', relation: 'Spouse', phone: '+91 98206 66709', rfidTag: 'RFID-A301-02', unitNumber: 'A-301', status: 'verified' },
  { id: 'FAM-108', residentId: 'RES-105', residentName: 'Vikramaditya Singhania', name: 'Aryaman Singhania', relation: 'Son', phone: '+91 98206 66710', rfidTag: 'RFID-A301-03', unitNumber: 'A-301', status: 'verified' }
];

// 80 Realistic Workers across Security, Facilities, Housekeeping, Landscaping
export const INITIAL_EMPLOYEES = Array.from({ length: 80 }, (_, index) => {
  const i = index + 1;
  const depts = [
    { dept: 'Security & Surveillance', roles: ['Gate Security Officer', 'Perimeter Patrol Guard', 'CCTV Monitoring Specialist', 'Armed Guard', 'Turnstile Controller'] },
    { dept: 'Facilities & Engineering', roles: ['Chief Electrician', 'Plumbing Specialist', 'HVAC Technician', 'Elevator Maintenance Lead', 'Fire & Safety Tech'] },
    { dept: 'Housekeeping & Sanitization', roles: ['Floor Supervisor', 'Waste Management Handler', 'Tower Sweeper', 'Glass & Facade Cleaner', 'Sanitization Crew'] },
    { dept: 'Landscaping & Horticulture', roles: ['Senior Horticulturalist', 'Garden Maintenance Worker', 'Lawn Specialist', 'Irrigation System Tech', 'Botanical Caretaker'] }
  ];
  
  const deptObj = depts[index % depts.length];
  const roleName = deptObj.roles[index % deptObj.roles.length];
  
  const firstNames = ['Ramesh', 'Suresh', 'Deepak', 'Sunita', 'Bablu', 'Manoj', 'Kishore', 'Prakash', 'Gopal', 'Rajesh', 'Santosh', 'Vijay', 'Anil', 'Dharmendra', 'Mukesh', 'Mahesh', 'Ganesh', 'Pooja', 'Laxmi', 'Kavita'];
  const lastNames = ['Kumar', 'Singh', 'Verma', 'Patel', 'Sharma', 'Yadav', 'Bai', 'Mishra', 'Gupta', 'Shinde', 'Jadhav', 'Pawar', 'Chauhan', 'Thakur', 'Rathore', 'Gowda'];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 3) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  
  // Status distribution: 72 present, 5 absent, 3 on leave
  let todayStatus = 'present';
  let inTime = '06:00 AM';
  let outTime = '—';
  
  if (i === 12 || i === 27 || i === 41 || i === 63 || i === 78) {
    todayStatus = 'absent';
    inTime = '—';
  } else if (i === 19 || i === 52 || i === 70) {
    todayStatus = 'leave';
    inTime = '—';
  } else if (i === 8 || i === 34) {
    todayStatus = 'late';
    inTime = '06:22 AM';
  } else {
    todayStatus = 'present';
    const minutes = String(Math.floor(Math.random() * 15)).padStart(2, '0');
    inTime = `05:${50 + Math.floor(Math.random() * 9)} AM`;
  }
  
  const shifts = ['Morning (06:00 - 14:00)', 'Evening (14:00 - 22:00)', 'Night (22:00 - 06:00)'];
  const shift = shifts[index % 3];
  
  return {
    id: `WRK-${1000 + i}`,
    badgeNo: `DION-E${100 + i}`,
    name: fullName,
    avatar: `${firstName[0]}${lastName[0]}`,
    role: roleName,
    department: deptObj.dept,
    phone: `+91 98${(100 + i).toString().padStart(3, '0')} ${Math.floor(10000 + Math.random() * 90000)}`,
    aadhaar: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
    assignedLocation: index % 4 === 0 ? 'Main Gate 01' : index % 4 === 1 ? 'Tower A & B Service Bay' : index % 4 === 2 ? 'Central Garden & Amenity Deck' : 'Basement Level -1 & -2',
    shift: shift,
    dailyWage: 650 + (index % 5) * 50,
    monthlyWage: 18000 + (index % 5) * 1500,
    rating: (4.2 + (index % 8) * 0.1).toFixed(1),
    joiningDate: `202${3 + (index % 4)}-0${1 + (index % 9)}-15`,
    status: todayStatus,
    todayAttendance: {
      status: todayStatus,
      inTime: inTime,
      outTime: outTime,
      gate: 'Gate 01',
      recordedBy: 'GRD-1044'
    },
    tasksCompleted: 45 + (index % 30),
    activeTasks: index % 3 === 0 ? 1 : 0
  };
});

export const INITIAL_VISITORS = [
  {
    id: 'VIS-9081',
    name: 'Sunita Sharma',
    avatar: 'SS',
    phone: '+91 98201 55441',
    category: 'Guest / Family',
    hostResident: 'Sunita Sharma',
    hostUnit: 'A-203',
    vehicleNumber: 'MH-02-CB-1234',
    purpose: 'Personal Visit',
    gate: 'Gate 01',
    guardId: 'GRD-1044',
    entryTime: '08:02 AM',
    exitTime: '—',
    duration: '3h 21m',
    badgeNumber: 'G-104',
    status: 'inside',
    preApproved: true,
    photoUrl: ''
  },
  {
    id: 'VIS-9082',
    name: 'Rohan Deshmukh',
    avatar: 'RD',
    phone: '+91 98202 66552',
    category: 'Cab / Ride Hailing',
    hostResident: 'Col. Vikram Malhotra',
    hostUnit: 'A-201',
    vehicleNumber: 'MH-03-TC-8899',
    purpose: 'Drop off',
    gate: 'Gate 01',
    guardId: 'GRD-1044',
    entryTime: '08:45 AM',
    exitTime: '—',
    duration: '2h 38m',
    badgeNumber: 'C-209',
    status: 'inside',
    preApproved: true,
    photoUrl: ''
  },
  {
    id: 'VIS-9083',
    name: 'Amitabh Sen',
    avatar: 'AS',
    phone: '+91 98203 77663',
    category: 'Delivery / Courier',
    hostResident: 'Vikramaditya Singhania',
    hostUnit: 'A-301',
    vehicleNumber: 'MH-01-DL-4433',
    purpose: 'Express Courier Delivery',
    gate: 'Gate 02',
    guardId: 'GRD-1044',
    entryTime: '09:12 AM',
    exitTime: '09:30 AM',
    duration: '18m',
    badgeNumber: 'D-551',
    status: 'exited',
    preApproved: false,
    photoUrl: ''
  },
  {
    id: 'VIS-9084',
    name: 'Meenakshi Sundaram',
    avatar: 'MS',
    phone: '+91 98204 88774',
    category: 'Domestic Staff / Regular',
    hostResident: 'Dr. Rajesh Varma',
    hostUnit: 'A-102',
    vehicleNumber: 'Walk-in',
    purpose: 'Housekeeping Services',
    gate: 'Gate 01',
    guardId: 'GRD-1044',
    entryTime: '07:30 AM',
    exitTime: '—',
    duration: '3h 53m',
    badgeNumber: 'R-012',
    status: 'inside',
    preApproved: true,
    photoUrl: ''
  },
  {
    id: 'VIS-9085',
    name: 'Zomato Delivery (Mohd. Arif)',
    avatar: 'MA',
    phone: '+91 98205 99885',
    category: 'Food Delivery',
    hostResident: 'Ananya Deshmukh',
    hostUnit: 'A-202',
    vehicleNumber: 'MH-02-FD-1122',
    purpose: 'Food Delivery',
    gate: 'Gate 01',
    guardId: 'GRD-1044',
    entryTime: '11:05 AM',
    exitTime: '—',
    duration: '18m',
    badgeNumber: 'F-882',
    status: 'inside',
    preApproved: true,
    photoUrl: ''
  },
  {
    id: 'VIS-9086',
    name: 'Dr. Preeti Saxena',
    avatar: 'PS',
    phone: '+91 98206 11996',
    category: 'Expected / Pre-approved',
    hostResident: 'Harish Mehta',
    hostUnit: 'B-101',
    vehicleNumber: 'MH-02-PS-9900',
    purpose: 'Consultation Visit',
    gate: 'Gate 01',
    guardId: 'GRD-1044',
    entryTime: '—',
    exitTime: '—',
    duration: '—',
    badgeNumber: 'EXP-401',
    status: 'expected',
    preApproved: true,
    arrivalCode: '882194',
    photoUrl: ''
  },
  {
    id: 'VIS-9087',
    name: 'Kailash Kher (Urban Company AC)',
    avatar: 'KK',
    phone: '+91 98207 22007',
    category: 'Contractor / Technician',
    hostResident: 'Meera Iyer',
    hostUnit: 'B-102',
    vehicleNumber: 'MH-04-UC-3344',
    purpose: 'Air Conditioner Servicing',
    gate: 'Gate 01',
    guardId: 'GRD-1044',
    entryTime: '10:15 AM',
    exitTime: '—',
    duration: '1h 08m',
    badgeNumber: 'T-309',
    status: 'inside',
    preApproved: true,
    photoUrl: ''
  }
];

export const INITIAL_GATE_LOGS = [
  { id: 'LOG-8801', timestamp: '11:23 AM', type: 'ENTRY', person: 'Mohd. Arif (Zomato)', category: 'Delivery', destination: 'A-202', vehicle: 'MH-02-FD-1122', gate: 'Gate 01', guard: 'Officer C. Miller', status: 'Cleared' },
  { id: 'LOG-8802', timestamp: '10:15 AM', type: 'ENTRY', person: 'Kailash Kher (Urban Company)', category: 'Technician', destination: 'B-102', vehicle: 'MH-04-UC-3344', gate: 'Gate 01', guard: 'Officer C. Miller', status: 'Cleared' },
  { id: 'LOG-8803', timestamp: '09:30 AM', type: 'EXIT', person: 'Amitabh Sen', category: 'Courier', destination: 'A-301', vehicle: 'MH-01-DL-4433', gate: 'Gate 02', guard: 'Officer C. Miller', status: 'Exited' },
  { id: 'LOG-8804', timestamp: '09:12 AM', type: 'ENTRY', person: 'Amitabh Sen', category: 'Courier', destination: 'A-301', vehicle: 'MH-01-DL-4433', gate: 'Gate 02', guard: 'Officer C. Miller', status: 'Cleared' },
  { id: 'LOG-8805', timestamp: '08:45 AM', type: 'ENTRY', person: 'Rohan Deshmukh (Uber)', category: 'Cab', destination: 'A-201', vehicle: 'MH-03-TC-8899', gate: 'Gate 01', guard: 'Officer C. Miller', status: 'Cleared' },
  { id: 'LOG-8806', timestamp: '08:02 AM', type: 'ENTRY', person: 'Sunita Sharma', category: 'Guest', destination: 'A-203', vehicle: 'MH-02-CB-1234', gate: 'Gate 01', guard: 'Officer C. Miller', status: 'Cleared' },
  { id: 'LOG-8807', timestamp: '07:30 AM', type: 'ENTRY', person: 'Meenakshi Sundaram', category: 'Regular Staff', destination: 'A-102', vehicle: 'Walk-in', gate: 'Gate 01', guard: 'Officer C. Miller', status: 'Cleared' }
];

export const INITIAL_TASKS = [
  {
    id: 'TSK-881',
    title: 'Block A Main Elevator Sensor Recalibration',
    description: 'Inspect floor leveling error on elevator #02 in Block A. Realign optical door sensors.',
    category: 'Facilities & Engineering',
    priority: 'urgent',
    status: 'in_progress',
    assignedToId: 'WRK-1002',
    assignedToName: 'Suresh Singh',
    assignedRole: 'Elevator Maintenance Lead',
    location: 'Block A, Elevator Shaft #02',
    blockId: 'BLK-A',
    createdAt: 'Today, 08:00 AM',
    dueDate: 'Today, 02:00 PM',
    completedAt: null,
    verifiedBy: null,
    remarks: [
      { id: 'REM-1', author: 'Inspector R. Thorne', time: '08:15 AM', text: 'Spares dispatched from Central Store. Ensure power cutoff protocol.' },
      { id: 'REM-2', author: 'Suresh Singh', time: '09:30 AM', text: 'Sensor kit replaced. Calibration run in progress.' }
    ]
  },
  {
    id: 'TSK-882',
    title: 'Perimeter Sensor Array Night Diagnostic',
    description: 'Test optical IR sensors on North perimeter fence between Gate 01 and Gate 02.',
    category: 'Security & Surveillance',
    priority: 'high',
    status: 'assigned',
    assignedToId: 'WRK-1001',
    assignedToName: 'Ramesh Kumar',
    assignedRole: 'Gate Security Officer',
    location: 'North Boundary Perimeter Fence',
    blockId: 'BLK-A',
    createdAt: 'Today, 07:30 AM',
    dueDate: 'Today, 04:00 PM',
    completedAt: null,
    verifiedBy: null,
    remarks: []
  },
  {
    id: 'TSK-883',
    title: 'Clubhouse Central Lawn Aeration & Sprinkler Audit',
    description: 'Quarterly irrigation valve audit and pressure test across East lawn grounds.',
    category: 'Landscaping & Horticulture',
    priority: 'medium',
    status: 'in_progress',
    assignedToId: 'WRK-1004',
    assignedToName: 'Sunita Bai',
    assignedRole: 'Senior Horticulturalist',
    location: 'Central Clubhouse Lawn & Sector 3',
    blockId: 'BLK-E',
    createdAt: 'Today, 06:45 AM',
    dueDate: 'Today, 05:00 PM',
    completedAt: null,
    verifiedBy: null,
    remarks: []
  },
  {
    id: 'TSK-884',
    title: 'Basement -2 Sump Pump Water Level Sensor Cleaning',
    description: 'Clear sedimentation from float switch sensors in rainwater harvesting chamber.',
    category: 'Facilities & Engineering',
    priority: 'high',
    status: 'completed',
    assignedToId: 'WRK-1003',
    assignedToName: 'Deepak Verma',
    assignedRole: 'Plumbing Specialist',
    location: 'Basement Level -2, Sump Chamber 4',
    blockId: 'BLK-C',
    createdAt: 'Yesterday, 02:00 PM',
    dueDate: 'Today, 11:00 AM',
    completedAt: 'Today, 10:45 AM',
    verifiedBy: 'Inspector R. Thorne',
    remarks: [
      { id: 'REM-3', author: 'Deepak Verma', time: '10:45 AM', text: 'Chamber clear. Automatic cutoff tested and functional.' },
      { id: 'REM-4', author: 'Inspector R. Thorne', time: '11:00 AM', text: 'Inspected and signed off.' }
    ]
  },
  {
    id: 'TSK-885',
    title: 'Tower B 3rd Floor Corridor LED Fitting Replacement',
    description: 'Replace flickering emergency backup luminaire near Staircase B-2.',
    category: 'Facilities & Engineering',
    priority: 'low',
    status: 'created',
    assignedToId: 'WRK-1002',
    assignedToName: 'Suresh Singh',
    assignedRole: 'Chief Electrician',
    location: 'Tower B, 3rd Floor Corridor',
    blockId: 'BLK-B',
    createdAt: 'Today, 09:00 AM',
    dueDate: 'Tomorrow, 12:00 PM',
    completedAt: null,
    verifiedBy: null,
    remarks: []
  },
  {
    id: 'TSK-886',
    title: 'Fire Hydrant Pressure Testing (Block D & F)',
    description: 'Verify statutory 4.5 bar pressure on all riser valves and emergency hose cabinets.',
    category: 'Facilities & Engineering',
    priority: 'urgent',
    status: 'verified',
    assignedToId: 'WRK-1003',
    assignedToName: 'Deepak Verma',
    assignedRole: 'Fire & Safety Tech',
    location: 'Blocks D & F Utility Shafts',
    blockId: 'BLK-D',
    createdAt: 'Sep 01, 2026',
    dueDate: 'Sep 02, 2026',
    completedAt: 'Sep 02, 2026, 04:30 PM',
    verifiedBy: 'Commander M. Vance',
    remarks: []
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-701',
    employeeId: 'WRK-1001',
    employeeName: 'Ramesh Kumar',
    department: 'Security & Surveillance',
    amount: 19500,
    type: 'Monthly Salary (August 2026)',
    status: 'paid',
    paymentDate: 'Sep 01, 2026',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    referenceNo: 'NEFT-889920194',
    recordedBy: 'Inspector R. Thorne'
  },
  {
    id: 'PAY-702',
    employeeId: 'WRK-1002',
    employeeName: 'Suresh Singh',
    department: 'Facilities & Engineering',
    amount: 21000,
    type: 'Monthly Salary (August 2026)',
    status: 'paid',
    paymentDate: 'Sep 01, 2026',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    referenceNo: 'NEFT-889920195',
    recordedBy: 'Inspector R. Thorne'
  },
  {
    id: 'PAY-703',
    employeeId: 'WRK-1003',
    employeeName: 'Deepak Verma',
    department: 'Facilities & Engineering',
    amount: 18500,
    type: 'Monthly Salary (August 2026)',
    status: 'paid',
    paymentDate: 'Sep 01, 2026',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    referenceNo: 'NEFT-889920196',
    recordedBy: 'Inspector R. Thorne'
  },
  {
    id: 'PAY-704',
    employeeId: 'WRK-1004',
    employeeName: 'Sunita Bai',
    department: 'Landscaping & Horticulture',
    amount: 3000,
    type: 'Mid-Month Advance',
    status: 'pending',
    paymentDate: 'Due Today',
    paymentMethod: 'Cash Disbursement Voucher',
    referenceNo: 'VCH-ADV-2026-09',
    recordedBy: 'Inspector R. Thorne'
  },
  {
    id: 'PAY-705',
    employeeId: 'WRK-1005',
    employeeName: 'Bablu Sharma',
    department: 'Housekeeping & Sanitization',
    amount: 2500,
    type: 'Overtime Settlement (Patrol & Deep Cleaning)',
    status: 'pending',
    paymentDate: 'Due Today',
    paymentMethod: 'Direct Bank Transfer (UPI/NEFT)',
    referenceNo: 'VCH-OT-2026-88',
    recordedBy: 'Inspector R. Thorne'
  }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'AUD-901', timestamp: '11:23:42 AM', actor: 'Officer C. Miller (Guard)', action: 'VISITOR_CHECKIN', details: 'Authorized entry for Zomato Delivery (Mohd. Arif) to Unit A-202. Pass #F-882.', ip: '10.0.1.44 (Gate 01 Terminal)' },
  { id: 'AUD-902', timestamp: '10:45:10 AM', actor: 'Deepak Verma (Technician)', action: 'TASK_COMPLETED', details: 'Marked task TSK-884 (Sump Pump Sensor Cleaning) as Completed.', ip: '10.0.2.19 (Mobile Roster App)' },
  { id: 'AUD-903', timestamp: '10:15:00 AM', actor: 'Officer C. Miller (Guard)', action: 'VISITOR_CHECKIN', details: 'Issued digital badge T-309 to Kailash Kher (Urban Company) for Unit B-102.', ip: '10.0.1.44 (Gate 01 Terminal)' },
  { id: 'AUD-904', timestamp: '09:30:22 AM', actor: 'Officer C. Miller (Guard)', action: 'VISITOR_CHECKOUT', details: 'Recorded exit for Amitabh Sen (Courier). Surrendered pass D-551.', ip: '10.0.1.44 (Gate 01 Terminal)' },
  { id: 'AUD-905', timestamp: '08:15:00 AM', actor: 'Inspector R. Thorne (Supervisor)', action: 'TASK_ASSIGNED', details: 'Assigned priority task TSK-881 (Elevator Sensor Recalibration) to Suresh Singh.', ip: '10.0.3.11 (Supervisor Hub)' },
  { id: 'AUD-906', timestamp: '06:00:15 AM', actor: 'Commander M. Vance (Admin)', action: 'SYSTEM_LOGIN', details: 'Authenticated admin session from Central Operations Command.', ip: '10.0.0.1 (Operations Console)' }
];

export const INITIAL_SETTINGS = {
  estateName: 'Greenwood Heights Estate',
  estateAddress: 'Survey No. 42/1, Off Central Expressway, Sector 1-4',
  estateRegistration: 'REG-MH-PUN-2021-88402',
  totalArea: '48.5 Acres',
  totalUnits: 255,
  activeGates: 4,
  panicAlertsEnabled: true,
  biometricSync: true,
  smsNotifications: true,
  intercomHubStatus: 'online',
  gateNetVersion: 'v4.2.0-SECURE',
  isoCompliance: 'ISO 27001 Certified',
  morningShiftStart: '06:00',
  morningShiftEnd: '14:00',
  eveningShiftStart: '14:00',
  eveningShiftEnd: '22:00',
  nightShiftStart: '22:00',
  nightShiftEnd: '06:00'
};
