import { getVisitors } from '/public/js/api.js';

async function loadDetails() {
    const params = new URLSearchParams(window.location.search);
    const visitorId = params.get('id');

    if (!visitorId) {
        document.getElementById('visitorName').textContent = 'Visitor Not Found';
        return;
    }

    try {
        const res = await getVisitors();
        const visitors = res.data || [];
        const v = visitors.find(item => String(item.id) === String(visitorId));

        if (!v) {
            document.getElementById('visitorName').textContent = 'Visitor #' + visitorId + ' Not Found';
            return;
        }

        document.getElementById('visitorName').textContent = v.name || 'Visitor Details';
        document.getElementById('visitorSubtext').textContent = 'Visitor Record #' + v.id;

        const isInside = (v.status || '').toLowerCase() === 'inside' || (v.status || '').toLowerCase() === 'checked_in';
        const badgeElem = document.getElementById('visitorStatusBadge');
        if (isInside) {
            badgeElem.innerHTML = '<span class="badge bg-success-subtle text-success fs-6">Currently Inside Estate</span>';
        } else if ((v.status || '').toLowerCase() === 'expected') {
            badgeElem.innerHTML = '<span class="badge bg-warning-subtle text-warning fs-6">Expected / Pre-cleared</span>';
        } else {
            badgeElem.innerHTML = '<span class="badge bg-secondary-subtle text-secondary fs-6">Checked Out</span>';
        }

        document.getElementById('dName').textContent = v.name || '-';
        document.getElementById('dPhone').textContent = v.phone || 'No phone recorded';
        document.getElementById('dBadge').textContent = v.badge_number || v.id_card_number || 'N/A';
        document.getElementById('dPurpose').textContent = v.purpose || 'General';
        document.getElementById('dVehicle').textContent = v.vehicle_number || v.vehicle_plate || 'None (Pedestrian)';

        document.getElementById('dHost').textContent = v.resident_name || v.host_name || 'Resident';
        document.getElementById('dUnit').textContent = v.house_unit_number || v.unit_number || 'Estate Wide';

        document.getElementById('dCheckIn').textContent = v.check_in_time || v.created_at || 'Pending';
        document.getElementById('dCheckOut').textContent = v.check_out_time || (isInside ? 'Still on premises' : '-');
        document.getElementById('dRemarks').textContent = v.remarks || v.notes || 'No remarks recorded by gate operator.';

    } catch (err) {
        console.error('Failed to load visitor details:', err);
    }
}

loadDetails();