/**
 * Core Application Utilities
 * Layout loading, UI helpers, validation, and shared functionality
 */

/** Detect base path for assets (root vs pages/ subfolder) */
const BASE_PATH = window.location.pathname.includes('/pages/') ? '..' : '.';

/** Current page identifier for sidebar active state */
const CURRENT_PAGE = document.body.dataset.page || 'dashboard';

/**
 * Load HTML component into a container element
 */
async function loadComponent(selector, path) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const response = await fetch(`${BASE_PATH}/${path}`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    container.innerHTML = await response.text();
  } catch (error) {
    console.error('Component load error:', error);
  }
}

/**
 * Initialize shared layout (sidebar, navbar, modal, toast)
 */
async function initLayout() {
  await Promise.all([
    loadComponent('#sidebar-container', 'components/sidebar.html'),
    loadComponent('#navbar-container', 'components/navbar.html'),
    loadComponent('#modal-container', 'components/modal.html'),
    loadComponent('#toast-mount', 'components/toast.html'),
  ]);

  initSidebar();
  initMobileMenu();
  initGlobalSearch();
}

/** Highlight active sidebar link */
function initSidebar() {
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach((link) => {
    if (link.dataset.page === CURRENT_PAGE) {
      link.classList.add('active');
    }
  });
}

/** Mobile sidebar toggle */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.createElement('div');

  overlay.className = 'sidebar-overlay';
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:45;display:none;';

  document.body.appendChild(overlay);

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay.style.display = sidebar?.classList.contains('open') ? 'block' : 'none';
  });

  overlay.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay.style.display = 'none';
  });
}

/** Global search — filters table rows on current page */
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const table = document.querySelector('.data-table tbody');
    if (!table) return;

    table.querySelectorAll('tr').forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/* ========== Loading State ========== */

function showLoading() {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
  }
  overlay.classList.add('active');
}

function hideLoading() {
  document.getElementById('loading-overlay')?.classList.remove('active');
}

/* ========== Toast Notifications ========== */

function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toast-list');
  if (!container) return;

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ========== Modal Dialog ========== */

function showModal(title, bodyHtml, footerHtml = '') {
  const overlay = document.getElementById('modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  const footerEl = document.getElementById('modal-footer');

  if (!overlay) return;

  titleEl.textContent = title;
  bodyEl.innerHTML = bodyHtml;
  footerEl.innerHTML = footerHtml;
  overlay.classList.add('active');

  overlay.querySelector('.modal-close')?.addEventListener('click', hideModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideModal();
  });
}

function hideModal() {
  document.getElementById('modal-overlay')?.classList.remove('active');
}

/** Confirmation dialog — returns Promise<boolean> */
function confirmDialog(message, title = 'Confirm Action') {
  return new Promise((resolve) => {
    showModal(
      title,
      `<p style="color:var(--zoo-text-dim);font-size:0.9rem;">${escapeHtml(message)}</p>`,
      `
        <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
        <button class="btn btn-danger" id="modal-confirm">Confirm</button>
      `
    );

    document.getElementById('modal-cancel')?.addEventListener('click', () => {
      hideModal();
      resolve(false);
    });

    document.getElementById('modal-confirm')?.addEventListener('click', () => {
      hideModal();
      resolve(true);
    });
  });
}

/* ========== Formatting Helpers ========== */

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount ?? 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}

/** Health status badge HTML */
function healthBadge(status) {
  const map = {
    Healthy: 'badge-healthy',
    Sick: 'badge-sick',
    Critical: 'badge-critical',
  };
  const cls = map[status] || 'badge-info';
  return `<span class="badge ${cls}">${escapeHtml(status)}</span>`;
}

/* ========== Form Validation ========== */

function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('[data-required]');

  fields.forEach((field) => {
    const errorEl = field.parentElement.querySelector('.form-error');
    field.classList.remove('error');

    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
      if (errorEl) errorEl.textContent = 'This field is required';
    } else if (errorEl) {
      errorEl.textContent = '';
    }

    if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      isValid = false;
      field.classList.add('error');
      if (errorEl) errorEl.textContent = 'Invalid email address';
    }

    if (field.type === 'number' && field.min && parseFloat(field.value) < parseFloat(field.min)) {
      isValid = false;
      field.classList.add('error');
      if (errorEl) errorEl.textContent = `Minimum value is ${field.min}`;
    }
  });

  return isValid;
}

/** Serialize form data to object */
function serializeForm(form) {
  const data = {};
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field?.type === 'number') {
      data[key] = value ? parseFloat(value) : 0;
    } else if (field?.type === 'checkbox') {
      data[key] = field.checked;
    } else {
      data[key] = value;
    }
  });

  return data;
}

/* ========== Table Sorting ========== */

function initTableSort(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const headers = table.querySelectorAll('th[data-sort]');
  let currentSort = { key: null, asc: true };

  headers.forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      currentSort.asc = currentSort.key === key ? !currentSort.asc : true;
      currentSort.key = key;

      headers.forEach((h) => h.classList.remove('sorted'));
      th.classList.add('sorted');

      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        const aVal = a.dataset[key] ?? a.cells[th.cellIndex]?.textContent ?? '';
        const bVal = b.dataset[key] ?? b.cells[th.cellIndex]?.textContent ?? '';
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
        return currentSort.asc ? cmp : -cmp;
      });

      rows.forEach((row) => tbody.appendChild(row));
    });
  });
}

/* ========== Chart.js Defaults ========== */

function initChartDefaults() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = '#6b9080';
  Chart.defaults.borderColor = 'rgba(74, 222, 128, 0.1)';
  Chart.defaults.font.family = "'Inter', sans-serif";

  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 16;
}

/** Safe async wrapper with loading + error toast */
async function withLoading(asyncFn, errorMessage = 'An error occurred') {
  showLoading();
  try {
    return await asyncFn();
  } catch (error) {
    console.error(error);
    showToast(error.message || errorMessage, 'error');
    throw error;
  } finally {
    hideLoading();
  }
}

/** Build lookup maps from arrays */
function buildLookup(items, key = 'id', labelKey = 'name') {
  const map = {};
  (items || []).forEach((item) => {
    map[item[key]] = item[labelKey];
  });
  return map;
}

/** Initialize app on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  initChartDefaults();
});
