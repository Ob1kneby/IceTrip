// Iceland Ring Road 2026 — App Logic

let map, markers=[], routeLines=[], currentDay=null;
let editState={}, checkState={};

// ─────────────────────────────────────────────────────────────────────────────
// TAB MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
function showTab(id, btn){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>{ p.style.display='none'; });
  if(btn) btn.classList.add('active');
  const pane = document.getElementById('tab-'+id);
  if(pane){ pane.style.display = id==='map' ? 'flex' : 'block'; }
  if(id==='map') setTimeout(()=>map&&map.invalidateSize(),80);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP
// ─────────────────────────────────────────────────────────────────────────────
function dayColor(day){
  if(day.froad) return '#f59e0b';
  if(day.sleep==='camp') return '#22c55e';
  if(day.sleep==='hostel') return '#4a9eff';
  return '#a78bfa';
}

function makeIcon(day){
  const c=dayColor(day);
  return L.divIcon({
    html:`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="38" viewBox="0 0 32 38">
      <path d="M16 1C9 1 3 7 3 14c0 9 13 23 13 23S29 23 29 14C29 7 23 1 16 1z" fill="${c}" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>
      <circle cx="16" cy="14" r="7" fill="rgba(0,0,0,.3)"/>
      <text x="16" y="18" text-anchor="middle" fill="white" font-size="8" font-weight="700" font-family="-apple-system,system-ui">${day.num}</text>
    </svg>`,
    className:'', iconSize:[32,38], iconAnchor:[16,38], popupAnchor:[0,-40]
  });
}

function initMap(){
  map = L.map('map',{center:[64.9,-18.5],zoom:6,zoomControl:true});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);
  buildDayList();
  plotMarkers();
  drawRoute('all');
}

function plotMarkers(){
  markers.forEach(m=>map.removeLayer(m)); markers=[];
  TRIP_DATA.days.forEach(day=>{
    const m = L.marker([day.lat,day.lng],{icon:makeIcon(day)})
      .addTo(map).bindPopup(buildPopup(day),{maxWidth:270});
    m.on('click',()=>highlightDay(day.num));
    markers.push(m);
  });
}

function puffinDay(n){ return n===4||n===8||n===9; }

function buildPopup(day){
  const slp = day.sleep==='camp'?'⛺ Camp':day.sleep==='hostel'?'🏠 Hostel':'✈️ Fly home';
  const puf = puffinDay(day.num)?`<span class="tag t-puffin" style="font-size:10px;padding:2px 7px">🐦 Puffins</span>`:'';
  const frd = day.froad?`<span class="tag t-froad" style="font-size:10px;padding:2px 7px">⚠ F-Road</span>`:'';
  const exc = day.excursions?.length?`<span class="tag t-exc" style="font-size:10px;padding:2px 7px">🎯 Activity</span>`:'';
  return `<div class="pu">
    <div class="pu-day">Day ${day.num} · ${day.date}${day.dow?' · '+day.dow:''}</div>
    <div class="pu-title">${day.title}</div>
    <div class="pu-badges">${puf}${frd}${exc}</div>
    <div class="pu-sum">${day.summary}</div>
    <div class="pu-meta">${slp} · ${day.accommodation}${day.drive?' · '+day.drive:''}</div>
    <button class="pu-btn" onclick="openDetail(${day.num})">Full details →</button>
  </div>`;
}

function showRoute(region, btn){
  document.querySelectorAll('.rpill').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  routeLines.forEach(l=>map.removeLayer(l)); routeLines=[];
  let days = TRIP_DATA.days;
  if(region!=='all'){
    const idx=TRIP_DATA.regions[region]||[];
    days=days.filter(d=>idx.includes(d.num));
  }
  if(days.length>1){
    const ln = L.polyline(days.map(d=>[d.lat,d.lng]),{color:'#4a9eff',weight:2.5,opacity:.75,dashArray:'8 5'}).addTo(map);
    routeLines.push(ln);
    if(region!=='all') map.fitBounds(ln.getBounds(),{padding:[40,40]});
  }
  if(region==='all') map.setView([64.9,-18.5],6);
}

