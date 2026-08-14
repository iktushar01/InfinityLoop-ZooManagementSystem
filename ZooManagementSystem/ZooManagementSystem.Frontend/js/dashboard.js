/**
 * Dashboard Page Logic
 * Statistics, charts, and recent activities
 */

let chartInstances = {};

document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboard();
});

async function loadDashboard() {
  await withLoading(async () => {
    const [animals, keepers, enclosures, tickets, animalReport, revenueReport, visitorReport] =
      await Promise.all([
        AnimalsAPI.getAll(),
        KeepersAPI.getAll(),
        EnclosuresAPI.getAll(),
        TicketsAPI.getAll(),
        ReportsAPI.animals(),
        ReportsAPI.revenue(),
        ReportsAPI.visitors(),
      ]);

    updateStats(animals, keepers, enclosures, animalReport, revenueReport, visitorReport);
    renderCharts(animals, animalReport, revenueReport, visitorReport, tickets);
    renderActivities(animals);
  }, 'Failed to load dashboard data');
}

function updateStats(animals, keepers, enclosures, animalReport, revenueReport, visitorReport) {
  document.getElementById('stat-animals').textContent = animalReport.totalAnimals ?? animals.length;
  document.getElementById('stat-keepers').textContent = keepers.length;
  document.getElementById('stat-enclosures').textContent = enclosures.length;
  document.getElementById('stat-visitors').textContent = visitorReport.totalVisitors ?? 0;
  document.getElementById('stat-revenue').textContent = formatCurrency(revenueReport.totalRevenue);
  document.getElementById('stat-sick').textContent = animalReport.sickAnimals?.length ?? 0;
}

function renderCharts(animals, animalReport, revenueReport, visitorReport, tickets) {
  destroyCharts();

  // Animals by Category
  const categories = animalReport.animalsByCategory || {};
  chartInstances.categories = new Chart(document.getElementById('chart-categories'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#22c55e', '#14b8a6', '#38bdf8', '#a78bfa', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { legend: { position: 'bottom' } },
    },
  });

  // Revenue by ticket type
  const revenueByType = {};
  tickets.forEach((t) => {
    revenueByType[t.ticketType] = (revenueByType[t.ticketType] || 0) + parseFloat(t.price);
  });

  chartInstances.revenue = new Chart(document.getElementById('chart-revenue'), {
    type: 'bar',
    data: {
      labels: Object.keys(revenueByType).length ? Object.keys(revenueByType) : ['Adult', 'Child', 'VIP'],
      datasets: [{
        label: 'Revenue ($)',
        data: Object.keys(revenueByType).length
          ? Object.values(revenueByType)
          : [revenueReport.totalRevenue * 0.5, revenueReport.totalRevenue * 0.3, revenueReport.totalRevenue * 0.2],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(74,222,128,0.06)' } },
        x: { grid: { display: false } },
      },
    },
  });

  // Visitors by date
  const visitorsByDate = visitorReport.visitorsByDate || {};
  const visitorLabels = Object.keys(visitorsByDate);
  chartInstances.visitors = new Chart(document.getElementById('chart-visitors'), {
    type: 'line',
    data: {
      labels: visitorLabels.length ? visitorLabels : ['No data'],
      datasets: [{
        label: 'Visitors',
        data: visitorLabels.length ? Object.values(visitorsByDate) : [0],
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#14b8a6',
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(74,222,128,0.06)' } },
        x: { grid: { display: false } },
      },
    },
  });

  // Health status
  const healthCounts = { Healthy: 0, Sick: 0, Critical: 0 };
  animals.forEach((a) => {
    if (healthCounts[a.healthStatus] !== undefined) {
      healthCounts[a.healthStatus]++;
    }
  });

  chartInstances.health = new Chart(document.getElementById('chart-health'), {
    type: 'polarArea',
    data: {
      labels: Object.keys(healthCounts),
      datasets: [{
        data: Object.values(healthCounts),
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
    },
  });
}

function renderActivities(animals) {
  const list = document.getElementById('activity-list');
  const activities = [];

  animals.slice(-5).reverse().forEach((a) => {
    activities.push({
      type: 'add',
      icon: 'fa-paw',
      text: `<strong>${escapeHtml(a.name)}</strong> (${escapeHtml(a.species)}) was added to the zoo`,
      time: 'Recently',
    });
  });

  animals.forEach((a) => {
    (a.feedingSchedules || []).slice(-1).forEach((f) => {
      activities.push({
        type: 'feed',
        icon: 'fa-bowl-food',
        text: `Feeding completed for <strong>${escapeHtml(a.name)}</strong> — ${escapeHtml(f.foodType)} (${f.quantity}kg)`,
        time: formatTime(f.time),
      });
    });

    (a.healthRecords || []).slice(-1).forEach((h) => {
      activities.push({
        type: 'health',
        icon: 'fa-heart-pulse',
        text: `Health check for <strong>${escapeHtml(a.name)}</strong> — ${escapeHtml(h.status)}`,
        time: formatDate(h.date),
      });
    });
  });

  if (!activities.length) {
    list.innerHTML = `
      <li class="empty-state">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <p>No recent activities yet</p>
      </li>`;
    return;
  }

  list.innerHTML = activities
    .slice(0, 8)
    .map(
      (a) => `
      <li class="activity-item">
        <div class="activity-icon ${a.type}"><i class="fa-solid ${a.icon}"></i></div>
        <div class="activity-content">
          <p>${a.text}</p>
          <small>${a.time}</small>
        </div>
      </li>`
    )
    .join('');
}

function destroyCharts() {
  Object.values(chartInstances).forEach((c) => c?.destroy());
  chartInstances = {};
}
