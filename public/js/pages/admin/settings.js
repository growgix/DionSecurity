import { getSettings, updateSettings } from '/public/js/api.js';

let currentSettings = {};

async function loadSettings() {
    try {
        const res = await getSettings();
        currentSettings = res.data || {};

        document.getElementById('sEstateName').value = currentSettings.estate_name || currentSettings.name || 'Dion Security Estate';
        document.getElementById('sContactEmail').value = currentSettings.contact_email || currentSettings.email || 'security@dionestate.com';
        document.getElementById('sContactPhone').value = currentSettings.contact_phone || currentSettings.phone || '+1 555-0100';
        document.getElementById('sAddress').value = currentSettings.address || '100 Dion Boulevard, Sector 4';
        document.getElementById('sGatePassExpiry').value = currentSettings.gate_pass_expiry || 24;
        document.getElementById('sMaxVisitorsUnit').value = currentSettings.max_visitors_per_unit || 10;
    } catch (err) {
        console.error('Failed to load settings:', err);
    }
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        estate_name: document.getElementById('sEstateName').value.trim(),
        contact_email: document.getElementById('sContactEmail').value.trim(),
        contact_phone: document.getElementById('sContactPhone').value.trim(),
        address: document.getElementById('sAddress').value.trim(),
        gate_pass_expiry: parseInt(document.getElementById('sGatePassExpiry').value, 10),
        max_visitors_per_unit: parseInt(document.getElementById('sMaxVisitorsUnit').value, 10)
    };

    try {
        await updateSettings(payload);
        alert('Estate configuration successfully saved.');
    } catch (err) {
        alert('Failed to save settings: ' + (err.message || 'Server error'));
    }
});

loadSettings();