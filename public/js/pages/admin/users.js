import { getUsers, createUser } from '/public/js/api.js';

let users = [];

async function loadData() {
    try {
        const res = await getUsers();
        users = res.data || [];
        updateStats();
        renderTable();
    } catch (err) {
        console.error('Failed to load users:', err);
        document.getElementById('usersTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to load user accounts.</td></tr>
        `;
    }
}

function updateStats() {
    document.getElementById('statTotalUsers').textContent = users.length;
    const admins = users.filter(u => (u.role || '').toLowerCase() === 'admin').length;
    document.getElementById('statAdminUsers').textContent = admins;
    const staff = users.filter(u => (u.role || '').toLowerCase() !== 'admin').length;
    document.getElementById('statStaffUsers').textContent = staff;
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const roleFilter = document.getElementById('roleFilter').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();

    const filtered = users.filter(u => {
        const name = (u.name || '').toLowerCase();
        const username = (u.username || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const role = (u.role || '').toLowerCase();
        const st = (u.status || 'active').toLowerCase();

        const matchesSearch = !search || name.includes(search) || username.includes(search) || email.includes(search);
        const matchesRole = !roleFilter || role === roleFilter;
        const matchesStatus = !statusFilter || st === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const tbody = document.getElementById('usersTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No accounts match criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(u => {
        const role = (u.role || 'guard').toLowerCase();
        let roleBadge = 'bg-secondary-subtle text-secondary';
        if (role === 'admin') roleBadge = 'bg-danger-subtle text-danger';
        else if (role === 'supervisor') roleBadge = 'bg-warning-subtle text-warning';
        else if (role === 'guard') roleBadge = 'bg-primary-subtle text-primary';

        return `
            <tr>
                <td>
                    <strong>${escapeHtml(u.name || u.username)}</strong>
                    <div class="text-muted small">@${escapeHtml(u.username)}</div>
                </td>
                <td><span class="badge ${roleBadge}">${escapeHtml(u.role || 'Guard')}</span></td>
                <td>${escapeHtml(u.email || '-')}</td>
                <td>${escapeHtml(u.phone || '-')}</td>
                <td><span class="badge bg-success-subtle text-success">${escapeHtml(u.status || 'Active')}</span></td>
                <td><small>${escapeHtml(u.created_at ? u.created_at.substring(0,10) : '-')}</small></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-secondary me-1" title="User Details" disabled>
                        <span class="material-icons-outlined" style="font-size:16px;">lock</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openModal() {
    document.getElementById('userId').value = '';
    document.getElementById('uName').value = '';
    document.getElementById('uUsername').value = '';
    document.getElementById('uRole').value = 'guard';
    document.getElementById('uEmail').value = '';
    document.getElementById('uPhone').value = '';
    document.getElementById('uPassword').value = '';

    document.getElementById('userModal').style.display = 'block';
    document.getElementById('modalBackdrop').style.display = 'block';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
}

document.getElementById('addUserBtn').addEventListener('click', openModal);
document.getElementById('closeUserModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelUserModalBtn').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('uName').value.trim(),
        username: document.getElementById('uUsername').value.trim(),
        role: document.getElementById('uRole').value,
        email: document.getElementById('uEmail').value.trim(),
        phone: document.getElementById('uPhone').value.trim(),
        password: document.getElementById('uPassword').value
    };

    if (!payload.password) {
        alert('Password is required for new accounts');
        return;
    }

    try {
        const res = await createUser(payload);
        users.push(res.data || { id: Date.now(), ...payload });
        closeModal();
        updateStats();
        renderTable();
    } catch (err) {
        alert('Failed to create user: ' + (err.message || 'Server error'));
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