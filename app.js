// Iceland Trip 2026 — App Logic

let map, markers=[], routeLines=[], currentDay=null;
let editState={}, checkState={};

// ── Tab Management ─────────────────────────────────────────────────────────────
function showTab(tab,btn){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  ['map-tab','itinerary-tab','checklist-tab','budget-tab','edit-tab','froad-tab'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display='none';
  });
  const t=document.getElementById(tab+'-tab');
  if(t) t.style.display=tab==='map'?'grid':'block';
  if(tab==='map') setTimeout(()=>map&&map.invalidateSize(),100);
}

// ── Map ────────────────────────────────────────────────────────────────────────
function markerColor(day){
  if(day.froad) return '#f59e0b';
  if(day.sleep==='camp') return '#22c55e';
  if(day.sleep==='hostel') return '#4a9eff';
  return '#a78bfa';
}

function markerIcon(day){
  const c=markerColor(day);
  return L.divIcon({
    html:`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="40" viewBox="0 0 34 40"><path d="M17 1C9.8 1 4 6.8 4 14c0 9.5 13 25 13 25S30 23.5 30 14C30 6.8 24.2 1 17 1z" fill="${c}" stroke="rgba(0,0,0,0.35)" stroke-width="1.5"/><circle cx="17" cy="14" r="7" fill="rgba(0,0,0,0.28)"/><text x="17" y="18.5" text-anchor="middle" fill="white" font-size="8.5" font-weight="700" font-family="system-ui">${day.num}</text></svg>`,
    className:'', iconSize:[34,40], iconAnchor:[17,40], popupAnchor:[0,-42]
  });
}

function initMap(){
  map=L.map('map',{center:[64.9,-18.5],zoom:6});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);
  renderDayList(); plotMarkers(); drawRoute('all');
}

function plotMarkers(){
  markers.forEach(m=>map.removeLayer(m)); markers=[];
  TRIP_DATA.days.forEach(day=>{
    const m=L.marker([day.lat,day.lng],{icon:markerIcon(day)}).addTo(map).bindPopup(popup(day),{maxWidth:260});
    m.on('click',()=>highlightDay(day.num));
    markers.push(m);
  });
}

function popup(day){
  const icon=day.sleep==='camp'?'⛺':day.sleep==='hostel'?'🏠':'✈️';
  const hasPuffins=day.tags.includes('hike')&&(day.num===4||day.num===8||day.num===9);
  const puffinBadge=hasPuffins?`<span style="background:#EAF3DE;color:#27500A;font-size:10px;padding:1px 6px;border-radius:4px;margin-left:4px">🐦 Puffins</span>`:'';
  const fBadge=day.froad?`<span style="background:#FAEEDA;color:#633806;font-size:10px;padding:1px 6px;border-radius:4px;margin-left:4px">⚠ F-Road</span>`:'';
  return `<div class="popup-inner">
    <div class="popup-day">Day ${day.num} · ${day.date}</div>
    <div class="popup-title">${day.title}${puffinBadge}${fBadge}</div>
    <div class="popup-desc">${day.summary}</div>
    <div style="font-size:11px;color:var(--muted);margin:4px 0">${icon} ${day.accommodation}</div>
    <button class="popup-btn" onclick="openDetail(${day.num})">Full details →</button>
  </div>`;
}

