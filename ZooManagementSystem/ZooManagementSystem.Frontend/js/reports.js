/**
 * Reports Page Logic
 */

let reportCharts = {};
let ticketsData = [];

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadAllReports();

  document.getElementById('apply-date-filter')?.addEventListener('click', applyDateFilter);
});

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });
}

async function loadAllReports() {
  await withLoading(async () => {
    const [animalReport, revenueReport, visitorReport, foodReport, tickets] = await Promise.all([
      ReportsAPI.animals(),
      ReportsAPI.revenue(),
      ReportsAPI.visitors(),
      ReportsAPI.foodRequirements(),
      TicketsAPI.getAll(),
    ]);

    ticketsData = tickets;
    renderAnimalReport(animalReport);
    renderVisitorReport(visitorReport);
    renderRevenueReport(revenueReport, tickets);
    renderFoodReport(foodReport);
  }, 'Failed to load reports');
}

function renderAnimalReport(report) {
  document.getElementById('report-total-animals').textContent = report.totalAnimals;
  document.getElementById('report-sick-animals').textContent = report.sickAnimals?.length ?? 0;
  document.getElementById('report-enclosures-used').textContent = Object.keys(report.animalsPerEnclosure || {}).length;

  const sickTbody = document.getElementById('sick-animals-tbody');
  const sick = report.sickAnimals || [];
  sickTbody.innerHTML = sick.length
    ? sick.map((a) => `
      <tr>
        <td>${escapeHtml(a.name)}</td>
        <td>${escapeHtml(a.species)}</td>
        <td>${escapeHtml(a.animalType)}</td>
        <td>${healthBadge(a.healthStatus)}</td>
      </tr>`).join('')
    : `<tr><td colspan="4" style="text-align:center;color:var(--zoo-text-dim)">No sick animals 🎉</td></tr>`;

  destroyReportChart('categories');
  reportCharts.categories = new Chart(document.getElementById('report-chart-categories'), {
    type: 'bar',
    data: {
      labels: Object.keys(report.animalsByCategory || {}),
      datasets: [{
        label: 'Animals',
        data: Object.values(report.animalsByCategory || {}),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderRadius: 8,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });

  destroyReportChart('enclosures');
  reportCharts.enclosures = new Chart(document.getElementById('report-chart-enclosures'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(report.animalsPerEnclosure || {}),
      datasets: [{
        data: Object.values(report.animalsPerEnclosure || {}),
        backgroundColor: ['#22c55e', '#14b8a6', '#38bdf8', '#a78bfa', '#f59e0b'],
        borderWidth: 0,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } },
  });
}

function renderVisitorReport(report) {
  document.getElementById('report-total-visitors').textContent = report.totalVisitors;

  destroyReportChart('visitors');
  const labels = Object.keys(report.visitorsByDate || {});
  reportCharts.visitors = new Chart(document.getElementById('report-chart-visitors'), {
    type: 'line',
    data: {
      labels: labels.length ? labels : ['No data'],
      datasets: [{
        label: 'Visitors',
        data: labels.length ? Object.values(report.visitorsByDate) : [0],
        borderColor: '#a78bfa',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        fill: true,
        tension: 0.4,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });
}

function renderRevenueReport(report, tickets) {
  document.getElementById('report-total-revenue').textContent = formatCurrency(report.totalRevenue);
  document.getElementById('report-ticket-count').textContent = report.ticketCount;
  document.getElementById('report-avg-price').textContent = formatCurrency(report.averageTicketPrice);

  const byType = {};
  tickets.forEach((t) => {
    byType[t.ticketType] = (byType[t.ticketType] || 0) + parseFloat(t.price);
  });

  destroyReportChart('revenue');
  reportCharts.revenue = new Chart(document.getElementById('report-chart-revenue'), {
    type: 'bar',
    data: {
      labels: Object.keys(byType).length ? Object.keys(byType) : ['Adult', 'Child', 'VIP'],
      datasets: [{
        label: 'Revenue ($)',
        data: Object.keys(byType).length ? Object.values(byType) : [0, 0, 0],
        backgroundColor: ['rgba(245,158,11,0.6)', 'rgba(34,197,94,0.6)', 'rgba(56,189,248,0.6)'],
        borderRadius: 8,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });
}

function renderFoodReport(report) {
  document.getElementById('report-daily-food').textContent = `${report.dailyFood} kg`;
  document.getElementById('report-weekly-food').textContent = `${report.weeklyFood} kg`;
  document.getElementById('report-monthly-food').textContent = `${report.monthlyFood} kg`;

  destroyReportChart('food');
  reportCharts.food = new Chart(document.getElementById('report-chart-food'), {
    type: 'bar',
    data: {
      labels: ['Daily', 'Weekly', 'Monthly'],
      datasets: [{
        label: 'Food (kg)',
        data: [report.dailyFood, report.weeklyFood, report.monthlyFood],
        backgroundColor: ['rgba(34,197,94,0.6)', 'rgba(245,158,11,0.6)', 'rgba(239,68,68,0.6)'],
        borderRadius: 8,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });
}

function applyDateFilter() {
  const from = document.getElementById('date-from').value;
  const to = document.getElementById('date-to').value;

  if (!from && !to) {
    return showToast('Select a date range', 'warning');
  }

  let filtered = ticketsData;
  if (from) filtered = filtered.filter((t) => t.visitDate >= from);
  if (to) filtered = filtered.filter((t) => t.visitDate <= to);

  const totalRevenue = filtered.reduce((sum, t) => sum + parseFloat(t.price), 0);
  const avgPrice = filtered.length ? totalRevenue / filtered.length : 0;

  document.getElementById('report-total-revenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('report-ticket-count').textContent = filtered.length;
  document.getElementById('report-avg-price').textContent = formatCurrency(avgPrice);

  const byDate = {};
  filtered.forEach((t) => {
    byDate[t.visitDate] = (byDate[t.visitDate] || 0) + 1;
  });

  destroyReportChart('visitors');
  reportCharts.visitors = new Chart(document.getElementById('report-chart-visitors'), {
    type: 'bar',
    data: {
      labels: Object.keys(byDate),
      datasets: [{ label: 'Visitors', data: Object.values(byDate), backgroundColor: 'rgba(167,139,250,0.6)', borderRadius: 8 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });

  showToast(`Filtered ${filtered.length} tickets`, 'info');
}

function destroyReportChart(key) {
  reportCharts[key]?.destroy();
  delete reportCharts[key];
}
