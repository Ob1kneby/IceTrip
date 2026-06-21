// ── App Logic ────────────────────────────────────────────────────────────────

let map, markers = [], routeLines = [], currentDay = null;

const DAY_COLORS = {
  camp: '#22c55e',
  hostel: '#4a9eff',
  froad: '#f59e0b',
  default: '#a78bfa'
};

// ── Tab Management ────────────────────────────────────────────────────────────

function showTab(tab) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  document.getElementById('map-tab').style.display = 'none';
  document.getElementById('itinerary-tab').style.display = 'none';
  document.getElementById('checklist-tab').style.display = 'none';
  document.getElementById('budget-tab').style.display = 'none';

  if (tab === 'map') {
    document.getElementById('map-tab').style.display = 'grid';
    setTimeout(() => map && map.invalidateSize(), 100);
  } else if (tab === 'itinerary') {
    document.getElementById('itinerary-tab').style.display = 'block';
    document.getElementById('itinerary-view').style.display = 'block';
  } else if (tab === 'checklist') {
    document.getElementById('checklist-tab').style.display = 'block';
    document.getElementById('checklist-view').style.display = 'block';
  } else if (tab === 'budget') {
    document.getElementById('budget-tab').style.display = 'block';
    document.getElementById('budget-view').style.display = 'block';
  }
}

// ── Map Setup ─────────────────────────────────────────────────────────────────

function initMap() {
  map = L.map('map', {
    center: [64.9, -18.5],
    zoom: 6,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  renderDayList();
  plotAllMarkers();
  drawRoute('all');
}

function getMarkerColor(day) {
  if (day.tags.includes('froad')) return DAY_COLORS.froad;
  if (day.sleep === 'camp') return DAY_COLORS.camp;
  if (day.sleep === 'hostel') return DAY_COLORS.hostel;
  return DAY_COLORS.default;
}

function createMarkerIcon(day) {
  const color = getMarkerColor(day);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
      <path d="M18 2C10.3 2 4 8.3 4 16c0 10 14 24 14 24S32 26 32 16C32 8.3 25.7 2 18 2z" fill="${color}" stroke="rgba(0,0,0,0.4)" stroke-width="1.5"/>
      <circle cx="18" cy="16" r="8" fill="rgba(0,0,0,0.35)"/>
      <text x="18" y="20" text-anchor="middle" fill="white" font-size="9" font-weight="700" font-family="system-ui">${day.num}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44]
  });
}

function plotAllMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  TRIP_DATA.days.forEach(day => {
    const marker = L.marker([day.lat, day.lng], { icon: createMarkerIcon(day) })
      .addTo(map)
      .bindPopup(buildPopup(day), { maxWidth: 260, className: 'iceland-popup' });

    marker.on('click', () => {
      highlightDay(day.num);
    });

    markers.push(marker);
  });
}

function buildPopup(day) {
  const sleepIcon = day.sleep === 'camp' ? '⛺' : day.sleep === 'hostel' ? '🏠' : '✈️';
  const tags = day.tags.map(t => {
    const labels = { camp: '⛺ Camp', hostel: '🛏 Hostel', froad: '🚗 F-Road', hike: '🥾 Hike', excursion: '🎯 Activity' };
    return `<span style="background:rgba(255,255,255,0.12);border-radius:4px;padding:2px 6px;font-size:10px;margin-right:4px;">${labels[t] || t}</span>`;
  }).join('');

  return `
    <div class="popup-inner">
      <div class="popup-day">Day ${day.num} · ${day.date}</div>
      <div class="popup-title">${day.title}</div>
      <div style="margin-bottom:6px">${tags}</div>
      <div class="popup-desc">${day.summary}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
        <span style="font-size:12px;color:var(--muted)">${sleepIcon} ${day.accommodation}</span>
        <span style="font-size:13px;font-weight:600;color:#f59e0b">~$${day.costPP}pp</span>
      </div>
      <button class="popup-btn" style="margin-top:8px;width:100%" onclick="openDetail(${day.num})">Full details →</button>
    </div>`;
}

// ── Route Drawing ─────────────────────────────────────────────────────────────

function showRoute(region, btn) {
  document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  drawRoute(region);
}

