/**
 * Tickets Page Logic
 */

let ticketsData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadTickets();
  document.getElementById('add-ticket-btn')?.addEventListener('click', openTicketForm);
  initTableSort('tickets-table');
});

async function loadTickets() {
  await withLoading(async () => {
    ticketsData = await TicketsAPI.getAll();
    renderTicketsTable(ticketsData);
  }, 'Failed to load tickets');
}

function renderTicketsTable(tickets) {
  const tbody = document.getElementById('tickets-tbody');

  if (!tickets.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-ticket"></i><p>No tickets found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = tickets.map((t) => `
    <tr data-visitor="${escapeHtml(t.visitorName)}" data-type="${t.ticketType}" data-price="${t.price}" data-date="${t.visitDate}">
      <td><strong>${escapeHtml(t.visitorName)}</strong></td>
      <td><span class="badge badge-info">${escapeHtml(t.ticketType)}</span></td>
      <td>${formatCurrency(t.price)}</td>
      <td>${formatDate(t.visitDate)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-danger btn-sm btn-icon" title="Delete" onclick="deleteTicket('${t.id}', '${escapeHtml(t.visitorName)}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openTicketForm() {
  showModal(
    'Add Ticket',
    `
    <form id="ticket-form">
      <div class="form-group">
        <label class="form-label">Visitor Name <span class="required">*</span></label>
        <input type="text" name="visitorName" class="form-input" data-required placeholder="John Doe" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Ticket Type <span class="required">*</span></label>
        <select name="ticketType" class="form-select" data-required>
          <option value="">Select type</option>
          <option value="Adult">Adult — $25</option>
          <option value="Child">Child — $12</option>
          <option value="VIP">VIP — $50</option>
        </select>
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Price ($) <span class="required">*</span></label>
        <input type="number" name="price" class="form-input" data-required min="0" step="0.01" placeholder="25.00" />
        <div class="form-error"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Visit Date <span class="required">*</span></label>
        <input type="date" name="visitDate" class="form-input" data-required />
        <div class="form-error"></div>
      </div>
    </form>
    `,
    `
      <button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" id="ticket-submit">Add Ticket</button>
    `
  );

  const typeSelect = document.querySelector('#ticket-form [name="ticketType"]');
  const priceInput = document.querySelector('#ticket-form [name="price"]');
  const priceMap = { Adult: 25, Child: 12, VIP: 50 };

  typeSelect.addEventListener('change', () => {
    if (priceMap[typeSelect.value]) {
      priceInput.value = priceMap[typeSelect.value];
    }
  });

  document.getElementById('ticket-submit').addEventListener('click', async () => {
    const form = document.getElementById('ticket-form');
    if (!validateForm(form)) return;

    const data = serializeForm(form);
    const payload = {
      visitorName: data.visitorName,
      ticketType: data.ticketType,
      price: parseFloat(data.price),
      visitDate: data.visitDate,
    };

    await withLoading(async () => {
      await TicketsAPI.create(payload);
      hideModal();
      showToast('Ticket added successfully', 'success');
      loadTickets();
    }, 'Failed to add ticket');
  });
}

async function deleteTicket(id, name) {
  const confirmed = await confirmDialog(`Delete ticket for "${name}"?`);
  if (!confirmed) return;

  await withLoading(async () => {
    await TicketsAPI.delete(id);
    showToast('Ticket deleted', 'success');
    loadTickets();
  }, 'Failed to delete ticket');
}
