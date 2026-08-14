/**
 * Animals Page Logic
 * CRUD, assignments, feeding, and health check actions
 */

let animalsData = [];
let keepersMap = {};
let enclosuresMap = {};

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = document.body.dataset.page;

  if (path.includes('add-animal')) {
    initAddAnimalForm();
  } else if (path.includes('edit-animal')) {
    initEditAnimalForm();
  } else if (page === 'animals' || path.includes('animals.html') || path.endsWith('/animals') || path.endsWith('/animals/')) {
    initAnimalsList();
  }
});

/* ========== Animals List ========== */

async function initAnimalsList() {
  try {
    await withLoading(async () => {
      const [animals, keepers, enclosures] = await Promise.all([
        AnimalsAPI.getAll(),
        KeepersAPI.getAll(),
        EnclosuresAPI.getAll(),
      ]);

      animalsData = animals;
      keepersMap = buildLookup(keepers);
      enclosuresMap = buildLookup(enclosures);

      renderAnimalsTable(animals);
      initTableSort('animals-table');
      initFilters();
    }, 'Failed to load animals');
  } catch (error) {
    renderAnimalsLoadError(error);
  }
}

function renderAnimalsTable(animals) {
  const tbody = document.getElementById('animals-tbody');
  if (!tbody) return;

  if (!animals.length) {
    tbody.innerHTML = `
      <tr><td colspan="10">
        <div class="empty-state">
          <i class="fa-solid fa-paw"></i>
          <p>No animals found</p>
          <a href="add-animal" class="btn btn-primary btn-sm">Add First Animal</a>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = animals
    .map(
      (a) => `
    <tr data-name="${escapeHtml(a.name)}" data-species="${escapeHtml(a.species)}"
        data-type="${a.animalType}" data-age="${a.age}" data-health="${a.healthStatus}"
        data-weight="${a.weight}" data-gender="${a.gender}">
      <td><strong>${escapeHtml(a.name)}</strong></td>
      <td>${escapeHtml(a.species)}</td>
      <td><span class="badge badge-info">${escapeHtml(a.animalType)}</span></td>
      <td>${a.age}</td>
      <td>${escapeHtml(a.gender)}</td>
      <td>${healthBadge(a.healthStatus)}</td>
      <td>${a.weight}</td>
      <td>${escapeHtml(enclosuresMap[a.enclosureId] || '—')}</td>
      <td>${escapeHtml(keepersMap[a.keeperId] || '—')}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm btn-icon" title="View" onclick="viewAnimal('${a.id}')">
            <i class="fa-solid fa-eye"></i>
          </button>
          <a href="edit-animal?id=${a.id}" class="btn btn-secondary btn-sm btn-icon" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </a>
          <button class="btn btn-danger btn-sm btn-icon" title="Delete" onclick="deleteAnimal('${a.id}', '${escapeHtml(a.name)}')">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Assign Keeper" onclick="openAssignKeeper('${a.id}')">
            <i class="fa-solid fa-user-nurse"></i>
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Assign Enclosure" onclick="openAssignEnclosure('${a.id}')">
            <i class="fa-solid fa-tree"></i>
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Feed" onclick="openFeedModal('${a.id}', '${escapeHtml(a.name)}')">
            <i class="fa-solid fa-bowl-food"></i>
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Health Check" onclick="openHealthModal('${a.id}', '${escapeHtml(a.name)}')">
            <i class="fa-solid fa-heart-pulse"></i>
          </button>
        </div>
      </td>
    </tr>`
    )
    .join('');
}

function renderAnimalsLoadError(error) {
  const tbody = document.getElementById('animals-tbody');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr><td colspan="10">
      <div class="empty-state">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>${escapeHtml(error.message || 'Failed to load animals')}</p>
      </div>
    </td></tr>`;
}

function initFilters() {
  const typeFilter = document.getElementById('filter-type');
  const healthFilter = document.getElementById('filter-health');

  [typeFilter, healthFilter].forEach((el) => {
    el?.addEventListener('change', applyFilters);
  });
}

function applyFilters() {
  const type = document.getElementById('filter-type')?.value;
  const health = document.getElementById('filter-health')?.value;

  let filtered = animalsData;
  if (type) filtered = filtered.filter((a) => a.animalType === type);
  if (health) filtered = filtered.filter((a) => a.healthStatus === health);

  renderAnimalsTable(filtered);
}

/* ========== View Animal ========== */

async function viewAnimal(id) {
  await withLoading(async () => {
    const animal = await AnimalsAPI.getById(id);
    showModal(
      escapeHtml(animal.name),
      `
      <div class="detail-grid">
        <div><span style="color:var(--zoo-text-dim)">Species:</span> ${escapeHtml(animal.species)}</div>
        <div><span style="color:var(--zoo-text-dim)">Type:</span> ${escapeHtml(animal.animalType)}</div>
        <div><span style="color:var(--zoo-text-dim)">Age:</span> ${animal.age} years</div>
        <div><span style="color:var(--zoo-text-dim)">Gender:</span> ${escapeHtml(animal.gender)}</div>
        <div><span style="color:var(--zoo-text-dim)">Weight:</span> ${animal.weight} kg</div>
        <div><span style="color:var(--zoo-text-dim)">Health:</span> ${healthBadge(animal.healthStatus)}</div>
        <div><span style="color:var(--zoo-text-dim)">Food/Day:</span> ${animal.foodPerDay} kg</div>
        <div><span style="color:var(--zoo-text-dim)">Enclosure:</span> ${escapeHtml(enclosuresMap[animal.enclosureId] || 'Unassigned')}</div>
        <div><span style="color:var(--zoo-text-dim)">Keeper:</span> ${escapeHtml(keepersMap[animal.keeperId] || 'Unassigned')}</div>
      </div>
      ${animal.furColor ? `<p style="margin-top:0.75rem;font-size:0.875rem;"><span style="color:var(--zoo-text-dim)">Fur Color:</span> ${escapeHtml(animal.furColor)}</p>` : ''}
      ${animal.wingSpan ? `<p style="font-size:0.875rem;"><span style="color:var(--zoo-text-dim)">Wing Span:</span> ${animal.wingSpan}m</p>` : ''}
      `,
      `<button class="btn btn-secondary" onclick="hideModal()">Close</button>`
    );
  });
}

/* ========== Delete Animal ========== */

async function deleteAnimal(id, name) {
  const confirmed = await confirmDialog(`Are you sure you want to delete "${name}"? This action cannot be undone.`);
  if (!confirmed) return;

  await withLoading(async () => {
    await AnimalsAPI.delete(id);
    showToast(`${name} deleted successfully`, 'success');
    initAnimalsList();
  }, 'Failed to delete animal');
}

/* ========== Assign Keeper ========== */

async function openAssignKeeper(animalId) {
  const keepers = await KeepersAPI.getAll();
  const options = keepers.map((k) => `<option value="${k.id}">${escapeHtml(k.name)}</option>`).join('');

  showModal(
    'Assign Keeper',
    `<select id="keeper-select" class="form-select">${options}</select>`,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="assign-keeper-btn">Assign</button>
    `
  );

  document.getElementById('assign-keeper-btn').addEventListener('click', async () => {
    const keeperId = document.getElementById('keeper-select').value;
    await withLoading(async () => {
      await AnimalsAPI.assignKeeper(animalId, keeperId);
      hideModal();
      showToast('Keeper assigned successfully', 'success');
      initAnimalsList();
    }, 'Failed to assign keeper');
  });
}

/* ========== Assign Enclosure ========== */

async function openAssignEnclosure(animalId) {
  const enclosures = await EnclosuresAPI.getAll();
  const options = enclosures
    .filter((e) => !e.isFull)
    .map((e) => `<option value="${e.id}">${escapeHtml(e.name)} (${e.animals.length}/${e.capacity})</option>`)
    .join('');

  showModal(
    'Assign Enclosure',
    `<select id="enclosure-select" class="form-select">${options || '<option value="">No available enclosures</option>'}</select>`,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="assign-enclosure-btn">Assign</button>
    `
  );

  document.getElementById('assign-enclosure-btn').addEventListener('click', async () => {
    const enclosureId = document.getElementById('enclosure-select').value;
    if (!enclosureId) return showToast('No enclosure selected', 'warning');

    await withLoading(async () => {
      await AnimalsAPI.assignEnclosure(animalId, enclosureId);
      hideModal();
      showToast('Enclosure assigned successfully', 'success');
      initAnimalsList();
    }, 'Failed to assign enclosure');
  });
}

/* ========== Feed Modal ========== */

function openFeedModal(animalId, name) {
  showModal(
    `Feed ${name}`,
    `
    <div class="form-group">
      <label class="form-label">Food Type</label>
      <input type="text" id="feed-food" class="form-input" data-required placeholder="e.g. Meat, Seeds" />
    </div>
    <div class="form-group">
      <label class="form-label">Quantity (kg)</label>
      <input type="number" id="feed-quantity" class="form-input" data-required min="0.1" step="0.1" />
    </div>
    <div class="form-group">
      <label class="form-label">Feeding Time</label>
      <input type="time" id="feed-time" class="form-input" data-required />
    </div>
    `,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="feed-submit-btn">Feed Animal</button>
    `
  );

  document.getElementById('feed-submit-btn').addEventListener('click', async () => {
    const foodType = document.getElementById('feed-food').value.trim();
    const quantity = parseFloat(document.getElementById('feed-quantity').value);
    const time = document.getElementById('feed-time').value;

    if (!foodType || !quantity || !time) {
      return showToast('Please fill all feeding fields', 'warning');
    }

    await withLoading(async () => {
      await AnimalsAPI.feed(animalId, {
        foodType,
        quantity,
        time: time.length === 5 ? `${time}:00` : time,
      });
      hideModal();
      showToast(`${name} fed successfully`, 'success');
    }, 'Failed to feed animal');
  });
}

/* ========== Health Check Modal ========== */

function openHealthModal(animalId, name) {
  showModal(
    `Health Check — ${name}`,
    `
    <div class="form-group">
      <label class="form-label">Vet Name</label>
      <input type="text" id="health-vet" class="form-input" data-required placeholder="Dr. Smith" />
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea id="health-desc" class="form-textarea" rows="3" data-required placeholder="Examination notes..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Health Status</label>
      <select id="health-status" class="form-select">
        <option value="Healthy">Healthy</option>
        <option value="Sick">Sick</option>
        <option value="Critical">Critical</option>
      </select>
    </div>
    `,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="health-submit-btn">Save Record</button>
    `
  );

  document.getElementById('health-submit-btn').addEventListener('click', async () => {
    const vetName = document.getElementById('health-vet').value.trim();
    const description = document.getElementById('health-desc').value.trim();
    const status = document.getElementById('health-status').value;

    if (!vetName || !description) {
      return showToast('Please fill all health check fields', 'warning');
    }

    await withLoading(async () => {
      await AnimalsAPI.healthCheck(animalId, { vetName, description, status });
      hideModal();
      showToast('Health check recorded', 'success');
      initAnimalsList();
    }, 'Failed to record health check');
  });
}

/* ========== Add Animal Form ========== */

function initAddAnimalForm() {
  const typeSelect = document.getElementById('animal-type');
  const form = document.getElementById('add-animal-form');

  typeSelect?.addEventListener('change', () => {
    document.getElementById('mammal-fields').style.display = typeSelect.value === 'Mammal' ? 'grid' : 'none';
    document.getElementById('bird-fields').style.display = typeSelect.value === 'Bird' ? 'grid' : 'none';
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const data = serializeForm(form);
    const payload = {
      name: data.name,
      species: data.species,
      age: parseInt(data.age, 10),
      gender: data.gender,
      weight: parseFloat(data.weight),
      animalType: data.animalType,
    };

    if (data.animalType === 'Mammal') {
      payload.furColor = data.furColor || null;
      payload.isCarnivore = data.isCarnivore === 'true';
    }
    if (data.animalType === 'Bird') {
      payload.wingSpan = data.wingSpan ? parseFloat(data.wingSpan) : null;
      payload.canFly = data.canFly === 'true';
    }

    await withLoading(async () => {
      await AnimalsAPI.create(payload);
      showToast('Animal added successfully!', 'success');
      setTimeout(() => (window.location.href = 'animals'), 800);
    }, 'Failed to add animal');
  });
}

/* ========== Edit Animal Form ========== */

async function initEditAnimalForm() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    window.location.href = 'animals';
    return;
  }

  await withLoading(async () => {
    const [animal, keepers, enclosures] = await Promise.all([
      AnimalsAPI.getById(id),
      KeepersAPI.getAll(),
      EnclosuresAPI.getAll(),
    ]);

    keepersMap = buildLookup(keepers);
    enclosuresMap = buildLookup(enclosures);

    renderEditForm(animal, keepers, enclosures);
  }, 'Failed to load animal');
}