function drawRoute(region) {
  routeLines.forEach(l => map.removeLayer(l));
  routeLines = [];

  let days = TRIP_DATA.days;
  if (region !== 'all') {
    const indices = TRIP_DATA.regions[region] || [];
    days = TRIP_DATA.days.filter(d => indices.includes(d.num));
  }

  const coords = days.map(d => [d.lat, d.lng]);

  if (coords.length > 1) {
    const line = L.polyline(coords, {
      color: '#4a9eff',
      weight: 2.5,
      opacity: 0.7,
      dashArray: '8 5',
    }).addTo(map);
    routeLines.push(line);

    if (region !== 'all') {
      map.fitBounds(line.getBounds(), { padding: [40, 40] });
    }
  }

  if (region === 'all') {
    map.setView([64.9, -18.5], 6);
  }
}

// ── Day List ──────────────────────────────────────────────────────────────────

function renderDayList() {
  const list = document.getElementById('day-list');
  list.innerHTML = '';

  TRIP_DATA.days.forEach(day => {
    const el = document.createElement('div');
    el.className = `day-item sleep-${day.sleep === 'hostel' ? 'hostel' : 'camp'}`;
    el.id = `day-list-${day.num}`;

    const tagHTML = day.tags.map(t => {
      const cfg = {
        camp: ['tag-camp', 'Camp'],
        hostel: ['tag-hostel', 'Hostel'],
        froad: ['tag-froad', 'F-Road'],
        hike: ['tag-hike', 'Hike'],
        excursion: ['tag-excursion', 'Activity'],
      };
      const [cls, label] = cfg[t] || ['', t];
      return `<span class="tag ${cls}">${label}</span>`;
    }).join('');

    el.innerHTML = `
      <div class="day-num">${day.num}</div>
      <div class="day-info">
        <div class="day-date">${day.date}</div>
        <div class="day-title">${day.title}</div>
        <div class="day-tags">${tagHTML}</div>
      </div>
      <div class="day-cost">~$${day.costPP}pp</div>`;

    el.onclick = () => {
      highlightDay(day.num);
      openDetail(day.num);
      map.setView([day.lat, day.lng], 9, { animate: true });
      markers[day.num - 1].openPopup();
    };

    list.appendChild(el);
  });
}

