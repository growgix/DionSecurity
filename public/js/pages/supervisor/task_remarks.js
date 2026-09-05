import { api } from '../../api.js';

let tasksData = [];
let allRemarks = [];

function showToast(message, type = 'success') {
    const toast = document.getElementById('remarks-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `remarks-toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

function renderFeed(remarks) {
    const container = document.getElementById('remarks-feed-list');
    const badge = document.getElementById('total-remarks-badge');
    if (badge) badge.textContent = `${remarks.length} Total Logs`;

    if (!remarks || remarks.length === 0) {
        container.innerHTML = `
            <div class="empty-feed-state">
                <span class="material-symbols-outlined">chat_bubble_outline</span>
                <span>No remarks recorded yet.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = remarks.map(rem => {
        return `
            <div class="remark-entry-card">
                <div class="remark-header-row">
                    <div class="remark-author-group">
                        <span class="material-symbols-outlined" style="font-size: 16px; color: var(--primary);">person</span>
                        <span class="remark-author-name">${escapeHtml(rem.author || 'Supervisor')}</span>
                        <span class="remark-task-pill">${escapeHtml(rem.taskId || 'TSK')}</span>
                    </div>
                    <span class="remark-time-pill">${escapeHtml(rem.time || 'Just now')}</span>
                </div>
                <div class="remark-task-title">Re: ${escapeHtml(rem.taskTitle || 'Field Task')}</div>
                <div class="remark-content-text">${escapeHtml(rem.text || '')}</div>
            </div>
        `;
    }).join('');
}

function filterRemarks() {
    const query = (document.getElementById('feed-search')?.value || '').toLowerCase().trim();
    if (!query) {
        renderFeed(allRemarks);
        return;
    }

    const filtered = allRemarks.filter(r => {
        return (r.text || '').toLowerCase().includes(query) ||
               (r.author || '').toLowerCase().includes(query) ||
               (r.taskTitle || '').toLowerCase().includes(query) ||
               (r.taskId || '').toLowerCase().includes(query);
    });

    renderFeed(filtered);
}

async function loadData() {
    try {
        const res = await api.getTasks();
        tasksData = Array.isArray(res) ? res : (res.data || []);

        const select = document.getElementById('select-task');
        const params = new URLSearchParams(window.location.search);
        const preselectedTaskId = params.get('taskId');

        if (tasksData.length === 0) {
            select.innerHTML = '<option value="">No tasks available</option>';
        } else {
            select.innerHTML = tasksData.map(t => {
                const isSel = (preselectedTaskId && String(t.id) === String(preselectedTaskId)) ? 'selected' : '';
                return `<option value="${t.id}" ${isSel}>${escapeHtml(t.id)} — ${escapeHtml(t.title)}</option>`;
            }).join('');
        }

        allRemarks = [];
        tasksData.forEach(t => {
            if (t.remarks && Array.isArray(t.remarks)) {
                t.remarks.forEach(r => {
                    allRemarks.push({
                        ...r,
                        taskId: t.id,
                        taskTitle: t.title
                    });
                });
            }
        });

        allRemarks.reverse();

        renderFeed(allRemarks);
    } catch (err) {
        showToast(`Failed to load remarks stream: ${err.message}`, 'error');
    }
}

async function handlePostRemark(e) {
    e.preventDefault();

    const taskId = document.getElementById('select-task').value;
    const author = document.getElementById('author-name').value;
    const text = document.getElementById('remark-text').value.trim();

    if (!taskId) {
        showToast('Please select a task.', 'error');
        return;
    }
    if (!text) {
        showToast('Remark text cannot be empty.', 'error');
        return;
    }

    const submitBtn = document.getElementById('btn-submit-remark');
    submitBtn.disabled = true;

    try {
        await api.addTaskRemark(taskId, { text, author });
        showToast('Observation successfully logged to task stream!', 'success');
        document.getElementById('remark-text').value = '';
        await loadData();
    } catch (err) {
        showToast(err.message || 'Failed to post remark.', 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('post-remark-form')?.addEventListener('submit', handlePostRemark);
    document.getElementById('feed-search')?.addEventListener('input', filterRemarks);
    document.getElementById('btn-refresh-remarks')?.addEventListener('click', loadData);
});