function renderEditForm(animal, keepers, enclosures) {
  const container = document.getElementById('edit-form-container');
  const keeperOptions = keepers.map((k) =>
    `<option value="${k.id}" ${k.id === animal.keeperId ? 'selected' : ''}>${escapeHtml(k.name)}</option>`
  ).join('');
  const enclosureOptions = enclosures.map((e) =>
    `<option value="${e.id}" ${e.id === animal.enclosureId ? 'selected' : ''}>${escapeHtml(e.name)}</option>`
  ).join('');

  container.innerHTML = `
    <form id="edit-animal-form">
      <input type="hidden" name="id" value="${animal.id}" />
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Name <span class="required">*</span></label>
          <input type="text" name="name" class="form-input" data-required value="${escapeHtml(animal.name)}" />
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Species <span class="required">*</span></label>
          <input type="text" name="species" class="form-input" data-required value="${escapeHtml(animal.species)}" />
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Age</label>
          <input type="number" name="age" class="form-input" data-required min="0" value="${animal.age}" />
        </div>
        <div class="form-group">
          <label class="form-label">Gender</label>
          <select name="gender" class="form-select" data-required>
            <option value="Male" ${animal.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Female" ${animal.gender === 'Female' ? 'selected' : ''}>Female</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Weight (kg)</label>
          <input type="number" name="weight" class="form-input" data-required min="0.1" step="0.1" value="${animal.weight}" />
        </div>
        <div class="form-group">
          <label class="form-label">Health Status</label>
          <select name="healthStatus" class="form-select">
            <option value="Healthy" ${animal.healthStatus === 'Healthy' ? 'selected' : ''}>Healthy</option>
            <option value="Sick" ${animal.healthStatus === 'Sick' ? 'selected' : ''}>Sick</option>
            <option value="Critical" ${animal.healthStatus === 'Critical' ? 'selected' : ''}>Critical</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Keeper</label>
          <select name="keeperId" class="form-select">
            <option value="">Unassigned</option>
            ${keeperOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Enclosure</label>
          <select name="enclosureId" class="form-select">
            <option value="">Unassigned</option>
            ${enclosureOptions}
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="location.href='animals'">Cancel</button>
        <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> Save Changes</button>
      </div>
    </form>`;

  document.getElementById('edit-animal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!validateForm(form)) return;

    const data = serializeForm(form);
    const payload = {
      name: data.name,
      species: data.species,
      age: parseInt(data.age, 10),
      gender: data.gender,
      weight: parseFloat(data.weight),
      healthStatus: data.healthStatus,
      keeperId: data.keeperId || null,
      enclosureId: data.enclosureId || null,
      furColor: animal.furColor,
      isCarnivore: animal.isCarnivore,
      wingSpan: animal.wingSpan,
      canFly: animal.canFly,
    };

    await withLoading(async () => {
      await AnimalsAPI.update(animal.id, payload);
      showToast('Animal updated successfully!', 'success');
      setTimeout(() => (window.location.href = 'animals'), 800);
    }, 'Failed to update animal');
  });
}