// ─────────────────────────────────────────────────────────────────────────────
// DAY LIST SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function buildDayList(){
  const sc=document.getElementById('day-scroll'); sc.innerHTML='';
  TRIP_DATA.days.forEach(day=>{
    const el=document.createElement('div');
    const cls=day.sleep==='hostel'?'dn-hostel':day.sleep==='camp'?'dn-camp':'dn-fly';
    el.className='day-row'; el.id=`dr-${day.num}`;
    const puf=puffinDay(day.num)?`<span class="tag t-puffin">Puffins</span>`:'';
    const frd=day.froad?`<span class="tag t-froad">F-Road</span>`:'';
    const exc=day.excursions?.length?`<span class="tag t-exc">Activity</span>`:'';
    const hike=day.hikes?.length?`<span class="tag t-hike">Hike</span>`:'';
    el.innerHTML=`<div class="day-num-dot ${cls}">${day.num}</div>
      <div class="day-row-info">
        <div class="dr-date">${day.date}</div>
        <div class="dr-title">${day.title}</div>
        <div class="dr-tags">${frd}${hike}${exc}${puf}</div>
      </div>`;
    el.onclick=()=>{
      highlightDay(day.num);
      map.setView([day.lat,day.lng],9,{animate:true});
      markers[day.num-1]?.openPopup();
      openDetail(day.num);
    };
    sc.appendChild(el);
  });
}

