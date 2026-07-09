/* ==========================================================================
   SIM — Security Incident Mapping System
   script.js — shared logic for all pages (localStorage only, no backend)
   ========================================================================== */

const SIM = (() => {
  const STORAGE_KEY = 'sim_reports';
  const COUNTER_KEY = 'sim_report_counter';

  /* ---------------- data layer ---------------- */
  function getReports() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('SIM: could not read reports', e);
      return [];
    }
  }

  function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }

  function nextCounter() {
    let n = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
    n += 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    return n;
  }

  function generateReportId() {
    const year = new Date().getFullYear();
    const n = nextCounter();
    return `SIM-${year}-${String(n).padStart(4, '0')}`;
  }

  function addReport(data) {
    const reports = getReports();
    const report = {
      id: generateReportId(),
      fullName: data.fullName,
      role: data.role,
      incidentType: data.incidentType,
      date: data.date,
      time: data.time,
      location: data.location,
      description: data.description,
      imageName: data.imageName || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    reports.unshift(report);
    saveReports(reports);
    return report;
  }

  function updateStatus(id, status) {
    const reports = getReports();
    const idx = reports.findIndex(r => r.id === id);
    if (idx === -1) return null;
    reports[idx].status = status;
    saveReports(reports);
    return reports[idx];
  }

  function deleteReport(id) {
    const reports = getReports().filter(r => r.id !== id);
    saveReports(reports);
  }

  function getStats() {
    const reports = getReports();
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'Pending').length,
      investigating: reports.filter(r => r.status === 'Investigating').length,
      resolved: reports.filter(r => r.status === 'Resolved').length
    };
  }

  /* ---------------- helpers ---------------- */
  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function badgeClass(status) {
    return status === 'Pending' ? 'pending' : status === 'Investigating' ? 'investigating' : 'resolved';
  }

  const INCIDENT_ICONS = {
    Theft: 'fa-mask',
    Robbery: 'fa-user-ninja',
    Assault: 'fa-hand-fist',
    Cultism: 'fa-people-group',
    Harassment: 'fa-triangle-exclamation',
    'Fire Outbreak': 'fa-fire',
    Other: 'fa-circle-question'
  };

  return {
    getReports, saveReports, addReport, updateStatus, deleteReport, getStats,
    escapeHtml, formatDate, badgeClass, INCIDENT_ICONS
  };
})();

/* ==========================================================================
   Navbar — mobile toggle + active link highlighting
   ========================================================================== */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const icon = toggle.querySelector('i');
      const isOpen = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }));
  }

  const current = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('data-page') === current) a.classList.add('active');
  });
}

/* ==========================================================================
   Toast notification (used on dashboard)
   ========================================================================== */
function showToast(message, icon = 'fa-solid fa-circle-check') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ==========================================================================
   Page: report.html — the incident report form
   ========================================================================== */
function initReportForm() {
  const form = document.getElementById('report-form');
  if (!form) return;

  const uploadBox = document.getElementById('upload-box');
  const uploadInput = document.getElementById('image-upload');
  const uploadFilename = document.getElementById('upload-filename');

  if (uploadBox && uploadInput) {
    uploadBox.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', () => {
      if (uploadInput.files && uploadInput.files[0]) {
        uploadFilename.textContent = `📎 ${uploadInput.files[0].name}`;
        uploadFilename.style.display = 'block';
      }
    });
  }

  const requiredFields = ['fullName', 'role', 'incidentType', 'date', 'time', 'location', 'description'];

  function setInvalid(name, message) {
    const wrap = form.querySelector(`[data-field="${name}"]`);
    if (!wrap) return;
    wrap.classList.add('invalid');
    const err = wrap.querySelector('.error-text');
    if (err && message) err.textContent = message;
  }

  function clearInvalid(name) {
    const wrap = form.querySelector(`[data-field="${name}"]`);
    if (wrap) wrap.classList.remove('invalid');
  }

  function validate() {
    let valid = true;
    requiredFields.forEach(name => {
      const el = form.elements[name];
      let value = '';
      if (el && el.length !== undefined && el[0] && el[0].type === 'radio') {
        const checked = Array.from(el).find(r => r.checked);
        value = checked ? checked.value : '';
      } else if (el) {
        value = el.value.trim();
      }
      if (!value) {
        setInvalid(name);
        valid = false;
      } else {
        clearInvalid(name);
      }
    });
    return valid;
  }

  requiredFields.forEach(name => {
    const el = form.elements[name];
    if (!el) return;
    const eventName = (el.tagName === 'SELECT' || (el.length !== undefined)) ? 'change' : 'input';
    if (el.length !== undefined) {
      Array.from(el).forEach(input => input.addEventListener('change', () => clearInvalid(name)));
    } else {
      el.addEventListener(eventName, () => clearInvalid(name));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const roleChecked = Array.from(form.elements['role']).find(r => r.checked);
    const typeChecked = Array.from(form.elements['incidentType']).find(r => r.checked);

    const data = {
      fullName: form.elements['fullName'].value.trim(),
      role: roleChecked.value,
      incidentType: typeChecked.value,
      date: form.elements['date'].value,
      time: form.elements['time'].value,
      location: form.elements['location'].value.trim(),
      description: form.elements['description'].value.trim(),
      imageName: uploadInput && uploadInput.files[0] ? uploadInput.files[0].name : ''
    };

    const report = SIM.addReport(data);
    openSuccessModal(report);
    form.reset();
    if (uploadFilename) uploadFilename.style.display = 'none';
    requiredFields.forEach(clearInvalid);
  });
}

