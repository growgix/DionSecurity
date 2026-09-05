import { getEmployees, createEmployee, updateEmployee } from '/public/js/api.js';

let employees = [];

async function loadData() {
    try {
        const res = await getEmployees();
        employees = res.data || [];
        updateStats();
        renderTable();
    } catch (err) {
        console.error('Failed to load employees:', err);
        document.getElementById('workforceTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to load workforce.</td></tr>
        `;
    }
}

function updateStats() {
    document.getElementById('statTotalEmployees').textContent = employees.length;
    const active = employees.filter(e => (e.status || '').toLowerCase() === 'present').length;
    document.getElementById('statActiveEmployees').textContent = active;
    const leave = employees.filter(e => (e.status || '').toLowerCase() === 'leave' || (e.status || '').toLowerCase() === 'absent').length;
    document.getElementById('statLeaveEmployees').textContent = leave;
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const roleFilter = document.getElementById('roleFilter').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();

    const filtered = employees.filter(e => {
        const name = (e.name || '').toLowerCase();
        const id = (e.id || '').toLowerCase();
        const role = (e.role || '').toLowerCase();
        const phone = (e.phone || '').toLowerCase();
        const status = (e.status || '').toLowerCase();

        const matchesSearch = !search || name.includes(search) || id.includes(search) || role.includes(search) || phone.includes(search);
        const matchesRole = !roleFilter || role.includes(roleFilter);
        const matchesStatus = !statusFilter || status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const tbody = document.getElementById('workforceTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No personnel found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(e => {
        const st = (e.status || '').toLowerCase();
        let badge = 'bg-secondary-subtle text-secondary';
        if (st === 'present') badge = 'bg-success-subtle text-success';
        else if (st === 'leave') badge = 'bg-warning-subtle text-warning';
        else if (st === 'absent') badge = 'bg-danger-subtle text-danger';
        else if (st === 'late') badge = 'bg-info-subtle text-info';

        return `
            <tr>
                <td><code>${escapeHtml(e.id)}</code></td>
                <td>
                    <div class="fw-bold">${escapeHtml(e.name || 'Unnamed')}</div>
                    <small class="text-muted">${escapeHtml(e.email || '')}</small>
                </td>
                <td><span class="badge bg-light text-dark border">${escapeHtml(e.role || 'Guard')}</span></td>
                <td>${escapeHtml(e.phone || '-')}</td>
                <td>${escapeHtml(e.assigned_area || e.shift || 'Gate Operations')}</td>
                <td><span class="badge ${badge}">${escapeHtml(e.status || 'Active')}</span></td>
                <td class="text-end">
                    <a href="/pages/admin/employee_profile.php?id=${e.id}" class="btn btn-sm btn-outline-secondary me-1" title="View Profile">
                        <span class="material-icons-outlined" style="font-size:16px;">visibility</span>
                    </a>
                    <button class="btn btn-sm btn-outline-primary edit-emp-btn" data-id="${e.id}" title="Edit Roster">
                        <span class="material-icons-outlined" style="font-size:16px;">edit</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    attachActions();
}

function attachActions() {
    document.querySelectorAll('.edit-emp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const emp = employees.find(e => String(e.id) === String(id));
            if (emp) openModal(emp);
        });
    });
}

function openModal(emp = null) {
    document.getElementById('empId').value = emp ? emp.id : '';
    document.getElementById('empModalTitle').textContent = emp ? `Edit Personnel (${emp.id})` : 'Register Personnel';
    document.getElementById('eName').value = emp ? (emp.name || '') : '';
    document.getElementById('eRole').value = emp ? (emp.role || 'Guard') : 'Guard';
    document.getElementById('eStatus').value = emp ? (emp.status || 'present') : 'present';
    document.getElementById('ePhone').value = emp ? (emp.phone || '') : '';
    document.getElementById('eEmail').value = emp ? (emp.email || '') : '';
    document.getElementById('eShift').value = emp ? (emp.shift || 'Morning') : 'Morning';

    document.getElementById('employeeModal').style.display = 'block';
    document.getElementById('modalBackdrop').style.display = 'block';
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
}

document.getElementById('addEmployeeBtn').addEventListener('click', () => openModal());
document.getElementById('closeEmpModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelEmpModalBtn').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);

document.getElementById('empForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('empId').value;
    const payload = {
        name: document.getElementById('eName').value.trim(),
        role: document.getElementById('eRole').value,
        status: document.getElementById('eStatus').value,
        phone: document.getElementById('ePhone').value.trim(),
        email: document.getElementById('eEmail').value.trim(),
        shift: document.getElementById('eShift').value
    };

    try {
        if (id) {
            await updateEmployee(id, payload);
            employees = employees.map(item => String(item.id) === String(id) ? { ...item, ...payload } : item);
        } else {
            const res = await createEmployee(payload);
            employees.push(res.data);
        }
        closeModal();
        updateStats();
        renderTable();
    } catch (err) {
        alert('Failed to save personnel: ' + (err.message || 'Server error'));
    }
});

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('roleFilter').addEventListener('change', renderTable);
document.getElementById('statusFilter').addEventListener('change', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();