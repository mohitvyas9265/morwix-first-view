/* ============================================================
   Morwix — Notification Module (R1) prototype interactions
   ============================================================ */
const TODAY = '2026-08-09'; // demo "today" (matches project date)

/* ---- Class roster (demo data) ---- */
const CLASSES = [
  { id:'Grade 6',  sections:{A:30,B:30,C:30,D:30} },
  { id:'Grade 7',  sections:{A:31,B:31,C:31,D:27} },
  { id:'Grade 8',  sections:{A:30,B:30,C:29,D:29} },
  { id:'Grade 9',  sections:{A:29,B:29,C:29,D:29} },
  { id:'Grade 10', sections:{A:30,B:29,C:29,D:30} },
];
const sizeOf = (c) => Object.values(c.sections).reduce((a,b)=>a+b,0);

/* ---- Editable state (defaults mirror the Notice Details demo) ----
   No separate "All classes" mode: checking every class IS "all classes".
   The "Select all" action is just a shortcut over the same checklist. ---- */
const state = {
  classes:{
    'Grade 6':  { on:true,  mode:'all',      secs:[] },
    'Grade 7':  { on:true,  mode:'specific', secs:['A','C'] },
    'Grade 8':  { on:true,  mode:'all',      secs:[] },
    'Grade 9':  { on:true,  mode:'all',      secs:[] },
    'Grade 10': { on:true,  mode:'specific', secs:['B'] },
  }
};

/* ==================== ROUTING ==================== */
const CRUMBS = {
  hub:'<span class="current">Overview</span>',
  view:'<span class="current">Notices</span>',
  create:'<span>Notices</span><span class="sep">/</span><span class="current">Create notice</span>',
  detail:'<span>Notices</span><span class="sep">/</span><span class="current">Annual Sports Day — Parent Consent</span>',
};
const NAV_FOR = { hub:'hub', view:'view', create:'view', detail:'view' };

function navTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  document.querySelectorAll('.nav-item[data-nav]').forEach(n=>n.classList.toggle('active', n.dataset.nav===NAV_FOR[id]));
  document.getElementById('crumbs').innerHTML = CRUMBS[id] || '';
  document.querySelector('.content').scrollTop = 0;
  if(id==='create') goStep(1);
}

/* Global click delegation for anything with data-nav */
document.addEventListener('click', (e)=>{
  const t = e.target.closest('[data-nav]');
  if(t){ e.preventDefault(); navTo(t.dataset.nav); }
});

/* ==================== WIZARD ==================== */
let maxStep = 1;
function goStep(n){
  maxStep = Math.max(maxStep, n);
  document.querySelectorAll('.wizard-step').forEach(s=>s.classList.toggle('active', +s.dataset.wstep===n));
  document.querySelectorAll('#stepper .step').forEach(s=>{
    const k = +s.dataset.step;
    s.classList.toggle('current', k===n);
    s.classList.toggle('done', k<n);
    const num = s.querySelector('.num');
    num.innerHTML = k<n ? '<svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>' : k;
  });
  document.querySelectorAll('#stepper .step-line').forEach(l=> l.classList.toggle('done', +l.dataset.line < n));
  if(n===3) renderReview();
  document.querySelector('.content').scrollTop = 0;
}
/* Clickable stepper */
document.querySelectorAll('#stepper .step').forEach(s=>{
  s.style.cursor='pointer';
  s.addEventListener('click', ()=>{ const k=+s.dataset.step; if(k<=maxStep) goStep(k); });
});

/* ==================== STEP 1: response toggle ==================== */
const resp = document.getElementById('f-response');
resp.addEventListener('click', ()=>{
  resp.classList.toggle('on');
  const on = resp.classList.contains('on');
  const lab = document.getElementById('f-response-lab');
  lab.textContent = on ? 'Yes' : 'No';
  lab.style.color = on ? 'var(--brand-600)' : 'var(--text-tertiary)';
});

