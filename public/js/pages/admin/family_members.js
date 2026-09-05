import { getFamilyMembers, getResidents } from '/public/js/api.js';

let familyMembers = [];
let residents = [];

async function loadData() {
    try {
        const [famRes, resRes] = await Promise.all([
            getFamilyMembers(),
            getResidents()
        ]);
        familyMembers = famRes.data || [];
        residents = resRes.data || [];

        populateResidentFilters();
        renderTable();
    } catch (err) {
        console.error('Failed to load family members:', err);
        document.getElementById('familyTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to load family members.</td></tr>
        `;
    }
}

function populateResidentFilters() {
    const filter = document.getElementById('residentFilter');
    const modalSelect = document.getElementById('famResidentId');
    filter.innerHTML = '<option value="">All Primary Residents</option>';
    modalSelect.innerHTML = '<option value="">Select Resident...</option>';

    residents.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = `${r.name} (${r.house_unit_number || 'Unit ' + (r.house_id || '')})`;
        filter.appendChild(opt);

        const opt2 = document.createElement('option');
        opt2.value = r.id;
        opt2.textContent = `${r.name} (${r.house_unit_number || 'Unit ' + (r.house_id || '')})`;
        modalSelect.appendChild(opt2);
    });
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const resFilter = document.getElementById('residentFilter').value;

    const filtered = familyMembers.filter(m => {
        const name = (m.name || '').toLowerCase();
        const rel = (m.relation || m.relationship || '').toLowerCase();
        const primary = (m.resident_name || '').toLowerCase();
        const matchesSearch = !search || name.includes(search) || rel.includes(search) || primary.includes(search);
        const matchesRes = !resFilter || String(m.resident_id) === String(resFilter);
        return matchesSearch && matchesRes;
    });

    const tbody = document.getElementById('familyTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No family members found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(m => `
        <tr>
            <td><strong>${escapeHtml(m.name || 'Unknown')}</strong></td>
            <td>${escapeHtml(m.resident_name || 'Primary Resident #' + (m.resident_id || ''))}</td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(m.unit_number || m.house_unit_number || '-')}</span></td>
            <td><span class="badge bg-info-subtle text-info">${escapeHtml(m.relation || m.relationship || 'Dependent')}</span></td>
            <td>${escapeHtml(m.phone || '-')}</td>
            <td><code>${escapeHtml(m.access_card || m.card_number || 'N/A')}</code></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary edit-family-btn" data-id="${m.id}">
                    <span class="material-icons-outlined" style="font-size:16px;">edit</span>
                </button>
            </td>
        </tr>
    `).join('');

    attachActions();
}

function attachActions() {
    document.querySelectorAll('.edit-family-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const member = familyMembers.find(m => String(m.id) === String(id));
            if (member) openModal(member);
        });
    });
}

function openModal(member = null) {
    document.getElementById('familyId').value = member ? member.id : '';
    document.getElementById('familyModalTitle').textContent = member ? 'Edit Family Member' : 'Add Family Member';
    document.getElementById('famName').value = member ? (member.name || '') : '';
    document.getElementById('famResidentId').value = member ? (member.resident_id || '') : '';
    document.getElementById('famRelation').value = member ? (member.relation || member.relationship || 'Spouse') : 'Spouse';
    document.getElementById('famPhone').value = member ? (member.phone || '') : '';
    document.getElementById('famCard').value = member ? (member.access_card || member.card_number || '') : '';

    document.getElementById('familyModal').style.display = 'block';
    document.getElementById('modalBackdrop').style.display = 'block';
}

function closeModal() {
    document.getElementById('familyModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
}

document.getElementById('addFamilyBtn').addEventListener('click', () => openModal());
document.getElementById('closeFamilyModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelFamilyModalBtn').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);

document.getElementById('familyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('familyId').value;
    const payload = {
        name: document.getElementById('famName').value.trim(),
        resident_id: document.getElementById('famResidentId').value,
        relation: document.getElementById('famRelation').value,
        phone: document.getElementById('famPhone').value.trim(),
        access_card: document.getElementById('famCard').value.trim()
    };

    try {
        // We make a fetch call via family members API
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const url = id ? `/api/family-members/${id}` : '/api/family-members';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || 'Operation failed');
        }

        if (id) {
            familyMembers = familyMembers.map(m => String(m.id) === String(id) ? { ...m, ...payload } : m);
        } else {
            familyMembers.push(data.data || { id: Date.now(), ...payload });
        }
        closeModal();
        renderTable();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('residentFilter').addEventListener('change', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();