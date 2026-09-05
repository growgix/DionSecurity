/**
 * Client-Side Table Filter & Search Utility
 * Enables instant searching, row filtering, and pagination support for HTML tables.
 */
export class DionTableFilter {
    constructor(tableElementOrId, options = {}) {
        this.table = typeof tableElementOrId === 'string'
            ? document.getElementById(tableElementOrId)
            : tableElementOrId;
        this.searchInput = options.searchInput || null;
        this.filterSelect = options.filterSelect || null;
        this.filterColumn = options.filterColumn || 0;

        if (this.table) {
            this.init();
        }
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.applyFilter());
        }
        if (this.filterSelect) {
            this.filterSelect.addEventListener('change', () => this.applyFilter());
        }
    }

    applyFilter() {
        const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
        const filterVal = this.filterSelect ? this.filterSelect.value : 'all';

        const rows = this.table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const matchesQuery = query === '' || rowText.includes(query);

            let matchesFilter = true;
            if (filterVal !== 'all' && filterVal !== '') {
                const cells = row.querySelectorAll('td');
                if (cells[this.filterColumn]) {
                    matchesFilter = cells[this.filterColumn].textContent.trim().toLowerCase() === filterVal.toLowerCase();
                }
            }

            row.style.display = matchesQuery && matchesFilter ? '' : 'none';
        });
    }
}