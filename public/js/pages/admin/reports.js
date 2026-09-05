import { getBlocks, getHouses, getResidents, getVisitors, getEmployees, getTasks, getPayments, getAuditLogs, getUsers, getFamilyMembers } from '/public/js/api.js';

async function generateReport() {
    try {
        const [
            blocksRes, housesRes, resRes, visRes, empRes, taskRes, payRes, auditRes, userRes, famRes
        ] = await Promise.all([
            getBlocks().catch(() => ({ data: [] })),
            getHouses().catch(() => ({ data: [] })),
            getResidents().catch(() => ({ data: [] })),
            getVisitors().catch(() => ({ data: [] })),
            getEmployees().catch(() => ({ data: [] })),
            getTasks().catch(() => ({ data: [] })),
            getPayments().catch(() => ({ data: [] })),
            getAuditLogs().catch(() => ({ data: [] })),
            getUsers().catch(() => ({ data: [] })),
            getFamilyMembers().catch(() => ({ data: [] }))
        ]);

        const houses = housesRes.data || [];
        const residents = resRes.data || [];
        const visitors = visRes.data || [];
        const payments = payRes.data || [];
        const blocks = blocksRes.data || [];
        const family = famRes.data || [];
        const workforce = empRes.data || [];
        const tasks = taskRes.data || [];
        const audits = auditRes.data || [];
        const users = userRes.data || [];

        document.getElementById('repUnits').textContent = houses.length;
        document.getElementById('repResidents').textContent = residents.length;
        document.getElementById('repVisits').textContent = visitors.length;

        let total = 0;
        payments.forEach(p => total += parseFloat(p.amount || 0));
        document.getElementById('repCollections').textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        document.getElementById('repBlocks').textContent = `${blocks.length} Blocks`;
        document.getElementById('repFamily').textContent = `${family.length} Dependents`;
        document.getElementById('repWorkforce').textContent = `${workforce.length} Personnel`;
        document.getElementById('repTasks').textContent = `${tasks.length} Directives`;

        document.getElementById('repAudits').textContent = `${audits.length} Events`;
        const admins = users.filter(u => (u.role || '').toLowerCase() === 'admin').length;
        document.getElementById('repAdmins').textContent = `${admins} Admins`;

    } catch (err) {
        console.error('Failed to generate report metrics:', err);
    }
}

document.getElementById('printReportBtn').addEventListener('click', () => {
    window.print();
});

generateReport();