function openSuccessModal(report) {
  const overlay = document.getElementById('success-modal');
  if (!overlay) return;
  const idEl = overlay.querySelector('.modal-id');
  if (idEl) idEl.textContent = report.id;
  overlay.classList.add('active');
}

function closeSuccessModal() {
  const overlay = document.getElementById('success-modal');
  if (overlay) overlay.classList.remove('active');
}

/* ==========================================================================
   Page: reports.html — "My Reports" table
   ========================================================================== */
function renderMyReports() {
  const tbody = document.getElementById('my-reports-body');
  const emptyState = document.getElementById('reports-empty');
  const tableCard = document.getElementById('reports-table-card');
  if (!tbody) return;

  const reports = SIM.getReports();

  if (reports.length === 0) {
    if (tableCard) tableCard.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (tableCard) tableCard.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = reports.map(r => `
    <tr>
      <td><span class="report-id">${SIM.escapeHtml(r.id)}</span></td>
      <td>${SIM.escapeHtml(r.incidentType)}</td>
      <td>${SIM.escapeHtml(r.location)}</td>
      <td>${SIM.formatDate(r.date)}</td>
      <td><span class="badge ${SIM.badgeClass(r.status)}">${SIM.escapeHtml(r.status)}</span></td>
    </tr>
  `).join('');
}

/* ==========================================================================
   Page: dashboard.html — Admin dashboard
   ========================================================================== */
function renderDashboard() {
  const tbody = document.getElementById('admin-reports-body');
  if (!tbody) return;

  updateDashboardStats();

  const emptyState = document.getElementById('admin-empty');
  const tableCard = document.getElementById('admin-table-card');
  const reports = SIM.getReports();

  if (reports.length === 0) {
    if (tableCard) tableCard.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (tableCard) tableCard.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = reports.map(r => `
    <tr data-id="${SIM.escapeHtml(r.id)}">
      <td><span class="report-id">${SIM.escapeHtml(r.id)}</span></td>
      <td>${SIM.escapeHtml(r.fullName)}</td>
      <td>${SIM.escapeHtml(r.incidentType)}</td>
      <td>${SIM.escapeHtml(r.location)}</td>
      <td>${SIM.formatDate(r.date)}</td>
      <td><span class="badge ${SIM.badgeClass(r.status)}">${SIM.escapeHtml(r.status)}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" title="View details" data-action="view"><i class="fa-solid fa-eye"></i></button>
          <button class="icon-btn" title="Mark as Investigating" data-action="investigating"><i class="fa-solid fa-magnifying-glass"></i></button>
          <button class="icon-btn success" title="Mark as Resolved" data-action="resolved"><i class="fa-solid fa-check"></i></button>
          <button class="icon-btn danger" title="Delete report" data-action="delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateDashboardStats() {
  const stats = SIM.getStats();
  const map = { total: stats.total, pending: stats.pending, investigating: stats.investigating, resolved: stats.resolved };
  Object.keys(map).forEach(key => {
    const el = document.getElementById(`stat-${key}`);
    if (el) el.textContent = map[key];
  });
}

function initDashboardActions() {
  const tbody = document.getElementById('admin-reports-body');
  if (!tbody) return;

  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const row = btn.closest('tr');
    const id = row.getAttribute('data-id');
    const action = btn.getAttribute('data-action');

    if (action === 'investigating') {
      SIM.updateStatus(id, 'Investigating');
      showToast(`${id} marked as Investigating`, 'fa-solid fa-magnifying-glass');
      renderDashboard();
    } else if (action === 'resolved') {
      SIM.updateStatus(id, 'Resolved');
      showToast(`${id} marked as Resolved`, 'fa-solid fa-circle-check');
      renderDashboard();
    } else if (action === 'delete') {
      if (confirm(`Delete report ${id}? This cannot be undone.`)) {
        SIM.deleteReport(id);
        showToast(`${id} deleted`, 'fa-solid fa-trash');
        renderDashboard();
      }
    } else if (action === 'view') {
      openViewModal(id);
    }
  });

  const modal = document.getElementById('view-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close-modal]')) modal.classList.remove('active');
    });
  }
}

function openViewModal(id) {
  const report = SIM.getReports().find(r => r.id === id);
  const modal = document.getElementById('view-modal');
  if (!report || !modal) return;
  modal.querySelector('.view-id').textContent = report.id;
  modal.querySelector('.view-body').innerHTML = `
    <div class="view-row"><span>Reporter</span><strong>${SIM.escapeHtml(report.fullName)} (${SIM.escapeHtml(report.role)})</strong></div>
    <div class="view-row"><span>Incident type</span><strong>${SIM.escapeHtml(report.incidentType)}</strong></div>
    <div class="view-row"><span>Location</span><strong>${SIM.escapeHtml(report.location)}</strong></div>
    <div class="view-row"><span>Date &amp; time</span><strong>${SIM.formatDate(report.date)} · ${SIM.escapeHtml(report.time)}</strong></div>
    <div class="view-row"><span>Status</span><strong><span class="badge ${SIM.badgeClass(report.status)}">${SIM.escapeHtml(report.status)}</span></strong></div>
    <div class="view-row full"><span>Description</span><p>${SIM.escapeHtml(report.description)}</p></div>
    ${report.imageName ? `<div class="view-row"><span>Attachment</span><strong>📎 ${SIM.escapeHtml(report.imageName)}</strong></div>` : ''}
  `;
  modal.classList.add('active');
}

/* ==========================================================================
   Boot
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReportForm();
  renderMyReports();
  renderDashboard();
  initDashboardActions();

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('active');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
});