/* ==================== STEP 2: recipient builder ====================
   Single unified checklist — no "All classes / Selected classes" mode
   switch. Checking every class IS "all classes"; "Select all" is a
   one-tap shortcut over the same list, not a different screen. ==== */
const classList = document.getElementById('class-list');

function renderClassList(){
  const btn = document.getElementById('toggle-all-classes');
  const allOn = CLASSES.every(c=>state.classes[c.id].on);
  btn.textContent = allOn ? 'Clear all' : 'Select all';
  classList.innerHTML = CLASSES.map(c=>{
    const st = state.classes[c.id];
    const secKeys = Object.keys(c.sections);
    const chips = secKeys.map(s=>`<span class="sec-chip ${st.secs.includes(s)?'on':''}" data-sec="${s}">${s}</span>`).join('');
    return `<div class="class-row ${st.on?'on':'off'}" data-c="${c.id}">
      <span class="check ${st.on?'on':''}"><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg></span>
      <div><div class="cname">${c.id}</div><div class="cmeta">${secKeys.length} sections · ${secKeys[0]}–${secKeys[secKeys.length-1]}</div></div>
      <div class="rt">
        <div class="segmented">
          <button class="${st.mode==='all'?'on':''}" data-seg="all">All sections</button>
          <button class="${st.mode==='specific'?'on':''}" data-seg="specific">Specific</button>
        </div>
        <div class="sections ${st.mode==='specific'?'show':''}">${chips}</div>
      </div>
    </div>`;
  }).join('');
  updateCount();
}

/* Delegated interactions inside class list */
classList.addEventListener('click', (e)=>{
  const row = e.target.closest('.class-row'); if(!row) return;
  const st = state.classes[row.dataset.c];
  if(e.target.closest('.check')){ st.on = !st.on; renderClassList(); return; }
  const seg = e.target.closest('[data-seg]');
  if(seg){ st.mode = seg.dataset.seg; if(st.mode==='specific' && st.secs.length===0) st.secs=['A']; renderClassList(); return; }
  const chip = e.target.closest('[data-sec]');
  if(chip){ const s=chip.dataset.sec; const i=st.secs.indexOf(s); if(i>-1) st.secs.splice(i,1); else st.secs.push(s); renderClassList(); return; }
});

document.getElementById('toggle-all-classes').addEventListener('click', ()=>{
  const anyOff = CLASSES.some(c=>!state.classes[c.id].on);
  CLASSES.forEach(c=> state.classes[c.id].on = anyOff);
  renderClassList();
});

/* ---- recipient math ---- */
function activeClasses(){ return CLASSES.filter(c=>state.classes[c.id].on); }
function classCount(c){
  const st = state.classes[c.id];
  if(st.mode==='all') return sizeOf(c);
  return st.secs.reduce((a,s)=>a+(c.sections[s]||0),0);
}
function totalRecipients(){ return activeClasses().reduce((a,c)=>a+classCount(c),0); }

function updateCount(){
  const n = activeClasses().length, total = totalRecipients();
  const el = document.getElementById('recipient-count-text');
  el.innerHTML = n===0
    ? 'No classes selected yet — pick at least one class to continue.'
    : `<strong>≈ ${total.toLocaleString()} recipients</strong> across <strong>${n}</strong> ${n===1?'class':'classes'} will receive this notice.`;
}

/* ==================== STEP 3: Review & Publish (merged Summary + Review) ==================== */
function recipientRowsHTML(){
  return activeClasses().map(c=>{
    const st = state.classes[c.id];
    const secs = st.mode==='all' ? '<span class="tag tag--all">All sections</span>' : st.secs.map(s=>`<span class="tag">${s}</span>`).join('') || '<span class="tag">—</span>';
    return `<div class="summary-row"><div class="ico">${c.id.replace('Grade ','')}</div><div class="grow"><div style="font-weight:600">${c.id}</div><div class="secs">${secs}</div></div><span class="muted body-sm">≈ ${classCount(c)}</span></div>`;
  }).join('');
}