function highlightDay(num){
  document.querySelectorAll('.day-row').forEach(e=>e.classList.remove('active'));
  const el=document.getElementById(`dr-${num}`);
  if(el){ el.classList.add('active'); el.scrollIntoView({block:'nearest',behavior:'smooth'}); }
  currentDay=num;
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PANEL (map slide-in)
// ─────────────────────────────────────────────────────────────────────────────
function openDetail(num){
  const day=TRIP_DATA.days[num-1]; if(!day) return;
  highlightDay(num);
  document.getElementById('det-label').textContent=`Day ${day.num} · ${day.date}`;
  const bclr=day.sleep==='camp'?'background:#14532d;color:#86efac':day.sleep==='hostel'?'background:#1e3a5f;color:#93c5fd':'background:#2d1b69;color:#c4b5fd';
  const blbl=day.sleep==='camp'?'⛺ Camp night':day.sleep==='hostel'?'🏠 Hostel night':'✈️ Fly home';
  let h=`<span class="det-badge" style="${bclr}">${blbl}</span>
    <div class="det-title">${day.title}</div>
    <div class="det-meta">${day.date}${day.dow?' · '+day.dow:''} · ${day.accommodation}</div>`;
  // Drive/distance pills
  if(day.drive||day.distance){
    h+=`<div class="det-drive">`;
    if(day.distance) h+=`<span class="det-drive-pill">📍 ${day.distance}</span>`;
    if(day.drive) h+=`<span class="det-drive-pill">🚗 ${day.drive}</span>`;
    h+=`</div>`;
  }
  // F-road alert
  if(day.froad){
    const fd=FROAD_DATA[day.froad.id];
    h+=`<div class="dsec"><div class="dsec-title">F-Road Status</div>
      <div class="info-box">
        <strong>${fd.name}</strong><br>
        Avg opening: <strong>${fd.average}</strong> · Your date: <strong>${day.froad.tripDate}</strong><br>
        ${day.froad.note}<br>
        <a href="${fd.liveUrl}" target="_blank" style="color:#fbbf24;font-weight:600">Check live status →</a>
      </div></div>`;
  }
  // Schedule
  if(day.schedule?.length){
    h+=`<div class="dsec"><div class="dsec-title">Schedule</div>`;
    day.schedule.forEach(s=>{
      h+=`<div class="sched-row"><div class="sched-time">${s.time}</div><div class="sched-desc">${s.desc}${s.note?`<div class="sched-note">${s.note}</div>`:''}</div></div>`;
    });
    h+=`</div>`;
  }
  // Hikes
  if(day.hikes?.length){
    h+=`<div class="dsec"><div class="dsec-title">Hikes &amp; Trails</div>`;
    day.hikes.forEach(hk=>{
      h+=`<div class="hike-card"><div class="hike-name">${hk.name}</div>
        <div class="hike-stats">
          <span class="hstat">📏 ${hk.distance}</span><span class="hstat">⏱ ${hk.time}</span>
          <span class="hstat">⬆ ${hk.gain}</span><span class="hstat">💪 ${hk.difficulty}</span>
        </div>
        <div class="hike-desc">${hk.desc}</div></div>`;
    });
    h+=`</div>`;
  }
  // Excursions
  if(day.excursions?.length){
    h+=`<div class="dsec"><div class="dsec-title">Booked Activities</div>`;
    day.excursions.forEach(e=>{
      h+=`<div class="exc-card"><div class="exc-name">${e.name}</div>
        <div class="exc-meta">${e.operator} · ${e.duration}</div>
        <div class="exc-price">${e.price}</div>
        <div class="exc-desc">${e.desc}</div>
        ${e.url?`<a class="exc-link" href="${e.url}" target="_blank">Book here ↗</a>`:''}</div>`;
    });
    h+=`</div>`;
  }
  // Warnings
  if(day.warnings?.length){
    h+=`<div class="dsec"><div class="dsec-title">⚠ Warnings</div>`;
    day.warnings.forEach(w=>{ h+=`<div class="warn-box">${w}</div>`; });
    h+=`</div>`;
  }
  // Tips
  if(day.tips?.length){
    h+=`<div class="dsec"><div class="dsec-title">Tips</div>`;
    day.tips.forEach(t=>{ h+=`<div class="tip-box">${t}</div>`; });
    h+=`</div>`;
  }
  // Personal notes
  if(editState[num]?.notes){
    h+=`<div class="dsec"><div class="dsec-title">Your Notes</div><div class="tip-box" style="white-space:pre-wrap">${editState[num].notes}</div></div>`;
  }
  document.getElementById('det-body').innerHTML=h;
  document.getElementById('detail-panel').classList.add('open');
}
function closeDetail(){ document.getElementById('detail-panel').classList.remove('open'); }

// ─────────────────────────────────────────────────────────────────────────────
// ITINERARY TAB — fully flushed out
// ─────────────────────────────────────────────────────────────────────────────
function buildItinerary(){
  const c=document.getElementById('itin-days'); c.innerHTML='';
  TRIP_DATA.days.forEach(day=>{
    const sc=day.sleep==='camp'?'#14532d':day.sleep==='hostel'?'#1e3a5f':'#2d1b69';
    const nc=day.sleep==='camp'?'#86efac':day.sleep==='hostel'?'#93c5fd':'#c4b5fd';
    // Tags in header
    const tagMap={camp:['t-camp','Camp'],hostel:['t-hostel','Hostel'],hike:['t-hike','Hike'],excursion:['t-exc','Activity'],froad:['t-froad','F-Road']};
    const thtml=day.tags.map(t=>{const[c,l]=tagMap[t]||['','']; return l?`<span class="tag ${c}">${l}</span>`:''}).join('');
    const puf=puffinDay(day.num)?`<span class="tag t-puffin">🐦 Puffins</span>`:'';

    // ── Body content ──
    let body='';

    // F-road alert banner
    if(day.froad){
      const fd=FROAD_DATA[day.froad.id];
      body+=`<div class="ii">
        <strong>F-Road: ${fd.name}</strong> — average opening ${fd.average} · your date ${day.froad.tripDate}<br>
        ${day.froad.note}
        <a href="${fd.liveUrl}" target="_blank" style="color:#fbbf24;font-weight:600;margin-left:4px">Live status →</a>
      </div>`;
    }

    // Drive info
    if(day.drive||day.distance){
      body+=`<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">`;
      if(day.distance) body+=`<span class="itin-meta-pill">📍 ${day.distance}</span>`;
      if(day.drive) body+=`<span class="itin-meta-pill">🚗 ${day.drive}</span>`;
      body+=`</div>`;
    }

    // Schedule
    if(day.schedule?.length){
      body+=`<div class="sec-lbl">Schedule</div>`;
      day.schedule.forEach(s=>{
        body+=`<div class="isc-row">
          <div class="isc-time">${s.time}</div>
          <div class="isc-desc">${s.desc}${s.note?`<div class="isc-note">${s.note}</div>`:''}</div>
        </div>`;
      });
    }

    // Hikes
    if(day.hikes?.length){
      body+=`<div class="sec-lbl">Hikes &amp; Trails</div>`;
      day.hikes.forEach(hk=>{
        body+=`<div class="ih">
          <div class="ih-name">${hk.name}</div>
          <div class="ih-stats">
            <span class="ih-stat">📏 ${hk.distance}</span>
            <span class="ih-stat">⏱ ${hk.time}</span>
            <span class="ih-stat">⬆ ${hk.gain}</span>
            <span class="ih-stat">💪 ${hk.difficulty}</span>
          </div>
          <div class="ih-desc">${hk.desc}</div>
        </div>`;
      });
    }

    // Excursions
    if(day.excursions?.length){
      body+=`<div class="sec-lbl">Booked Activities</div>`;
      day.excursions.forEach(e=>{
        body+=`<div class="ie">
          <div class="ie-name">${e.name}</div>
          <div class="ie-meta">${e.operator} · ${e.duration}</div>
          <div class="ie-price">${e.price}</div>
          <div class="ie-desc">${e.desc}</div>
          ${e.url?`<a href="${e.url}" target="_blank" style="font-size:10px;color:var(--blue);display:block;margin-top:5px;font-weight:500">Book here ↗</a>`:''}
        </div>`;
      });
    }

    // Warnings
    if(day.warnings?.length){
      body+=`<div class="sec-lbl">Warnings</div>`;
      day.warnings.forEach(w=>{ body+=`<div class="iw">${w}</div>`; });
    }

    // Tips
    if(day.tips?.length){
      body+=`<div class="sec-lbl">Tips &amp; Local Knowledge</div>`;
      day.tips.forEach(t=>{ body+=`<div class="it">${t}</div>`; });
    }

    // Personal notes from edit state
    if(editState[day.num]?.notes){
      body+=`<div class="sec-lbl">Your Notes</div><div class="it" style="white-space:pre-wrap">${editState[day.num].notes}</div>`;
    }

    const el=document.createElement('div');
    el.className='itin-day'; el.id=`id-${day.num}`;
    el.innerHTML=`
      <div class="itin-head" onclick="toggleItin(${day.num})">
        <div class="itin-num" style="background:${sc};color:${nc}">${day.num}</div>
        <div class="itin-info">
          <div class="itin-title">${day.title}</div>
          <div class="itin-sub">
            <span>${day.date}${day.dow?' · '+day.dow:''}</span>
            <span style="color:var(--border2)">·</span>
            <span>${day.accommodation}</span>
            <span style="display:flex;gap:3px;flex-wrap:wrap;margin-top:1px">${thtml}${puf}</span>
          </div>
        </div>
        <div class="itin-chevron">›</div>
      </div>
      <div class="itin-body">${body}</div>`;
    c.appendChild(el);
  });
}
function toggleItin(num){ document.getElementById(`id-${num}`)?.classList.toggle('open'); }

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST — fully flushed out with master progress + all badge types
// ─────────────────────────────────────────────────────────────────────────────
function buildChecklist(){
  buildMasterProgress();
  const c=document.getElementById('checklist-content'); c.innerHTML='';
  const bm={
    urgent:['cb-urgent','🔴 Do today'],
    soon:['cb-soon','🟡 1–2 weeks'],
    before:['cb-before','🔵 Before departure'],
    gear:['cb-gear','🟣 Gear & vehicle'],
    info:['cb-info','📋 Emergency contacts'],
  };
  TRIP_DATA.checklist.forEach((sec,si)=>{
    const[bc,bl]=bm[sec.badge]||['cb-before',sec.badge];
    const total=sec.items.length;
    const done=sec.items.filter((_,ii)=>checkState[`${si}-${ii}`]).length;
    const pct=Math.round((done/total)*100);
    const el=document.createElement('div');
    el.className='cl-section';
    let items='';
    sec.items.forEach((item,ii)=>{
      const isDone=checkState[`${si}-${ii}`]||false;
      items+=`<div class="cl-item${isDone?' done':''}" id="ci-${si}-${ii}" onclick="toggleCheck(${si},${ii})">
        <div class="cl-check"></div>
        <div class="cl-info">
          <div class="cl-text">${item.text}</div>
          ${item.sub?`<div class="cl-sub">${item.sub}</div>`:''}
          ${item.url?`<a class="cl-link" href="${item.url}" target="_blank" onclick="event.stopPropagation()">${new URL(item.url).hostname} ↗</a>`:''}
        </div>
      </div>`;
    });
    el.innerHTML=`
      <div class="cl-sec-head">
        <div class="cl-sec-title">${sec.section}</div>
        <span class="cl-badge ${bc}">${bl}</span>
      </div>
      <div class="cl-items">${items}</div>
      <div class="cl-prog-wrap">
        <div class="cl-prog-top">
          <span id="cl-cnt-${si}">${done}/${total} completed</span>
          <span id="cl-pct-${si}">${pct}%</span>
        </div>
        <div class="cl-prog-bar-wrap">
          <div class="cl-prog-bar" id="cl-bar-${si}" style="width:${pct}%"></div>
        </div>
      </div>`;
    c.appendChild(el);
  });
}

function buildMasterProgress(){
  const mp=document.getElementById('cl-master-progress');
  let totalAll=0, doneAll=0;
  TRIP_DATA.checklist.forEach((sec,si)=>{
    sec.items.forEach((_,ii)=>{ totalAll++; if(checkState[`${si}-${ii}`]) doneAll++; });
  });
  const pct=totalAll?Math.round((doneAll/totalAll)*100):0;
  const urgDone=countSectionDone(0), urgTotal=TRIP_DATA.checklist[0]?.items.length||0;
  mp.innerHTML=`<div class="cl-master-progress">
    <div class="cl-mp-top">
      <div class="cl-mp-title">Overall checklist progress</div>
      <div class="cl-mp-pct">${pct}%</div>
    </div>
    <div class="cl-mp-bar-wrap"><div class="cl-mp-bar" id="cl-master-bar" style="width:${pct}%"></div></div>
    <div class="cl-mp-sub">${doneAll} of ${totalAll} items complete · <strong style="color:${urgDone<urgTotal?'#f59e0b':'#22c55e'}">${urgDone}/${urgTotal} urgent bookings done</strong></div>
  </div>`;
}

function countSectionDone(si){
  return (TRIP_DATA.checklist[si]?.items||[]).filter((_,ii)=>checkState[`${si}-${ii}`]).length;
}

function toggleCheck(si,ii){
  const key=`${si}-${ii}`;
  checkState[key]=!checkState[key];
  try{ localStorage.setItem('iceland-checks',JSON.stringify(checkState)); }catch(e){}
  const el=document.getElementById(`ci-${si}-${ii}`);
  if(el) el.classList.toggle('done',checkState[key]);
  // Update section progress
  const sec=TRIP_DATA.checklist[si];
  const total=sec.items.length;
  const done=sec.items.filter((_,ii2)=>checkState[`${si}-${ii2}`]).length;
  const pct=Math.round((done/total)*100);
  const cnt=document.getElementById(`cl-cnt-${si}`);
  if(cnt) cnt.textContent=`${done}/${total} completed`;
  const pctEl=document.getElementById(`cl-pct-${si}`);
  if(pctEl) pctEl.textContent=`${pct}%`;
  const bar=document.getElementById(`cl-bar-${si}`);
  if(bar) bar.style.width=pct+'%';
  // Update master
  buildMasterProgress();
}

function loadCheckState(){
  try{ const s=localStorage.getItem('iceland-checks'); if(s) checkState=JSON.parse(s); }
  catch(e){ checkState={}; }
}

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET
// ─────────────────────────────────────────────────────────────────────────────
function buildBudget(){
  const c=document.getElementById('budget-content'), b=TRIP_DATA.budget;
  const fp=b.fixed.reduce((a,x)=>a+x.pp,0);
  const ap=b.accommodation.reduce((a,x)=>a+x.pp,0);
  const fp2=b.food.reduce((a,x)=>a+x.pp,0);
  const xp=b.activities.reduce((a,x)=>a+x.pp,0);
  const fu=b.fuel.reduce((a,x)=>a+x.cost,0);
  const pa=b.parking.reduce((a,x)=>a+x.cost,0);
  const gp=fp+ap+fp2+xp+fu+pa;
  let h=`<div class="budget-hero">
    <div class="budget-stat"><div class="bv">$${Math.round(gp).toLocaleString()}</div><div class="bl">Per person</div></div>
    <div class="budget-stat"><div class="bv">$${Math.round(gp*2).toLocaleString()}</div><div class="bl">Total for 2</div></div>
    <div class="budget-stat"><div class="bv">$${Math.round(gp/15)}</div><div class="bl">Avg / day pp</div></div>
  </div>`;
  h+=btable('Fixed Costs',b.fixed);
  h+=btable('Accommodation',b.accommodation);
  h+=btable('Food',b.food);
  h+=btable('Activities & Excursions',b.activities);
  // Fuel table
  h+=`<div class="btable"><div class="btable-head"><span>Fuel (per person — split between 2)</span><span class="bth-total">~$${Math.round(fu)} pp</span></div>`;
  b.fuel.forEach(f=>{ h+=`<div class="brow"><div class="br-lbl">${f.leg}<div class="br-lbl-sub">${f.km}km</div></div><div class="br-pp">$${f.cost}</div></div>`; });
  h+=`<div class="brow btotal"><div class="br-lbl">Fuel subtotal</div><div class="br-pp">$${Math.round(fu)}</div></div></div>`;
  // Parking table
  h+=`<div class="btable"><div class="btable-head"><span>Parking (per person — split between 2)</span><span class="bth-total">~$${Math.round(pa)} pp</span></div>`;
  b.parking.forEach(p=>{ h+=`<div class="brow"><div class="br-lbl">${p.site}</div><div class="br-pp">$${p.cost}</div></div>`; });
  h+=`<div class="brow btotal"><div class="br-lbl">Parking subtotal</div><div class="br-pp">$${Math.round(pa)}</div></div></div>`;
  // Grand total
  h+=`<div class="btable"><div class="btable-head">Grand Total Summary</div>
    <div class="brow"><div class="br-lbl">Fixed costs</div><div class="br-pp">$${fp}</div><div class="br-tot">$${fp*2} for 2</div></div>
    <div class="brow"><div class="br-lbl">Accommodation</div><div class="br-pp">$${ap}</div><div class="br-tot">$${ap*2} for 2</div></div>
    <div class="brow"><div class="br-lbl">Food</div><div class="br-pp">$${fp2}</div><div class="br-tot">$${fp2*2} for 2</div></div>
    <div class="brow"><div class="br-lbl">Activities</div><div class="br-pp">$${xp}</div><div class="br-tot">$${xp*2} for 2</div></div>
    <div class="brow"><div class="br-lbl">Fuel</div><div class="br-pp">$${Math.round(fu)}</div><div class="br-tot">$${Math.round(fu*2)} for 2</div></div>
    <div class="brow"><div class="br-lbl">Parking</div><div class="br-pp">$${Math.round(pa)}</div><div class="br-tot">$${Math.round(pa*2)} for 2</div></div>
    <div class="brow btotal"><div class="br-lbl">GRAND TOTAL</div><div class="br-pp">$${Math.round(gp).toLocaleString()}</div><div class="br-tot" style="color:var(--amber)">$${Math.round(gp*2).toLocaleString()} for 2</div></div>
  </div>`;
  c.innerHTML=h;
}

function btable(title,rows){
  const tot=rows.reduce((a,r)=>a+(r.pp||0),0);
  let h=`<div class="btable"><div class="btable-head"><span>${title}</span><span class="bth-total">$${tot} pp</span></div>`;
  rows.forEach(r=>{
    h+=`<div class="brow">
      <div class="br-lbl">${r.label}${r.sub?`<div class="br-lbl-sub">${r.sub}</div>`:''}
      </div><div class="br-pp">$${r.pp}</div><div class="br-tot">$${r.total} total</div>
    </div>`;
  });
  h+=`<div class="brow btotal"><div class="br-lbl">Subtotal</div><div class="br-pp">$${tot}</div></div></div>`;
  return h;
}

// ─────────────────────────────────────────────────────────────────────────────
// F-ROADS TAB
// ─────────────────────────────────────────────────────────────────────────────
function buildFRoads(){
  const c=document.getElementById('froad-content');
  let h=`<div class="froad-intro">
    <strong>How to read this:</strong> Each F-road on your trip is shown with its last 5 years of opening dates from the IRCA (Icelandic Road &amp; Coastal Administration).
    The "average" is the midpoint across all recorded years. Your trip dates are shown alongside.
    Always verify the live status the <strong>morning of your F-road day</strong> — a late season snow or flood can delay even reliably-early roads.
    Live conditions: <a href="https://umferdin.is/en" target="_blank">umferdin.is</a> · Emergency road info: <strong>1777</strong> (24hr)
  </div>`;
  Object.entries(FROAD_DATA).forEach(([id,rd])=>{
    const tripDay=TRIP_DATA.days.find(d=>d.froad?.id===id);
    const isLow=rd.risk==='low';
    h+=`<div class="froad-card">
      <div class="froad-card-head">
        <div style="flex:1">
          <div class="froad-name">${rd.name}</div>
          ${tripDay?`<div class="froad-trip">Trip day ${tripDay.num} (${tripDay.date}${tripDay.dow?' · '+tripDay.dow:''})</div>`:''}
        </div>
        <span class="froad-risk ${isLow?'fr-low':'fr-med'}">${isLow?'Low risk':'Medium risk'}</span>
      </div>
      <table class="froad-table">
        <thead><tr><th>Year</th><th>Date opened</th></tr></thead>
        <tbody>`;
    Object.entries(rd.historical).filter(([k])=>k!=='note').forEach(([yr,dt])=>{
      h+=`<tr><td>${yr}</td><td>${dt}</td></tr>`;
    });
    h+=`<tr class="froad-summary-row"><td>Earliest</td><td>${rd.earliest}</td></tr>
          <tr class="froad-summary-row"><td>Average</td><td>${rd.average}</td></tr>
          <tr class="froad-summary-row"><td>Latest</td><td>${rd.latest}</td></tr>
        </tbody>
      </table>
      <div class="froad-note"><strong>Assessment:</strong> ${rd.note}</div>
      <a href="${rd.liveUrl}" target="_blank" class="froad-live">Check live status on umferdin.is →</a>
    </div>`;
  });
  c.innerHTML=h;
}

// ─────────────────────────────────────────────────────────────────────────────
// EDIT TAB
// ─────────────────────────────────────────────────────────────────────────────
function buildEditTab(){
  const c=document.getElementById('edit-content'); c.innerHTML='';
  TRIP_DATA.days.forEach(day=>{
    const edit=editState[day.num]||{};
    const sc=day.sleep==='camp'?'#14532d':day.sleep==='hostel'?'#1e3a5f':'#2d1b69';
    const nc=day.sleep==='camp'?'#86efac':day.sleep==='hostel'?'#93c5fd':'#c4b5fd';
    const el=document.createElement('div');
    el.className='edit-card'; el.id=`ec-${day.num}`;
    const schedVal=(edit.schedule||day.schedule).map(s=>s.time+'|'+s.desc+(s.note?'|'+s.note:'')).join('\n');
    const warnsVal=(edit.warnings||day.warnings||[]).join('\n');
    el.innerHTML=`
      <div class="edit-card-head" onclick="toggleEdit(${day.num})">
        <div style="width:28px;height:28px;border-radius:50%;background:${sc};color:${nc};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${day.num}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:var(--text)">${day.title}</div>
          <div style="font-size:10px;color:var(--muted)">${day.date}${day.dow?' · '+day.dow:''}</div>
        </div>
        <div id="ec-chev-${day.num}" style="font-size:16px;color:var(--muted);transition:transform .2s;flex-shrink:0">›</div>
      </div>
      <div class="edit-body" id="eb-${day.num}">
        <div class="efl"><label>Day title</label><input id="e-title-${day.num}" value="${(edit.title||day.title).replace(/"/g,'&quot;')}"></div>
        <div class="efl"><label>Accommodation</label><input id="e-accom-${day.num}" value="${(edit.accommodation||day.accommodation).replace(/"/g,'&quot;')}"></div>
        <div class="efl"><label>Summary (shown in map popup)</label><textarea id="e-sum-${day.num}" rows="2">${edit.summary||day.summary}</textarea></div>
        <div class="efl"><label>Schedule — one per line: TIME | DESCRIPTION | optional note</label><textarea id="e-sched-${day.num}" rows="${Math.min(Math.max(day.schedule.length+1,5),18)}">${schedVal}</textarea></div>
        <div class="efl"><label>Personal notes (booking refs, packing reminders, anything)</label><textarea id="e-notes-${day.num}" rows="4" placeholder="e.g. Glacier Xtreme ref #GX2026-445. Pack extra snacks. Meet at wooden hut.">${edit.notes||''}</textarea></div>
        <div class="efl"><label>Warnings — one per line</label><textarea id="e-warns-${day.num}" rows="3">${warnsVal}</textarea></div>
        <div class="edit-btns">
          <button class="edit-save" onclick="saveDay(${day.num})">✓ Save changes</button>
          <button class="edit-reset" onclick="resetDay(${day.num})">↩ Reset to default</button>
        </div>
        <div class="edit-saved" id="es-${day.num}">Changes saved ✓</div>
      </div>`;
    c.appendChild(el);
  });
}

function toggleEdit(num){
  const b=document.getElementById(`eb-${num}`);
  const ch=document.getElementById(`ec-chev-${num}`);
  const open=b.style.display!=='block';
  b.style.display=open?'block':'none';
  ch.style.transform=open?'rotate(90deg)':'';
}

function parseSched(text){
  return text.split('\n').filter(l=>l.trim()).map(l=>{
    const p=l.split('|').map(s=>s.trim());
    return {time:p[0]||'',desc:p[1]||'',note:p[2]||''};
  });
}

function saveDay(num){
  const day=TRIP_DATA.days[num-1]; if(!day) return;
  const title=document.getElementById(`e-title-${num}`).value.trim();
  const accom=document.getElementById(`e-accom-${num}`).value.trim();
  const summary=document.getElementById(`e-sum-${num}`).value.trim();
  const sched=parseSched(document.getElementById(`e-sched-${num}`).value);
  const notes=document.getElementById(`e-notes-${num}`).value.trim();
  const warns=document.getElementById(`e-warns-${num}`).value.split('\n').filter(l=>l.trim());
  editState[num]={title,accommodation:accom,summary,schedule:sched,notes:notes||undefined,warnings:warns};
  try{ localStorage.setItem('iceland-edits',JSON.stringify(editState)); }catch(e){}
  // Apply to live data
  day.title=title; day.accommodation=accom; day.summary=summary;
  if(sched.length) day.schedule=sched;
  if(warns.length) day.warnings=warns;
  // Refresh other tabs
  buildItinerary();
  if(markers[num-1]) markers[num-1].setPopupContent(buildPopup(day));
  const msg=document.getElementById(`es-${num}`);
  if(msg){ msg.style.display='block'; setTimeout(()=>msg.style.display='none',2500); }
}

function resetDay(num){
  if(!confirm(`Reset Day ${num} to original data? This cannot be undone.`)) return;
  delete editState[num];
  try{ localStorage.setItem('iceland-edits',JSON.stringify(editState)); }catch(e){}
  location.reload();
}

function loadEditState(){
  try{
    const s=localStorage.getItem('iceland-edits');
    if(!s) return;
    const p=JSON.parse(s);
    Object.entries(p).forEach(([num,e])=>{
      const day=TRIP_DATA.days[parseInt(num)-1]; if(!day) return;
      editState[parseInt(num)]=e;
      if(e.title) day.title=e.title;
      if(e.accommodation) day.accommodation=e.accommodation;
      if(e.summary) day.summary=e.summary;
      if(e.schedule?.length) day.schedule=e.schedule;
      if(e.warnings?.length) day.warnings=e.warnings;
    });
  }catch(e){ editState={}; }
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  // Hide all tabs, show map
  document.querySelectorAll('.tab-pane').forEach(p=>{ p.style.display='none'; });
  const mapTab=document.getElementById('tab-map');
  if(mapTab) mapTab.style.display='flex';
  loadCheckState();
  loadEditState();
  initMap();
  buildItinerary();
  buildChecklist();
  buildBudget();
  buildEditTab();
  buildFRoads();
});
