import { getResidents, createResident, updateResident, deleteResident, getHouses, getFamilyMembers } from '/public/js/api.js';

let residents = [];
let houses = [];
let familyMembers = [];

async function loadData() {
    try {
        const [resRes, houseRes, famRes] = await Promise.all([
            getResidents(),
            getHouses(),
            getFamilyMembers().catch(() => ({ success: true, data: [] }))
        ]);

        residents = resRes.data || [];
        houses = houseRes.data || [];
        familyMembers = famRes.data || [];

        populateHouseFilters();
        updateStats();
        renderTable();
    } catch (err) {
        console.error('Error loading residents:', err);
        document.getElementById('residentsTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to load residents.</td></tr>
        `;
    }
}

function updateStats() {
    document.getElementById('statTotalResidents').textContent = residents.length;
    document.getElementById('statFamilyCount').textContent = familyMembers.length;
    const occupied = new Set(residents.map(r => r.unitNumber || r.unit_number || r.house_id || r.house_unit_number).filter(Boolean)).size;
    document.getElementById('statOccupiedUnits').textContent = occupied;
}

function populateHouseFilters() {
    const filter = document.getElementById('houseFilter');
    const modalSelect = document.getElementById('resHouseId');
    filter.innerHTML = '<option value="">All Houses</option>';
    modalSelect.innerHTML = '<option value="">Select House...</option>';

    houses.forEach(h => {
        const opt1 = document.createElement('option');
        opt1.value = h.id || h.unit_number;
        opt1.textContent = `${h.unit_number} (${h.block_name || 'Block ' + (h.block_id || '')})`;
        filter.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = h.unit_number || h.id;
        opt2.textContent = `${h.unit_number} (${h.block_name || 'Block ' + (h.block_id || '')})`;
        modalSelect.appendChild(opt2);
    });
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const houseFilter = document.getElementById('houseFilter').value;
    const occFilter = document.getElementById('occupancyFilter').value;

    const filtered = residents.filter(r => {
        const name = (r.name || '').toLowerCase();
        const phone = (r.phone || '').toLowerCase();
        const email = (r.email || '').toLowerCase();
        const house = (r.unitNumber || r.unit_number || r.house_unit_number || '').toLowerCase();
        const cat = (r.category || r.occupancy_type || '').toLowerCase();

        const matchesSearch = !search || name.includes(search) || phone.includes(search) || email.includes(search) || house.includes(search);
        const matchesHouse = !houseFilter || (String(r.unitNumber) === String(houseFilter) || String(r.unit_number) === String(houseFilter) || String(r.house_id) === String(houseFilter) || String(r.house_unit_number) === String(houseFilter));
        const matchesOcc = !occFilter || cat === occFilter;

        return matchesSearch && matchesHouse && matchesOcc;
    });

    const tbody = document.getElementById('residentsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No residents found matching criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>
                <div class="fw-bold">${escapeHtml(r.name || 'Unknown')}</div>
            </td>
            <td>
                <span class="badge bg-light text-dark border">${escapeHtml(r.unitNumber || r.unit_number || r.house_unit_number || 'N/A')}</span>
            </td>
            <td>${escapeHtml(r.phone || '-')}</td>
            <td>${escapeHtml(r.email || '-')}</td>
            <td>
                <span class="badge ${(r.category?.toLowerCase() === 'owner' || r.occupancy_type === 'owner') ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary'}">
                    ${escapeHtml(r.category || r.occupancy_type || 'Owner')}
                </span>
            </td>
            <td>${escapeHtml(r.since || r.move_in_date || (r.created_at ? r.created_at.substring(0,10) : '-'))}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1 edit-resident-btn" data-id="${r.id}">
                    <span class="material-icons-outlined" style="font-size:16px;">edit</span>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-resident-btn" data-id="${r.id}">
                    <span class="material-icons-outlined" style="font-size:16px;">delete</span>
                </button>
            </td>
        </tr>
    `).join('');

    attachTableActions();
}

function attachTableActions() {
    document.querySelectorAll('.edit-resident-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const res = residents.find(r => String(r.id) === String(id));
            if (res) openModal(res);
        });
    });

    document.querySelectorAll('.delete-resident-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to remove this resident?')) {
                try {
                    await deleteResident(id);
                    residents = residents.filter(r => String(r.id) !== String(id));
                    updateStats();
                    renderTable();
                } catch (err) {
                    alert('Failed to delete resident: ' + (err.message || 'Server error'));
                }
            }
        });
    });
}

function openModal(res = null) {
    document.getElementById('residentId').value = res ? res.id : '';
    document.getElementById('residentModalTitle').textContent = res ? 'Edit Resident' : 'Add Resident';
    document.getElementById('resName').value = res ? (res.name || '') : '';
    document.getElementById('resHouseId').value = res ? (res.unit_number || res.unitNumber || res.house_unit_number || res.house_id || '') : '';
    document.getElementById('resPhone').value = res ? (res.phone || '') : '';
    document.getElementById('resEmail').value = res ? (res.email || '') : '';
    document.getElementById('resOccupancy').value = res ? (res.category?.toLowerCase() || res.occupancy_type || 'owner') : 'owner';
    document.getElementById('resMoveIn').value = res ? (res.move_in_date || '') : '';
    document.getElementById('resEmergency').value = res ? (res.emergency_contact || '') : '';

    document.getElementById('residentModal').style.display = 'block';
    document.getElementById('modalBackdrop').style.display = 'block';
}

function closeModal() {
    document.getElementById('residentModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
}

document.getElementById('addResidentBtn').addEventListener('click', () => openModal());
document.getElementById('closeResidentModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelResidentModalBtn').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);

document.getElementById('residentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('residentId').value;
    const unitVal = document.getElementById('resHouseId').value;
    const catVal = document.getElementById('resOccupancy').value;
    const categoryName = (catVal === 'tenant' || catVal === 'Tenant') ? 'Tenant' : 'Owner';
    const payload = {
        name: document.getElementById('resName').value.trim(),
        unitNumber: unitVal,
        category: categoryName,
        phone: document.getElementById('resPhone').value.trim(),
        email: document.getElementById('resEmail').value.trim(),
        emergency_contact: document.getElementById('resEmergency').value.trim()
    };

    try {
        if (id) {
            residents = residents.map(r => String(r.id) === String(id) ? { ...r, ...payload, unit_number: unitVal, occupancy_type: catVal } : r);
        } else {
            const res = await createResident(payload);
            residents.push(res.data);
        }
        closeModal();
        updateStats();
        renderTable();
    } catch (err) {
        alert('Failed to save resident: ' + (err.message || 'Server error'));
    }
});

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('houseFilter').addEventListener('change', renderTable);
document.getElementById('occupancyFilter').addEventListener('change', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();