/* confirm checkbox gates "Publish notice" */
const confirmBox = document.getElementById('confirm-recipients');
const publishBtn = document.getElementById('publish-btn');
publishBtn.disabled = true;
confirmBox.addEventListener('click', ()=>{
  const chk = confirmBox.querySelector('.check');
  chk.classList.toggle('on');
  publishBtn.disabled = !chk.classList.contains('on');
});

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmt(d){ if(!d) return 'Not set'; const [y,m,day]=d.split('-').map(Number); return `${day} ${MONTHS[m-1]} ${y}`; }
function statusFor(s,e){ if(!s||!e) return 'draft'; if(s>TODAY) return 'scheduled'; if(e<TODAY) return 'expired'; return 'active'; }

function renderReview(){
  document.getElementById('summary-list').innerHTML = recipientRowsHTML();
  document.getElementById('sum-total').textContent = totalRecipients().toLocaleString();
  document.getElementById('sum-classes').textContent = activeClasses().length;

  const title = document.getElementById('f-title').value || 'Untitled notice';
  const desc  = document.getElementById('f-desc').value || '—';
  const start = document.getElementById('f-start').value, end = document.getElementById('f-end').value;
  const respOn = document.getElementById('f-response').classList.contains('on');
  document.getElementById('rv-title').textContent = title;
  document.getElementById('rv-desc').textContent = desc;
  document.getElementById('rv-dates').innerHTML = `${fmt(start)} &nbsp;–&nbsp; ${fmt(end)}`;
  document.getElementById('rv-response').innerHTML = respOn ? '<span class="pill pill--req">Required</span>' : '<span class="pill pill--no">Not required</span>';

  const st = statusFor(start,end);
  const badge = document.getElementById('will-status');
  const map = { scheduled:['scheduled','Will schedule'], active:['active','Will publish (Active)'], expired:['expired','Ended'], draft:['draft','Draft'] };
  badge.className = 'badge badge--'+map[st][0];
  badge.innerHTML = `<span class="dot"></span>${map[st][1]}`;
  const note = document.getElementById('publish-note');
  if(st==='scheduled') note.innerHTML = `Because the start date (<strong>${fmt(start)}</strong>) is in the future, this notice will be <strong>Scheduled</strong> and go live automatically on its start date.`;
  else if(st==='active') note.innerHTML = `This notice is within its effective period and will go <strong>Active</strong> immediately for ${totalRecipients().toLocaleString()} recipients.`;
  else note.innerHTML = `Check the effective dates — the selected period has already ended.`;
}

/* ==================== actions / toast ==================== */
function toast(msg, kind){
  const t=document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(10px);z-index:99;
    background:var(--slate-900);color:#fff;padding:12px 18px;border-radius:12px;font-weight:500;font-size:14px;
    box-shadow:var(--el-lg);opacity:0;transition:.2s;display:flex;align-items:center;gap:10px;`;
  t.innerHTML = `<span style="width:8px;height:8px;border-radius:99px;background:${kind==='ok'?'var(--green-500)':'var(--brand-400)'}"></span>` + msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(10px)'; setTimeout(()=>t.remove(),250); }, 2600);
}
function saveDraft(){ toast('Saved as draft', 'ok'); }
function publishNotice(){
  const st = statusFor(document.getElementById('f-start').value, document.getElementById('f-end').value);
  toast(st==='scheduled' ? 'Notice scheduled' : 'Notice published', 'ok');
  setTimeout(()=>navTo('view'), 700);
}

/* ==================== init ==================== */
renderClassList();
/* Hash routing: #view, #detail, #create, #create/2 … (used for QA + deep links) */
const parts = (location.hash || '#hub').slice(1).split('/');
const start = CRUMBS[parts[0]] ? parts[0] : 'hub';
navTo(start);
if(start==='create' && parts[1]) goStep(+parts[1]);
window.addEventListener('hashchange', ()=>{
  const p = (location.hash||'#hub').slice(1).split('/');
  navTo(CRUMBS[p[0]] ? p[0] : 'hub');
  if(p[0]==='create' && p[1]) goStep(+p[1]);
});
