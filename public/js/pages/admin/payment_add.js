import { createPayment, getEmployees } from '/public/js/api.js';

let employees = [];

async function loadFormData() {
    try {
        const empRes = await getEmployees();
        employees = empRes.data || [];

        const empSelect = document.getElementById('pEmployee');
        empSelect.innerHTML = '<option value="">Select Workforce Personnel...</option>';
        employees.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = `${e.name} (${e.id} - ${e.role || 'Security Staff'})`;
            empSelect.appendChild(opt);
        });
    } catch (err) {
        console.error('Failed to populate employee options:', err);
    }
}

document.getElementById('paymentAddForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const empId = document.getElementById('pEmployee').value;
    const emp = employees.find(e => String(e.id) === String(empId));
    const amount = parseFloat(document.getElementById('pAmount').value);
    const paymentType = document.getElementById('pType').value;
    const paymentMode = document.getElementById('pMethod').value;
    const remarks = document.getElementById('pRemarks').value.trim();

    if (!emp) {
        alert('Please select a workforce beneficiary.');
        return;
    }

    const payload = {
        employeeId: emp.id,
        employeeName: emp.name,
        amount: amount,
        type: paymentType,
        mode: paymentMode,
        remarks: remarks || 'Wage disbursement voucher processed'
    };

    try {
        await createPayment(payload);
        alert('Disbursement voucher recorded successfully!');
        window.location.href = '/pages/admin/payments.php';
    } catch (err) {
        alert('Failed to record payment voucher: ' + (err.message || 'Server error'));
    }
});

loadFormData();