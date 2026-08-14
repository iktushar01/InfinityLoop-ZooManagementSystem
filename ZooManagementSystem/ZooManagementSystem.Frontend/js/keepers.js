/**
 * Keepers Page Logic
 */

let keepersData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadKeepers();
  document.getElementById('add-keeper-btn')?.addEventListener('click', () => openKeeperForm());
  initTableSort('keepers-table');
});

async function loadKeepers() {
  await withLoading(async () => {
    keepersData = await KeepersAPI.getAll();
    renderKeepersTable(keepersData);
  }, 'Failed to load keepers');
}

function renderKeepersTable(keepers) {
  const tbody = document.getElementById('keepers-tbody');
  if (!keepers.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-user-nurse"></i><p>No keepers found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = keepers.map((k) => `
    <tr data-name="${escapeHtml(k.name)}" data-age="${k.age}" data-phone="${escapeHtml(k.phone)}" data-email="${escapeHtml(k.email)}">
      <td><strong>${escapeHtml(k.name)}</strong></td>
      <td>${k.age}</td>
      <td>${escapeHtml(k.phone)}</td>
      <td>${escapeHtml(k.email)}</td>
      <td>
        ${(k.assignedAnimals || []).length
          ? `<span class="badge badge-info">${k.assignedAnimals.length} animals</span>`
          : '<span style="color:var(--zoo-text-dim)">None</span>'}
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm btn-icon" title="View Animals" onclick="viewAssignedAnimals('${k.id}')">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Edit" onclick="openKeeperForm('${k.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" title="Delete" onclick="deleteKeeper('${k.id}', '${escapeHtml(k.name)}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openKeeperForm(id = null) {
  const keeper = id ? keepersData.find((k) => k.id === id) : null;
  const isEdit = !!keeper;

  showModal(
    isEdit ? 'Edit Keeper' : 'Add Keeper',
    `
    <form id="keeper-form">
      <div class="form-group">
        <label class="form-label">Name <span class="required">*</span></label>
        <input type="text" name="name" class="form-input" data-required value="${keeper ? escapeHtml(keeper.name) : ''}" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Age <span class="required">*</span></label>
        <input type="number" name="age" class="form-input" data-required min="18" value="${keeper?.age ?? ''}" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Phone <span class="required">*</span></label>
        <input type="text" name="phone" class="form-input" data-required value="${keeper ? escapeHtml(keeper.phone) : ''}" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Email <span class="required">*</span></label>
        <input type="email" name="email" class="form-input" data-required value="${keeper ? escapeHtml(keeper.email) : ''}" />
        <div class="form-error"></div>
      </div>
    </form>
    `,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="keeper-submit">${isEdit ? 'Update' : 'Add'} Keeper</button>
    `
  );

  document.getElementById('keeper-submit').addEventListener('click', async () => {
    const form = document.getElementById('keeper-form');
    if (!validateForm(form)) return;

    const data = serializeForm(form);
    const payload = {
      name: data.name,
      age: parseInt(data.age, 10),
      phone: data.phone,
      email: data.email,
    };

    await withLoading(async () => {
      if (isEdit) {
        await KeepersAPI.update(id, payload);
        showToast('Keeper updated successfully', 'success');
      } else {
        await KeepersAPI.create(payload);
        showToast('Keeper added successfully', 'success');
      }
      hideModal();
      loadKeepers();
    }, `Failed to ${isEdit ? 'update' : 'add'} keeper`);
  });
}

async function viewAssignedAnimals(id) {
  const keeper = await KeepersAPI.getById(id);
  const animals = keeper.assignedAnimals || [];

  showModal(
    `Animals — ${escapeHtml(keeper.name)}`,
    animals.length
      ? `<ul style="list-style:none;padding:0;">${animals.map((a) => `<li style="padding:0.5rem 0;border-bottom:1px solid var(--zoo-border);"><i class="fa-solid fa-paw" style="color:var(--zoo-green);margin-right:0.5rem;"></i>${escapeHtml(a)}</li>`).join('')}</ul>`
      : '<p style="color:var(--zoo-text-dim)">No animals assigned to this keeper.</p>',
    `<button class="btn btn-secondary" onclick="hideModal()">Close</button>`
  );
}

async function deleteKeeper(id, name) {
  const confirmed = await confirmDialog(`Delete keeper "${name}"?`);
  if (!confirmed) return;

  await withLoading(async () => {
    await KeepersAPI.delete(id);
    showToast('Keeper deleted', 'success');
    loadKeepers();
  }, 'Failed to delete keeper');
}
