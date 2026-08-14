/**
 * Health Records Page Logic
 */

let healthRecords = [];
let animalsList = [];

document.addEventListener('DOMContentLoaded', () => {
  loadHealthRecords();
  document.getElementById('add-health-btn')?.addEventListener('click', openAddHealthModal);
  document.getElementById('filter-health-status')?.addEventListener('change', applyHealthFilter);
});

async function loadHealthRecords() {
  await withLoading(async () => {
    animalsList = await AnimalsAPI.getAll();
    healthRecords = [];

    animalsList.forEach((animal) => {
      (animal.healthRecords || []).forEach((record, idx) => {
        healthRecords.push({
          animalId: animal.id,
          animalName: animal.name,
          animalSpecies: animal.species,
          ...record,
          _idx: idx,
        });
      });
    });

    healthRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderHealthTable(healthRecords);
  }, 'Failed to load health records');
}

function renderHealthTable(records) {
  const tbody = document.getElementById('health-tbody');

  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-heart-pulse"></i><p>No health records found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = records.map((r) => `
    <tr>
      <td><strong>${escapeHtml(r.animalName)}</strong> <small style="color:var(--zoo-text-dim)">(${escapeHtml(r.animalSpecies)})</small></td>
      <td>${formatDate(r.date)}</td>
      <td>${escapeHtml(r.vetName)}</td>
      <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(r.description)}">${escapeHtml(r.description)}</td>
      <td>${healthBadge(r.status)}</td>
      <td>
        <button class="btn btn-secondary btn-sm btn-icon" title="View Details" onclick="viewHealthRecord('${r.animalId}', ${r._idx})">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function applyHealthFilter() {
  const status = document.getElementById('filter-health-status').value;
  const filtered = status
    ? healthRecords.filter((r) => r.status === status)
    : healthRecords;
  renderHealthTable(filtered);
}

function openAddHealthModal() {
  const options = animalsList.map((a) =>
    `<option value="${a.id}">${escapeHtml(a.name)} (${escapeHtml(a.species)})</option>`
  ).join('');

  showModal(
    'Add Health Record',
    `
    <form id="health-form">
      <div class="form-group">
        <label class="form-label">Animal <span class="required">*</span></label>
        <select name="animalId" class="form-select" data-required>${options}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Vet Name <span class="required">*</span></label>
        <input type="text" name="vetName" class="form-input" data-required placeholder="Dr. Smith" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Description <span class="required">*</span></label>
        <textarea name="description" class="form-textarea" rows="3" data-required placeholder="Examination notes..."></textarea>
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Health Status</label>
        <select name="status" class="form-select">
          <option value="Healthy">Healthy</option>
          <option value="Sick">Sick</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </form>
    `,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="health-submit">Save Record</button>
    `
  );

  document.getElementById('health-submit').addEventListener('click', async () => {
    const form = document.getElementById('health-form');
    if (!validateForm(form)) return;

    const data = serializeForm(form);

    await withLoading(async () => {
      await AnimalsAPI.healthCheck(data.animalId, {
        vetName: data.vetName,
        description: data.description,
        status: data.status,
      });
      hideModal();
      showToast('Health record added', 'success');
      loadHealthRecords();
    }, 'Failed to add health record');
  });
}

function viewHealthRecord(animalId, idx) {
  const animal = animalsList.find((a) => a.id === animalId);
  const record = animal?.healthRecords?.[idx];
  if (!record) return;

  showModal(
    `Health Record — ${escapeHtml(animal.name)}`,
    `
    <div style="font-size:0.875rem;display:grid;gap:0.75rem;">
      <div><span style="color:var(--zoo-text-dim)">Date:</span> ${formatDate(record.date)}</div>
      <div><span style="color:var(--zoo-text-dim)">Vet:</span> ${escapeHtml(record.vetName)}</div>
      <div><span style="color:var(--zoo-text-dim)">Status:</span> ${healthBadge(record.status)}</div>
      <div><span style="color:var(--zoo-text-dim)">Description:</span><br/>${escapeHtml(record.description)}</div>
    </div>
    `,
    `<button class="btn btn-secondary" onclick="hideModal()">Close</button>`
  );
}