function showRoute(region,btn){
  document.querySelectorAll('.ctrl-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  routeLines.forEach(l=>map.removeLayer(l)); routeLines=[];
  let days=TRIP_DATA.days;
  if(region!=='all'){const idx=TRIP_DATA.regions[region]||[];days=days.filter(d=>idx.includes(d.num));}
  if(days.length>1){
    const line=L.polyline(days.map(d=>[d.lat,d.lng]),{color:'#4a9eff',weight:2.5,opacity:.7,dashArray:'8 5'}).addTo(map);
    routeLines.push(line);
    if(region!=='all') map.fitBounds(line.getBounds(),{padding:[40,40]});
  }
  if(region==='all') map.setView([64.9,-18.5],6);
}

function renderDayList(){
  const list=document.getElementById('day-list'); list.innerHTML='';
  TRIP_DATA.days.forEach(day=>{
    const el=document.createElement('div');
    el.className=`day-item sleep-${day.sleep==='hostel'?'hostel':'camp'}`;
    el.id=`day-list-${day.num}`;
    const puffinTag=(day.num===4||day.num===8||day.num===9)?`<span class="tag tag-puffin">Puffins</span>`:'';
    const froadTag=day.froad?`<span class="tag tag-froad">F-Road</span>`:'';
    const tags=day.tags.map(t=>{const m={camp:['tag-camp','Camp'],hostel:['tag-hostel','Hostel'],hike:['tag-hike','Hike'],excursion:['tag-excursion','Activity'],froad:['tag-froad','F-Road']};const[cls,lbl]=m[t]||['',''];return lbl&&t!=='froad'?`<span class="tag ${cls}">${lbl}</span>`:''}).join('')+froadTag+puffinTag;
    el.innerHTML=`<div class="day-num">${day.num}</div><div class="day-info"><div class="day-date">${day.date}</div><div class="day-title">${day.title}</div><div class="day-tags">${tags}</div></div>`;
    el.onclick=()=>{highlightDay(day.num);openDetail(day.num);map.setView([day.lat,day.lng],9,{animate:true});markers[day.num-1].openPopup();};
    list.appendChild(el);
  });
}

function highlightDay(num){
  document.querySelectorAll('.day-item').forEach(e=>e.classList.remove('active'));
  const el=document.getElementById(`day-list-${num}`);
  if(el){el.classList.add('active');el.scrollIntoView({block:'nearest',behavior:'smooth'});}
  currentDay=num;
}

// ── Detail Panel ───────────────────────────────────────────────────────────────
function openDetail(num){
  const day=TRIP_DATA.days[num-1]; if(!day) return;
  highlightDay(num);
  const panel=document.getElementById('detail-panel');
  document.getElementById('detail-day-label').textContent=`Day ${day.num} · ${day.date}`;
  const badge=day.sleep==='camp'?`<span class="detail-badge" style="background:#14532d;color:#86efac">⛺ Camp</span>`:day.sleep==='hostel'?`<span class="detail-badge" style="background:#1e3a5f;color:#93c5fd">🏠 Hostel</span>`:`<span class="detail-badge" style="background:#3b1f6b;color:#c4b5fd">✈️ Fly Home</span>`;
  let h=`${badge}<div class="detail-title">${day.title}</div><div class="detail-meta">${day.date} · ${day.accommodation}</div>`;
  if(day.froad){
    const fd=FROAD_DATA[day.froad.id];
    const riskColor=day.froad.risk==='medium'?'#854F0B':'#0F6E56';
    const riskBg=day.froad.risk==='medium'?'#FAEEDA':'#E1F5EE';
    h+=`<div style="background:${riskBg};border:0.5px solid ${riskColor};border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:${riskColor};line-height:1.5"><strong>F-Road: ${fd.name}</strong><br>Average opening: ${fd.average} · Your trip: ${day.froad.tripDate}<br>${day.froad.note}<br><a href="${fd.liveUrl}" target="_blank" style="color:${riskColor};font-weight:500">Check live status →</a></div>`;
  }
  if(day.schedule?.length){
    h+=`<div class="dsec"><div class="dsec-title">Schedule</div>`;
    day.schedule.forEach(s=>{h+=`<div class="sched-row"><div class="sched-time">${s.time}</div><div class="sched-desc">${s.desc}${s.note?`<div class="sched-note">${s.note}</div>`:''}</div></div>`;});
    h+=`</div>`;
  }
  if(day.hikes?.length){
    h+=`<div class="dsec"><div class="dsec-title">Hikes & Trails</div>`;
    day.hikes.forEach(hk=>{h+=`<div class="hike-card"><div class="hike-name">${hk.name}</div><div class="hike-stats"><span>${hk.distance}</span><span>${hk.time}</span><span>${hk.gain}</span><span>${hk.difficulty}</span></div><div class="hike-desc">${hk.desc}</div></div>`;});
    h+=`</div>`;
  }
  if(day.excursions?.length){
    h+=`<div class="dsec"><div class="dsec-title">Booked Activities</div>`;
    day.excursions.forEach(e=>{h+=`<div class="exc-block"><div class="exc-name">${e.name}</div><div class="exc-meta">${e.operator} · ${e.duration}</div><div class="exc-price">${e.price}</div><div class="exc-desc">${e.desc}</div>${e.url?`<a href="${e.url}" target="_blank" class="exc-link">Book here →</a>`:''}</div>`;});
    h+=`</div>`;
  }
  if(day.warnings?.length){h+=`<div class="dsec"><div class="dsec-title">⚠ Warnings</div>`;day.warnings.forEach(w=>{h+=`<div class="warn-box">${w}</div>`;});h+=`</div>`;}
  if(day.tips?.length){h+=`<div class="dsec"><div class="dsec-title">Tips</div>`;day.tips.forEach(t=>{h+=`<div class="tip-box">${t}</div>`;});h+=`</div>`;}
  if(editState[num]?.notes){h+=`<div class="dsec"><div class="dsec-title">Your Notes</div><div class="tip-box" style="white-space:pre-wrap">${editState[num].notes}</div></div>`;}
  document.getElementById('detail-body').innerHTML=h;
  panel.classList.add('open');
}
function closeDetail(){document.getElementById('detail-panel').classList.remove('open');}

// ── Itinerary (no costs) ───────────────────────────────────────────────────────
function buildItinerary(){
  const c=document.getElementById('itin-days'); c.innerHTML='';
  TRIP_DATA.days.forEach(day=>{
    const sc=day.sleep==='camp'?'#14532d':day.sleep==='hostel'?'#1e3a5f':'#2d1b69';
    const nc=day.sleep==='camp'?'#86efac':day.sleep==='hostel'?'#93c5fd':'#c4b5fd';
    const puffinBadge=(day.num===4||day.num===8||day.num===9)?`<span class="tag tag-puffin">Puffins</span>`:'';
    const tags=day.tags.filter(t=>t!=='froad').map(t=>{const m={camp:['tag-camp','Camp'],hostel:['tag-hostel','Hostel'],hike:['tag-hike','Hike'],excursion:['tag-excursion','Activity']};const[cls,lbl]=m[t]||['',''];return lbl?`<span class="tag ${cls}">${lbl}</span>`:''}).join('')+(day.froad?`<span class="tag tag-froad">F-Road</span>`:'')+puffinBadge;
    let body='';
    if(day.froad){
      const fd=FROAD_DATA[day.froad.id];
      body+=`<div class="itin-tip" style="border-color:#BA7517"><strong>F-Road:</strong> ${fd.name} — avg opens ${fd.average}. Your date: ${day.froad.tripDate}. ${day.froad.note} <a href="${fd.liveUrl}" target="_blank" style="color:#60a5fa">Live status →</a></div>`;
    }
    if(day.schedule?.length){
      body+=`<div class="itin-section-label">Schedule</div>`;
      day.schedule.forEach(s=>{body+=`<div class="itin-schedule-row"><div class="itin-time">${s.time}</div><div class="itin-desc">${s.desc}${s.note?`<div class="itin-sub-note">${s.note}</div>`:''}</div></div>`;});
    }
    if(day.hikes?.length){
      body+=`<div class="itin-section-label">Hikes & Trails</div>`;
      day.hikes.forEach(h=>{body+=`<div class="itin-hike"><div class="itin-hike-name">${h.name}</div><div class="itin-hike-stats"><span>${h.distance}</span><span>${h.time}</span><span>${h.gain}</span><span>${h.difficulty}</span></div><div class="itin-hike-desc">${h.desc}</div></div>`;});
    }
    if(day.excursions?.length){
      body+=`<div class="itin-section-label">Booked Activities</div>`;
      day.excursions.forEach(e=>{body+=`<div class="itin-exc"><div class="itin-exc-name">${e.name}</div><div class="itin-exc-meta">${e.operator} · ${e.duration}</div><div class="itin-exc-price">${e.price}</div><div class="itin-exc-desc">${e.desc}</div>${e.url?`<a href="${e.url}" target="_blank" style="font-size:11px;color:#60a5fa;display:block;margin-top:4px">Book here →</a>`:''}</div>`;});
    }
    if(day.warnings?.length){body+=`<div class="itin-section-label">⚠ Warnings</div>`;day.warnings.forEach(w=>{body+=`<div class="itin-warn">${w}</div>`;});}
    if(day.tips?.length){body+=`<div class="itin-section-label">Tips</div>`;day.tips.forEach(t=>{body+=`<div class="itin-tip">${t}</div>`;});}
    if(editState[day.num]?.notes){body+=`<div class="itin-section-label">Your Notes</div><div class="itin-tip" style="white-space:pre-wrap">${editState[day.num].notes}</div>`;}
    const el=document.createElement('div');
    el.className='itin-day'; el.id=`itin-day-${day.num}`;
    el.innerHTML=`<div class="itin-day-head" onclick="toggleItinDay(${day.num})"><div class="itin-day-num" style="background:${sc};color:${nc}">${day.num}</div><div class="itin-day-info"><div class="itin-day-title">${day.title}</div><div class="itin-day-sub">${day.date} · ${day.accommodation} <span style="margin-left:4px">${tags}</span></div></div><div class="itin-chevron">›</div></div><div class="itin-day-body">${body}</div>`;
    c.appendChild(el);
  });
}
function toggleItinDay(num){document.getElementById(`itin-day-${num}`)?.classList.toggle('open');}

// ── F-Road Tab ─────────────────────────────────────────────────────────────────
function buildFRoads(){
  const c=document.getElementById('froad-content');
  const roads=Object.entries(FROAD_DATA);
  let h=`<div class="froad-info-box">Opening dates from the Icelandic Road and Coastal Administration (IRCA) — vegagerdin.is. Historical data 2021–2025. Always verify live status at <a href="https://umferdin.is/en" target="_blank" style="color:#60a5fa">umferdin.is</a> or call 1777 the morning of your F-road day.</div>`;
  roads.forEach(([id,rd])=>{
    const tripDay=TRIP_DATA.days.find(d=>d.froad?.id===id);
    const risk=rd.risk;
    const riskColor=risk==='medium'?'#BA7517':'#1D9E75';
    const riskBg=risk==='medium'?'#FAEEDA':'#E1F5EE';
    const riskLabel=risk==='medium'?'Medium risk':'Low risk';
    h+=`<div class="froad-card">
      <div class="froad-card-head">
        <div style="flex:1"><div class="froad-name">${rd.name}</div>${tripDay?`<div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">Trip day ${tripDay.num} (${tripDay.date})</div>`:''}</div>
        <span style="background:${riskBg};color:${riskColor};font-size:11px;padding:3px 10px;border-radius:20px;font-weight:500;white-space:nowrap">${riskLabel}</span>
      </div>
      <div class="froad-table">
        <div class="froad-row froad-header"><span>Year</span><span>Opened</span></div>`;
    Object.entries(rd.historical).filter(([k])=>k!=='note').forEach(([yr,dt])=>{
      h+=`<div class="froad-row"><span>${yr}</span><span>${dt}</span></div>`;
    });
    h+=`<div class="froad-row froad-summary"><span>Earliest</span><span>${rd.earliest}</span></div>
        <div class="froad-row froad-summary"><span>Average</span><span>${rd.average}</span></div>
        <div class="froad-row froad-summary"><span>Latest</span><span>${rd.latest}</span></div>
      </div>
      <div class="froad-note">${rd.note}</div>
      <a href="${rd.liveUrl}" target="_blank" class="froad-link">Check live status →</a>
    </div>`;
  });
  c.innerHTML=h;
}

// ── Edit Tab ───────────────────────────────────────────────────────────────────
function buildEditTab(){
  const c=document.getElementById('edit-content'); c.innerHTML='';
  TRIP_DATA.days.forEach(day=>{
    const edit=editState[day.num]||{};
    const sc=day.sleep==='camp'?'#14532d':'#1e3a5f';
    const nc=day.sleep==='camp'?'#86efac':'#93c5fd';
    const el=document.createElement('div');
    el.className='edit-day-card'; el.id=`edit-card-${day.num}`;
    el.innerHTML=`
      <div class="edit-card-head" onclick="toggleEditCard(${day.num})">
        <div style="width:30px;height:30px;border-radius:50%;background:${sc};color:${nc};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${day.num}</div>
        <div style="flex:1"><div style="font-size:13px;font-weight:500;color:var(--color-text-primary)">${day.title}</div><div style="font-size:11px;color:var(--color-text-secondary)">${day.date}</div></div>
        <div style="font-size:16px;color:var(--color-text-secondary);transition:transform .2s" id="edit-chev-${day.num}">›</div>
      </div>
      <div class="edit-card-body" id="edit-body-${day.num}" style="display:none">
        <div class="edit-field-group"><label class="edit-label">Day title</label><input class="edit-input" id="e-title-${day.num}" value="${edit.title||day.title}"></div>
        <div class="edit-field-group"><label class="edit-label">Accommodation</label><input class="edit-input" id="e-accom-${day.num}" value="${edit.accommodation||day.accommodation}"></div>
        <div class="edit-field-group"><label class="edit-label">Summary (map popup)</label><textarea class="edit-textarea" id="e-summary-${day.num}" rows="2">${edit.summary||day.summary}</textarea></div>
        <div class="edit-field-group"><label class="edit-label">Schedule — one per line: TIME | DESCRIPTION | optional note</label><textarea class="edit-textarea" id="e-sched-${day.num}" rows="${Math.max(day.schedule.length+1,4)}">${(edit.schedule||day.schedule).map(s=>s.time+'|'+s.desc+(s.note?'|'+s.note:'')).join('\n')}</textarea></div>
        <div class="edit-field-group"><label class="edit-label">Personal notes (booking refs, reminders, etc.)</label><textarea class="edit-textarea" id="e-notes-${day.num}" rows="3" placeholder="e.g. Confirmed tour ref #12345, remember to pack snacks...">${edit.notes||''}</textarea></div>
        <div class="edit-field-group"><label class="edit-label">Warnings (one per line)</label><textarea class="edit-textarea" id="e-warns-${day.num}" rows="2">${(edit.warnings||day.warnings||[]).join('\n')}</textarea></div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="edit-save-btn" onclick="saveDay(${day.num})">✓ Save</button>
          <button class="edit-reset-btn" onclick="resetDay(${day.num})">↩ Reset</button>
        </div>
        <div id="edit-saved-${day.num}" style="display:none;font-size:12px;color:#22c55e;margin-top:6px">Saved ✓</div>
      </div>`;
    c.appendChild(el);
  });
}

function toggleEditCard(num){
  const b=document.getElementById(`edit-body-${num}`);
  const c=document.getElementById(`edit-chev-${num}`);
  const open=b.style.display==='none';
  b.style.display=open?'block':'none';
  c.style.transform=open?'rotate(90deg)':'';
}

function parseSchedule(text){
  return text.split('\n').filter(l=>l.trim()).map(l=>{
    const p=l.split('|').map(s=>s.trim());
    return {time:p[0]||'',desc:p[1]||'',note:p[2]||''};
  });
}

function saveDay(num){
  const day=TRIP_DATA.days[num-1]; if(!day) return;
  const title=document.getElementById(`e-title-${num}`).value.trim();
  const accom=document.getElementById(`e-accom-${num}`).value.trim();
  const summary=document.getElementById(`e-summary-${num}`).value.trim();
  const sched=parseSchedule(document.getElementById(`e-sched-${num}`).value);
  const notes=document.getElementById(`e-notes-${num}`).value.trim();
  const warns=document.getElementById(`e-warns-${num}`).value.split('\n').filter(l=>l.trim());
  editState[num]={title,accommodation:accom,summary,schedule:sched,notes:notes||undefined,warnings:warns};
  try{localStorage.setItem('iceland-edits',JSON.stringify(editState));}catch(e){}
  day.title=title; day.accommodation=accom; day.summary=summary;
  if(sched.length) day.schedule=sched;
  if(warns.length) day.warnings=warns;
  buildItinerary();
  if(markers[num-1]) markers[num-1].setPopupContent(popup(day));
  const msg=document.getElementById(`edit-saved-${num}`);
  if(msg){msg.style.display='block';setTimeout(()=>msg.style.display='none',2000);}
}

function resetDay(num){
  if(!confirm(`Reset Day ${num} to original?`)) return;
  delete editState[num];
  try{localStorage.setItem('iceland-edits',JSON.stringify(editState));}catch(e){}
  location.reload();
}

function loadEditState(){
  try{
    const s=localStorage.getItem('iceland-edits');
    if(s){
      const parsed=JSON.parse(s);
      Object.entries(parsed).forEach(([num,e])=>{
        const day=TRIP_DATA.days[parseInt(num)-1]; if(!day) return;
        editState[parseInt(num)]=e;
        if(e.title) day.title=e.title;
        if(e.accommodation) day.accommodation=e.accommodation;
        if(e.summary) day.summary=e.summary;
        if(e.schedule?.length) day.schedule=e.schedule;
        if(e.warnings?.length) day.warnings=e.warnings;
      });
    }
  }catch(e){editState={};}
}

// ── Checklist ──────────────────────────────────────────────────────────────────
function buildChecklist(){
  const c=document.getElementById('checklist-content'); c.innerHTML='';
  const bm={urgent:['badge-urgent','🔴 Do today'],soon:['badge-soon','🟡 1–2 weeks'],before:['badge-before','🔵 Before departure'],gear:['badge-gear','🟣 Gear']};
  TRIP_DATA.checklist.forEach((sec,si)=>{
    const[bc,bl]=bm[sec.badge]||['',''];
    const total=sec.items.length;
    const done=sec.items.filter((_,ii)=>checkState[`${si}-${ii}`]).length;
    const pct=Math.round((done/total)*100);
    const el=document.createElement('div');
    el.className='checklist-section';
    let items='';
    sec.items.forEach((item,ii)=>{
      const isDone=checkState[`${si}-${ii}`]||false;
      items+=`<div class="check-item${isDone?' done':''}" id="check-${si}-${ii}" onclick="toggleCheck(${si},${ii})"><div class="check-box"></div><div class="check-info"><div class="check-text">${item.text}</div>${item.sub?`<div class="check-sub">${item.sub}</div>`:''} ${item.url?`<a class="check-link" href="${item.url}" target="_blank" onclick="event.stopPropagation()">${item.url.replace('https://','').split('/')[0]} ↗</a>`:''}</div></div>`;
    });
    el.innerHTML=`<div class="checklist-section-head"><h3>${sec.section}</h3><span class="checklist-badge ${bc}">${bl}</span></div><div class="checklist-items">${items}</div><div class="checklist-progress"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span id="cl-count-${si}">${done}/${total}</span><span id="cl-pct-${si}">${pct}%</span></div><div class="progress-bar-wrap"><div class="progress-bar" id="cl-bar-${si}" style="width:${pct}%"></div></div></div>`;
    c.appendChild(el);
  });
}

function toggleCheck(si,ii){
  const key=`${si}-${ii}`;
  checkState[key]=!checkState[key];
  try{localStorage.setItem('iceland-checks',JSON.stringify(checkState));}catch(e){}
  document.getElementById(`check-${si}-${ii}`)?.classList.toggle('done',checkState[key]);
  const sec=TRIP_DATA.checklist[si];
  const total=sec.items.length;
  const done=sec.items.filter((_,ii2)=>checkState[`${si}-${ii2}`]).length;
  const pct=Math.round((done/total)*100);
  document.getElementById(`cl-count-${si}`).textContent=`${done}/${total}`;
  document.getElementById(`cl-pct-${si}`).textContent=`${pct}%`;
  const bar=document.getElementById(`cl-bar-${si}`);
  if(bar) bar.style.width=pct+'%';
}

function loadCheckState(){
  try{const s=localStorage.getItem('iceland-checks');if(s) checkState=JSON.parse(s);}catch(e){checkState={};}
}

// ── Budget ─────────────────────────────────────────────────────────────────────
function buildBudget(){
  const c=document.getElementById('budget-content');
  const b=TRIP_DATA.budget;
  const fixedPP=b.fixed.reduce((a,x)=>a+x.pp,0);
  const accomPP=b.accommodation.reduce((a,x)=>a+x.pp,0);
  const foodPP=b.food.reduce((a,x)=>a+x.pp,0);
  const actPP=b.activities.reduce((a,x)=>a+x.pp,0);
  const fuelPP=b.fuel.reduce((a,x)=>a+x.cost,0);
  const parkPP=b.parking.reduce((a,x)=>a+x.cost,0);
  const grandPP=fixedPP+accomPP+foodPP+actPP+fuelPP+parkPP;
  let h=`<div class="budget-summary">
    <div class="budget-stat"><div class="val">$${Math.round(grandPP).toLocaleString()}</div><div class="lbl">Per person</div></div>
    <div class="budget-stat"><div class="val">$${Math.round(grandPP*2).toLocaleString()}</div><div class="lbl">Total for 2</div></div>
    <div class="budget-stat"><div class="val">$${Math.round(grandPP/15)}</div><div class="lbl">Avg per day/pp</div></div>
  </div>`;
  h+=bTable('Fixed Costs',b.fixed);
  h+=bTable('Accommodation',b.accommodation);
  h+=bTable('Food',b.food);
  h+=bTable('Activities & Excursions',b.activities);
  h+=`<div class="budget-table"><div class="budget-table-head"><span>Fuel (per person)</span><span style="color:#f59e0b">~$${Math.round(fuelPP)} pp</span></div>`;
  b.fuel.forEach(f=>{h+=`<div class="budget-row"><div class="br-label">${f.leg}<div class="br-sub">${f.km}km</div></div><div class="br-pp">$${f.cost}</div></div>`;});
  h+=`<div class="budget-row total"><div class="br-label">Fuel total</div><div class="br-pp">$${Math.round(fuelPP)}</div></div></div>`;
  h+=`<div class="budget-table"><div class="budget-table-head"><span>Parking (per person)</span><span style="color:#f59e0b">~$${Math.round(parkPP)} pp</span></div>`;
  b.parking.forEach(p=>{h+=`<div class="budget-row"><div class="br-label">${p.site}</div><div class="br-pp">$${p.cost}</div></div>`;});
  h+=`<div class="budget-row total"><div class="br-label">Parking total</div><div class="br-pp">$${Math.round(parkPP)}</div></div></div>`;
  h+=`<div class="budget-table"><div class="budget-table-head">Grand Total</div>
    <div class="budget-row"><div class="br-label">Fixed</div><div class="br-pp">$${fixedPP}</div><div class="br-total">$${fixedPP*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Accommodation</div><div class="br-pp">$${accomPP}</div><div class="br-total">$${accomPP*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Food</div><div class="br-pp">$${foodPP}</div><div class="br-total">$${foodPP*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Activities</div><div class="br-pp">$${actPP}</div><div class="br-total">$${actPP*2} for 2</div></div>
    <div class="budget-row"><div class="br-label">Fuel</div><div class="br-pp">$${Math.round(fuelPP)}</div><div class="br-total">$${Math.round(fuelPP*2)} for 2</div></div>
    <div class="budget-row"><div class="br-label">Parking</div><div class="br-pp">$${Math.round(parkPP)}</div><div class="br-total">$${Math.round(parkPP*2)} for 2</div></div>
    <div class="budget-row total"><div class="br-label">GRAND TOTAL</div><div class="br-pp">$${Math.round(grandPP).toLocaleString()}</div><div class="br-total" style="color:#f59e0b">$${Math.round(grandPP*2).toLocaleString()} for 2</div></div>
  </div>`;
  c.innerHTML=h;
}

function bTable(title,rows){
  const total=rows.reduce((a,r)=>a+(r.pp||0),0);
  let h=`<div class="budget-table"><div class="budget-table-head"><span>${title}</span><span style="color:#f59e0b">$${total} pp</span></div>`;
  rows.forEach(r=>{h+=`<div class="budget-row"><div class="br-label">${r.label}${r.sub?`<div class="br-sub">${r.sub}</div>`:''}</div><div class="br-pp">$${r.pp}</div><div class="br-total">$${r.total} total</div></div>`;});
  h+=`<div class="budget-row total"><div class="br-label">Subtotal</div><div class="br-pp">$${total}</div></div></div>`;
  return h;
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  loadCheckState(); loadEditState();
  initMap(); buildItinerary(); buildChecklist(); buildBudget(); buildEditTab(); buildFRoads();
});
