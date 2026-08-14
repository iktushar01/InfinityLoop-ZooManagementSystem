/**
 * Enclosures Page Logic
 */

let enclosuresData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadEnclosures();
  document.getElementById('add-enclosure-btn')?.addEventListener('click', () => openEnclosureForm());
  initTableSort('enclosures-table');
});

async function loadEnclosures() {
  await withLoading(async () => {
    enclosuresData = await EnclosuresAPI.getAll();
    renderEnclosuresTable(enclosuresData);
  }, 'Failed to load enclosures');
}

function renderEnclosuresTable(enclosures) {
  const tbody = document.getElementById('enclosures-tbody');
  if (!enclosures.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-tree"></i><p>No enclosures found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = enclosures.map((e) => {
    const current = e.animals?.length ?? 0;
    const available = e.capacity - current;
    const pct = (current / e.capacity) * 100;
    const fillClass = pct >= 90 ? 'high' : pct >= 60 ? 'medium' : 'low';

    return `
    <tr data-name="${escapeHtml(e.name)}" data-habitat="${escapeHtml(e.habitatType)}" data-capacity="${e.capacity}">
      <td><strong>${escapeHtml(e.name)}</strong></td>
      <td><span class="badge badge-info">${escapeHtml(e.habitatType)}</span></td>
      <td>${e.capacity}</td>
      <td>${current}</td>
      <td>
        ${available}
        <div class="capacity-bar"><div class="capacity-fill ${fillClass}" style="width:${pct}%"></div></div>
      </td>
      <td>${e.isFull ? '<span class="badge badge-critical">Full</span>' : '<span class="badge badge-healthy">Available</span>'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm btn-icon" title="View Animals" onclick="viewEnclosureAnimals('${e.id}')">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Edit" onclick="openEnclosureForm('${e.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" title="Delete" onclick="deleteEnclosure('${e.id}', '${escapeHtml(e.name)}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function openEnclosureForm(id = null) {
  const enclosure = id ? enclosuresData.find((e) => e.id === id) : null;
  const isEdit = !!enclosure;

  showModal(
    isEdit ? 'Edit Enclosure' : 'Add Enclosure',
    `
    <form id="enclosure-form">
      <div class="form-group">
        <label class="form-label">Name <span class="required">*</span></label>
        <input type="text" name="name" class="form-input" data-required value="${enclosure ? escapeHtml(enclosure.name) : ''}" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Habitat Type <span class="required">*</span></label>
        <input type="text" name="habitatType" class="form-input" data-required value="${enclosure ? escapeHtml(enclosure.habitatType) : ''}" placeholder="e.g. Savanna, Rainforest" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Capacity <span class="required">*</span></label>
        <input type="number" name="capacity" class="form-input" data-required min="1" value="${enclosure?.capacity ?? ''}" />
        <div class="form-error"></div>
      </div>
    </form>
    `,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="enclosure-submit">${isEdit ? 'Update' : 'Add'} Enclosure</button>
    `
  );

  document.getElementById('enclosure-submit').addEventListener('click', async () => {
    const form = document.getElementById('enclosure-form');
    if (!validateForm(form)) return;

    const data = serializeForm(form);
    const payload = {
      name: data.name,
      habitatType: data.habitatType,
      capacity: parseInt(data.capacity, 10),
    };

    await withLoading(async () => {
      if (isEdit) {
        await EnclosuresAPI.update(id, payload);
        showToast('Enclosure updated', 'success');
      } else {
        await EnclosuresAPI.create(payload);
        showToast('Enclosure added', 'success');
      }
      hideModal();
      loadEnclosures();
    }, `Failed to ${isEdit ? 'update' : 'add'} enclosure`);
  });
}

async function viewEnclosureAnimals(id) {
  const enclosure = await EnclosuresAPI.getById(id);
  const animals = enclosure.animals || [];

  showModal(
    `Animals in ${escapeHtml(enclosure.name)}`,
    animals.length
      ? `<ul style="list-style:none;padding:0;">${animals.map((a) => `<li style="padding:0.5rem 0;border-bottom:1px solid var(--zoo-border);"><i class="fa-solid fa-paw" style="color:var(--zoo-green);margin-right:0.5rem;"></i>${escapeHtml(a)}</li>`).join('')}</ul>`
      : '<p style="color:var(--zoo-text-dim)">No animals in this enclosure.</p>',
    `<button class="btn btn-secondary" onclick="hideModal()">Close</button>`
  );
}

async function deleteEnclosure(id, name) {
  const confirmed = await confirmDialog(`Delete enclosure "${name}"?`);
  if (!confirmed) return;

  await withLoading(async () => {
    await EnclosuresAPI.delete(id);
    showToast('Enclosure deleted', 'success');
    loadEnclosures();
  }, 'Failed to delete enclosure');
}