function highlightDay(num) {
  document.querySelectorAll('.day-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById(`day-list-${num}`);
  if (el) { el.classList.add('active'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  currentDay = num;
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function openDetail(num) {
  const day = TRIP_DATA.days[num - 1];
  if (!day) return;

  highlightDay(num);

  const panel = document.getElementById('detail-panel');
  const body = document.getElementById('detail-body');
  const label = document.getElementById('detail-day-label');

  label.textContent = `Day ${day.num} · ${day.date}`;

  const sleepBadge = day.sleep === 'camp'
    ? `<span class="detail-day-badge" style="background:#14532d;color:#86efac">⛺ Camp Night</span>`
    : day.sleep === 'hostel'
    ? `<span class="detail-day-badge" style="background:#1e3a5f;color:#93c5fd">🏠 Hostel Night</span>`
    : `<span class="detail-day-badge" style="background:#3b1f6b;color:#c4b5fd">✈️ Fly Home</span>`;

  let html = `
    ${sleepBadge}
    <div class="detail-title">${day.title}</div>
    <div class="detail-meta">
      <span>${day.date}</span>
      ${day.accommodation !== '—' ? `<span>· ${day.accommodation}</span>` : ''}
      <span style="color:var(--amber);font-weight:600">· ~$${day.costPP}pp</span>
    </div>`;

  // Schedule
  if (day.schedule && day.schedule.length) {
    html += `<div class="detail-section"><div class="detail-section-title">Schedule</div>`;
    day.schedule.forEach(s => {
      html += `<div class="schedule-item">
        <div class="schedule-time">${s.time}</div>
        <div><div class="schedule-desc">${s.desc}</div>${s.note ? `<div class="schedule-note">${s.note}</div>` : ''}</div>
      </div>`;
    });
    html += `</div>`;
  }

  // Hikes
  if (day.hikes && day.hikes.length) {
    html += `<div class="detail-section"><div class="detail-section-title">🥾 Hikes & Trails</div>`;
    day.hikes.forEach(h => {
      html += `<div class="hike-card">
        <div class="hike-name">${h.name}</div>
        <div class="hike-stats">
          <span class="hike-stat">📏 ${h.distance}</span>
          <span class="hike-stat">⏱ ${h.time}</span>
          <span class="hike-stat">⬆ ${h.gain}</span>
          <span class="hike-stat">💪 ${h.difficulty}</span>
        </div>
        <div class="hike-desc">${h.desc}</div>
      </div>`;
    });
    html += `</div>`;
  }

  // Excursions
  if (day.excursions && day.excursions.length) {
    html += `<div class="detail-section"><div class="detail-section-title">🎯 Booked Activities</div>`;
    day.excursions.forEach(e => {
      html += `<div class="excursion-block">
        <div class="exc-name">${e.name}</div>
        <div class="exc-meta">${e.operator} · ${e.duration}</div>
        <div class="exc-price">${e.price}</div>
        <div class="exc-desc">${e.desc}</div>
      </div>`;
    });
    html += `</div>`;
  }

  // Warnings
  if (day.warnings && day.warnings.length) {
    html += `<div class="detail-section"><div class="detail-section-title">⚠️ Safety & Warnings</div>`;
    day.warnings.forEach(w => { html += `<div class="warn-box">${w}</div>`; });
    html += `</div>`;
  }

  // Tips
  if (day.tips && day.tips.length) {
    html += `<div class="detail-section"><div class="detail-section-title">💡 Tips</div>`;
    day.tips.forEach(t => { html += `<div class="tip-box" style="margin-bottom:8px">${t}</div>`; });
    html += `</div>`;
  }

  // Costs
  const costs = day.costs || {};
  const total = Object.values(costs).reduce((a, b) => a + b, 0);
  if (total > 0) {
    html += `<div class="detail-section"><div class="detail-section-title">💰 Day Costs (per person)</div>
      <div class="cost-breakdown">`;
    if (costs.accommodation) html += `<div class="cost-row"><span>Accommodation</span><span>$${costs.accommodation}</span></div>`;
    if (costs.food) html += `<div class="cost-row"><span>Food</span><span>$${costs.food}</span></div>`;
    if (costs.activities) html += `<div class="cost-row"><span>Activities</span><span>$${costs.activities}</span></div>`;
    if (costs.fuel) html += `<div class="cost-row"><span>Fuel (est.)</span><span>$${costs.fuel}</span></div>`;
    if (costs.parking) html += `<div class="cost-row"><span>Parking</span><span>$${costs.parking}</span></div>`;
    html += `<div class="cost-row" style="font-weight:700;color:var(--amber)"><span>Day total</span><span>~$${total}</span></div>
      </div></div>`;
  }

  body.innerHTML = html;
  panel.classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
}

// ── Itinerary Tab ─────────────────────────────────────────────────────────────

function buildItinerary() {
  const container = document.getElementById('itin-days');
  container.innerHTML = '';

  TRIP_DATA.days.forEach(day => {
    const sleepColor = day.sleep === 'camp' ? '#14532d' : day.sleep === 'hostel' ? '#1e3a5f' : '#2d1b69';
    const numColor = day.sleep === 'camp' ? '#86efac' : day.sleep === 'hostel' ? '#93c5fd' : '#c4b5fd';

    const tagHTML = day.tags.map(t => {
      const cfg = { camp: ['tag-camp', 'Camp'], hostel: ['tag-hostel', 'Hostel'], froad: ['tag-froad', 'F-Road'], hike: ['tag-hike', 'Hike'], excursion: ['tag-excursion', 'Activity'] };
      const [cls, label] = cfg[t] || ['', t];
      return `<span class="tag ${cls}">${label}</span>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'itin-day';
    el.id = `itin-day-${day.num}`;

    let bodyHTML = '';

    // Schedule
    if (day.schedule && day.schedule.length) {
      bodyHTML += `<div class="itin-section-label">Schedule</div><div class="itin-schedule">`;
      day.schedule.forEach(s => {
        bodyHTML += `<div class="itin-schedule-row">
          <div class="itin-time">${s.time}</div>
          <div class="itin-desc">${s.desc}${s.note ? `<div class="itin-sub-note">${s.note}</div>` : ''}</div>
        </div>`;
      });
      bodyHTML += `</div>`;
    }

    // Hikes
    if (day.hikes && day.hikes.length) {
      bodyHTML += `<div class="itin-section-label">Hikes & Trails</div>`;
      day.hikes.forEach(h => {
        bodyHTML += `<div class="itin-hike">
          <div class="itin-hike-name">${h.name}</div>
          <div class="itin-hike-stats">
            <span class="itin-hike-stat">${h.distance}</span>
            <span class="itin-hike-stat">${h.time}</span>
            <span class="itin-hike-stat">${h.gain}</span>
            <span class="itin-hike-stat">${h.difficulty}</span>
          </div>
          <div class="itin-hike-desc">${h.desc}</div>
        </div>`;
      });
    }

    // Excursions
    if (day.excursions && day.excursions.length) {
      bodyHTML += `<div class="itin-section-label">Booked Activities</div>`;
      day.excursions.forEach(e => {
        bodyHTML += `<div class="itin-exc">
          <div class="itin-exc-name">${e.name}</div>
          <div class="itin-exc-meta">${e.operator} · ${e.duration}</div>
          <div class="itin-exc-price">${e.price}</div>
          <div class="itin-exc-desc">${e.desc}</div>
        </div>`;
      });
    }

    // Warnings
    if (day.warnings && day.warnings.length) {
      bodyHTML += `<div class="itin-section-label">⚠ Warnings</div>`;
      day.warnings.forEach(w => { bodyHTML += `<div class="itin-warn">${w}</div>`; });
    }

    // Tips
    if (day.tips && day.tips.length) {
      bodyHTML += `<div class="itin-section-label">Tips</div>`;
      day.tips.forEach(t => { bodyHTML += `<div class="itin-tip">${t}</div>`; });
    }

    // Costs
    const costs = day.costs || {};
    const total = Object.values(costs).reduce((a, b) => a + b, 0);
    if (total > 0) {
      bodyHTML += `<div class="itin-section-label">Day Costs (per person)</div>`;
      if (costs.accommodation) bodyHTML += `<div class="itin-cost-row"><span>Accommodation</span><span>$${costs.accommodation}</span></div>`;
      if (costs.food) bodyHTML += `<div class="itin-cost-row"><span>Food</span><span>$${costs.food}</span></div>`;
      if (costs.activities) bodyHTML += `<div class="itin-cost-row"><span>Activities</span><span>$${costs.activities}</span></div>`;
      if (costs.fuel) bodyHTML += `<div class="itin-cost-row"><span>Fuel (est.)</span><span>$${costs.fuel}</span></div>`;
      if (costs.parking) bodyHTML += `<div class="itin-cost-row"><span>Parking</span><span>$${costs.parking}</span></div>`;
      bodyHTML += `<div class="itin-cost-row"><span>Day total</span><span>~$${total}</span></div>`;
    }

    el.innerHTML = `
      <div class="itin-day-head" onclick="toggleItinDay(${day.num})">
        <div class="itin-day-num" style="background:${sleepColor};color:${numColor}">${day.num}</div>
        <div class="itin-day-info">
          <div class="itin-day-title">${day.title}</div>
          <div class="itin-day-sub">${day.date} · ${day.accommodation} <span style="margin-left:6px">${tagHTML}</span></div>
        </div>
        <div class="itin-day-right">
          <div class="itin-day-cost">~$${day.costPP}pp</div>
          <div class="itin-chevron">›</div>
        </div>
      </div>
      <div class="itin-day-body">${bodyHTML}</div>`;

    container.appendChild(el);
  });
}

function toggleItinDay(num) {
  const el = document.getElementById(`itin-day-${num}`);
  if (el) el.classList.toggle('open');
}

// ── Checklist Tab ─────────────────────────────────────────────────────────────

let checkState = {};

function buildChecklist() {
  const container = document.getElementById('checklist-content');
  container.innerHTML = '';

  const badgeConfig = {
    urgent: ['badge-urgent', '🔴 Do today'],
    soon: ['badge-soon', '🟡 1-2 weeks'],
    before: ['badge-before', '🔵 Before departure'],
    gear: ['badge-gear', '🟣 Gear'],
  };

  TRIP_DATA.checklist.forEach((section, si) => {
    const [badgeCls, badgeLabel] = badgeConfig[section.badge] || ['', ''];
    const total = section.items.length;
    const done = section.items.filter((_, ii) => checkState[`${si}-${ii}`]).length;

    const el = document.createElement('div');
    el.className = 'checklist-section';
    el.id = `cl-section-${si}`;

    let itemsHTML = '';
    section.items.forEach((item, ii) => {
      const key = `${si}-${ii}`;
      const isDone = checkState[key] || false;
      itemsHTML += `<div class="check-item ${isDone ? 'done' : ''}" id="check-${si}-${ii}" onclick="toggleCheck(${si}, ${ii})">
        <div class="check-box"></div>
        <div class="check-info">
          <div class="check-text">${item.text}</div>
          ${item.sub ? `<div class="check-sub">${item.sub}</div>` : ''}
          ${item.url ? `<a class="check-link" href="${item.url}" target="_blank" onclick="event.stopPropagation()">${item.url.replace('https://', '')} ↗</a>` : ''}
        </div>
      </div>`;
    });

    el.innerHTML = `
      <div class="checklist-section-head">
        <h3>${section.section}</h3>
        <span class="checklist-badge ${badgeCls}">${badgeLabel}</span>
      </div>
      <div class="checklist-items">${itemsHTML}</div>
      <div class="checklist-progress" id="cl-prog-${si}">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span>${done}/${total} completed</span>
          <span>${Math.round((done/total)*100)}%</span>
        </div>
        <div class="progress-bar-wrap"><div class="progress-bar" id="cl-bar-${si}" style="width:${Math.round((done/total)*100)}%"></div></div>
      </div>`;

    container.appendChild(el);
  });
}

function toggleCheck(si, ii) {
  const key = `${si}-${ii}`;
  checkState[key] = !checkState[key];

  // Save to localStorage
  try { localStorage.setItem('iceland-checks', JSON.stringify(checkState)); } catch(e) {}

  // Update UI for just this item
  const el = document.getElementById(`check-${si}-${ii}`);
  if (el) el.classList.toggle('done', checkState[key]);

  // Update progress
  const section = TRIP_DATA.checklist[si];
  const total = section.items.length;
  const done = section.items.filter((_, ii2) => checkState[`${si}-${ii2}`]).length;
  const pct = Math.round((done / total) * 100);

  const prog = document.getElementById(`cl-prog-${si}`);
  if (prog) prog.querySelector('span').textContent = `${done}/${total} completed`;
  const bar = document.getElementById(`cl-bar-${si}`);
  if (bar) bar.style.width = pct + '%';
}

function loadCheckState() {
  try {
    const saved = localStorage.getItem('iceland-checks');
    if (saved) checkState = JSON.parse(saved);
  } catch(e) { checkState = {}; }
}

// ── Budget Tab ────────────────────────────────────────────────────────────────

function buildBudget() {
  const container = document.getElementById('budget-content');

  const fixedTotal = TRIP_DATA.budget.fixed.reduce((a, b) => a + b.pp, 0);
  const accomTotal = TRIP_DATA.budget.accommodation.reduce((a, b) => a + b.pp, 0);
  const foodTotal = TRIP_DATA.budget.food.reduce((a, b) => a + b.pp, 0);
  const actTotal = TRIP_DATA.budget.activities.reduce((a, b) => a + b.pp, 0);
  const fuelTotal = TRIP_DATA.budget.fuel.reduce((a, b) => a + b.cost, 0);
  const parkTotal = TRIP_DATA.budget.parking.reduce((a, b) => a + b.cost, 0);
  const grandPP = fixedTotal + accomTotal + foodTotal + actTotal + fuelTotal + parkTotal;
  const grand2 = grandPP * 2;

  let html = `
    <div class="budget-summary">
      <div class="budget-stat"><div class="val">$${Math.round(grandPP).toLocaleString()}</div><div class="lbl">Total per person</div></div>
      <div class="budget-stat"><div class="val">$${Math.round(grand2).toLocaleString()}</div><div class="lbl">Total for 2</div></div>
      <div class="budget-stat"><div class="val">$${Math.round(grandPP/15)}</div><div class="lbl">Avg per day/pp</div></div>
    </div>`;

  // Fixed costs
  html += buildBudgetTable('Fixed Costs (split between 2)', TRIP_DATA.budget.fixed.map(i => ({ label: i.label, sub: i.sub, pp: i.pp, total: i.total })));

  // Accommodation
  html += buildBudgetTable('Accommodation', TRIP_DATA.budget.accommodation.map(i => ({ label: i.label, sub: i.sub, pp: i.pp, total: i.total })));

  // Food
  html += buildBudgetTable('Food', TRIP_DATA.budget.food.map(i => ({ label: i.label, sub: i.sub, pp: i.pp, total: i.total })));

  // Activities
  html += buildBudgetTable('Activities & Excursions', TRIP_DATA.budget.activities.map(i => ({ label: i.label, sub: i.sub, pp: i.pp, total: i.total })));

  // Fuel
  html += `<div class="budget-table">
    <div class="budget-table-head"><span>Fuel Costs (per person, split between 2)</span><span style="color:var(--amber)">Total: ~$${Math.round(fuelTotal)} pp</span></div>`;
  TRIP_DATA.budget.fuel.forEach(f => {
    html += `<div class="budget-row">
      <div class="br-label">${f.leg}<div class="br-sub">${f.km}km</div></div>
      <div class="br-pp">$${f.cost}</div>
    </div>`;
  });
  html += `<div class="budget-row total"><div class="br-label">Total fuel</div><div class="br-pp">$${Math.round(fuelTotal)}</div></div>
  </div>`;

  // Parking
  html += `<div class="budget-table">
    <div class="budget-table-head"><span>Parking Costs (per person, split between 2)</span><span style="color:var(--amber)">Total: ~$${Math.round(parkTotal)} pp</span></div>`;
  TRIP_DATA.budget.parking.forEach(p => {
    html += `<div class="budget-row">
      <div class="br-label">${p.site}</div>
      <div class="br-pp">$${p.cost}</div>
    </div>`;
  });
  html += `<div class="budget-row total"><div class="br-label">Total parking</div><div class="br-pp">$${Math.round(parkTotal)}</div></div>
  </div>`;

  // Grand total
  html += `<div class="budget-table">
    <div class="budget-table-head">Grand Total Summary</div>
    <div class="budget-row"><div class="br-label">Fixed costs</div><div class="br-pp">$${fixedTotal}</div><div class="br-total">$${fixedTotal*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Accommodation</div><div class="br-pp">$${accomTotal}</div><div class="br-total">$${accomTotal*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Food</div><div class="br-pp">$${foodTotal}</div><div class="br-total">$${foodTotal*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Activities</div><div class="br-pp">$${actTotal}</div><div class="br-total">$${actTotal*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Fuel</div><div class="br-pp">$${fuelTotal}</div><div class="br-total">$${fuelTotal*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Parking</div><div class="br-pp">$${parkTotal}</div><div class="br-total">$${parkTotal*2} for 2</div></div>
    <div class="budget-row total"><div class="br-label">GRAND TOTAL</div><div class="br-pp">$${Math.round(grandPP).toLocaleString()}</div><div class="br-total" style="color:var(--amber)">$${Math.round(grand2).toLocaleString()} for 2</div></div>
  </div>`;

  container.innerHTML = html;
}

function buildBudgetTable(title, rows) {
  const total = rows.reduce((a, b) => a + (b.pp || 0), 0);
  let html = `<div class="budget-table">
    <div class="budget-table-head"><span>${title}</span><span style="color:var(--amber)">$${total} pp</span></div>`;
  rows.forEach(r => {
    html += `<div class="budget-row">
      <div class="br-label">${r.label}${r.sub ? `<div class="br-sub">${r.sub}</div>` : ''}</div>
      <div class="br-pp">$${r.pp}</div>
      <div class="br-total">$${r.total} total</div>
    </div>`;
  });
  html += `<div class="budget-row total"><div class="br-label">Subtotal</div><div class="br-pp">$${total}</div></div>
  </div>`;
  return html;
}

// ── README generation ─────────────────────────────────────────────────────────

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadCheckState();
  initMap();
  buildItinerary();
  buildChecklist();
  buildBudget();
});
