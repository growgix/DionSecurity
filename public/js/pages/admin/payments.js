import { getPayments } from '/public/js/api.js';

let payments = [];

async function loadData() {
    try {
        const res = await getPayments();
        payments = res.data || [];
        updateStats();
        renderTable();
    } catch (err) {
        console.error('Failed to load payments:', err);
        document.getElementById('paymentsTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to load payments record.</td></tr>
        `;
    }
}

function updateStats() {
    let total = 0;
    const beneficiaries = new Set();
    payments.forEach(p => {
        total += parseFloat(p.amount || 0);
        if (p.employeeId || p.employee_id || p.employeeName) {
            beneficiaries.add(p.employeeId || p.employee_id || p.employeeName);
        }
    });

    document.getElementById('statTotalAmount').textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('statTxnCount').textContent = payments.length;
    document.getElementById('statUnitsPaying').textContent = beneficiaries.size;
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const typeFilter = document.getElementById('typeFilter').value.toLowerCase();

    const filtered = payments.filter(p => {
        const empName = (p.employeeName || p.employee_name || '').toLowerCase();
        const empId = (p.employeeId || p.employee_id || '').toLowerCase();
        const ref = (p.referenceNo || p.reference_no || String(p.id)).toLowerCase();
        const type = (p.type || p.payment_type || '').toLowerCase();

        const matchesSearch = !search || empName.includes(search) || empId.includes(search) || ref.includes(search);
        const matchesType = !typeFilter || type.includes(typeFilter);

        return matchesSearch && matchesType;
    });

    const tbody = document.getElementById('paymentsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No disbursement vouchers match your criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(p => {
        const amt = parseFloat(p.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const refNum = p.referenceNo || p.reference_no || ('VCH-' + p.id);
        const officerName = p.employeeName || p.employee_name || 'Workforce Staff';
        const officerId = p.employeeId || p.employee_id || 'WRK';
        const payType = p.type || p.payment_type || 'Monthly Salary';
        const payMode = p.mode || p.payment_method || 'NEFT / Direct Bank';
        const payDate = p.paymentDate || p.payment_date || (p.created_at ? p.created_at.substring(0,10) : '-');
        const status = p.status || 'paid';

        return `
            <tr>
                <td><code>${escapeHtml(refNum)}</code></td>
                <td>
                    <strong>${escapeHtml(officerName)}</strong>
                    <div><span class="badge bg-light text-dark border">${escapeHtml(officerId)}</span></div>
                </td>
                <td><span class="badge bg-light text-dark">${escapeHtml(payType)}</span></td>
                <td><strong class="text-success">$${amt}</strong></td>
                <td>${escapeHtml(payMode)}</td>
                <td><small>${escapeHtml(payDate)}</small></td>
                <td><span class="badge bg-success-subtle text-success">${escapeHtml(status.toUpperCase())}</span></td>
            </tr>
        `;
    }).join('');
}

function formatMethod(method) {
    if (!method) return 'Bank Transfer';
    const m = String(method).toLowerCase();
    if (m.includes('transfer')) return 'Bank Transfer';
    if (m.includes('cash')) return 'Cash';
    if (m.includes('card')) return 'Card / POS';
    if (m.includes('cheque')) return 'Cheque';
    return escapeHtml(method);
}

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('typeFilter').addEventListener('change', renderTable);
document.getElementById('methodFilter').addEventListener('change', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();