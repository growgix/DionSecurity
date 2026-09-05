import { api } from '../../api.js';

async function loadProfileMetrics() {
    try {
        const [empRes, taskRes] = await Promise.all([
            api.getEmployees().catch(() => ({ data: [] })),
            api.getTasks().catch(() => ({ data: [] }))
        ]);

        const employees = Array.isArray(empRes) ? empRes : (empRes.data || []);
        const tasks = Array.isArray(taskRes) ? taskRes : (taskRes.data || []);

        const empElem = document.getElementById('profile-emp-count');
        if (empElem) {
            empElem.textContent = `${employees.length} Personnel Enrolled`;
        }

        const taskElem = document.getElementById('profile-task-count');
        if (taskElem) {
            taskElem.textContent = `${tasks.length} Operational Tasks`;
        }
    } catch (err) {
        console.error('Failed to load profile metrics:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfileMetrics();
});