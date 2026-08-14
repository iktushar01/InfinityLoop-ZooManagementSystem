/**
 * Feeding Schedule Page Logic
 */

let animalsList = [];

document.addEventListener('DOMContentLoaded', () => {
  loadFeedingSchedules();
  document.getElementById('add-feeding-btn')?.addEventListener('click', openCreateFeedingModal);
});

async function loadFeedingSchedules() {
  await withLoading(async () => {
    animalsList = await AnimalsAPI.getAll();
    renderFeedingTable();
  }, 'Failed to load feeding schedules');
}

function renderFeedingTable() {
  const tbody = document.getElementById('feeding-tbody');
  const schedules = [];

  animalsList.forEach((animal) => {
    (animal.feedingSchedules || []).forEach((schedule, idx) => {
      schedules.push({ animal, schedule, idx });
    });
  });

  if (!schedules.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-bowl-food"></i><p>No feeding schedules yet</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = schedules.map(({ animal, schedule }) => `
    <tr>
      <td><strong>${escapeHtml(animal.name)}</strong> <small style="color:var(--zoo-text-dim)">(${escapeHtml(animal.species)})</small></td>
      <td>${escapeHtml(schedule.foodType)}</td>
      <td>${schedule.quantity} kg</td>
      <td>${formatTime(schedule.time)}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="feedNow('${animal.id}', '${escapeHtml(animal.name)}')">
          <i class="fa-solid fa-check"></i> Mark Fed
        </button>
      </td>
    </tr>
  `).join('');
}

function openCreateFeedingModal() {
  const options = animalsList.map((a) =>
    `<option value="${a.id}">${escapeHtml(a.name)} (${escapeHtml(a.species)})</option>`
  ).join('');

  showModal(
    'Create Feeding Schedule',
    `
    <form id="feeding-form">
      <div class="form-group">
        <label class="form-label">Animal <span class="required">*</span></label>
        <select name="animalId" id="feeding-animal" class="form-select" data-required>${options}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Food Type <span class="required">*</span></label>
        <input type="text" name="foodType" class="form-input" data-required placeholder="e.g. Meat, Seeds, Fish" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Quantity (kg) <span class="required">*</span></label>
        <input type="number" name="quantity" class="form-input" data-required min="0.1" step="0.1" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Feeding Time <span class="required">*</span></label>
        <input type="time" name="time" class="form-input" data-required />
        <div class="form-error"></div>
      </div>
    </form>
    `,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="feeding-submit">Create Schedule</button>
    `
  );

  document.getElementById('feeding-submit').addEventListener('click', async () => {
    const form = document.getElementById('feeding-form');
    if (!validateForm(form)) return;

    const data = serializeForm(form);
    const time = data.time.length === 5 ? `${data.time}:00` : data.time;

    await withLoading(async () => {
      await AnimalsAPI.feed(data.animalId, {
        foodType: data.foodType,
        quantity: parseFloat(data.quantity),
        time,
      });
      hideModal();
      showToast('Feeding schedule created', 'success');
      loadFeedingSchedules();
    }, 'Failed to create feeding schedule');
  });
}

async function feedNow(animalId, name) {
  await withLoading(async () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    await AnimalsAPI.feed(animalId, {
      foodType: 'Scheduled Feed',
      quantity: 1,
      time,
    });
    showToast(`${name} marked as fed`, 'success');
    loadFeedingSchedules();
  }, 'Failed to update feeding status');
}
