/* ============================================================
   Morwix — Notification Module (R1) · Internal board
   Static ticket board seeded from the user flow we prototyped.
   Assignee + status edits persist to localStorage (no backend).
   ============================================================ */

const EPICS = {
  A: 'Create Notice (Admin)',
  B: 'Manage & Track Notices (Admin)',
  C: 'Receive & Respond (Parent/Student)',
  D: 'Platform & Branding',
  R2: 'Future (R2 backlog)',
};

const STATUSES = [
  { key: 'backlog',  label: 'Backlog' },
  { key: 'todo',     label: 'To Do' },
  { key: 'progress', label: 'In Progress' },
  { key: 'review',   label: 'In Review' },
  { key: 'done',     label: 'Done' },
];

const ASSIGNEES = ['Unassigned', 'Alex Kim', 'Priya Singh', 'Jordan Lee', 'Sam Patel', 'Morgan Diaz'];

/* Seed data — one card per user story surfaced by the R1 flow we built. */
const SEED = [
  { id:'NOTIF-1', epic:'A', priority:'high',
    title:'Compose notice details',
    story:'As an admin, I want to enter a title, description and effective dates so that I can start composing a new notice.',
    ac:['Title and description are required before continuing','Start and end date are required','Description is plain text only for R1 — no rich text or attachments'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-2', epic:'A', priority:'medium',
    title:'Mark whether a response is required',
    story:'As an admin, I want to toggle "Response required?" so that recipients know whether they must act on this notice.',
    ac:['Defaults to a sensible value when creating a new notice','Choice is reflected on the Review step and on Notice Details'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-3', epic:'A', priority:'high',
    title:'Select recipients from one unified checklist',
    story:'As an admin, I want a single class checklist with a "Select all" shortcut so that I can target everyone or a subset without switching between two different modes.',
    ac:['No separate "All classes / Selected classes" mode switch','"Select all" / "Clear all" toggles every class in one tap','Checking every class individually produces the same result as "Select all"'],
    status:'review', assignee:'Unassigned' },
  { id:'NOTIF-4', epic:'A', priority:'high',
    title:'Target specific sections within a class',
    story:'As an admin, I want to narrow a class down to specific sections (e.g. Grade 7 → A & C only) so that I can send a notice to part of a class.',
    ac:['Per-class toggle between "All sections" and "Specific"','Section chips (A/B/C/D) are multi-select','Works independently per class in the same checklist'],
    status:'review', assignee:'Unassigned' },
  { id:'NOTIF-5', epic:'A', priority:'medium',
    title:'Live recipient count while building the audience',
    story:'As an admin, I want to see an estimated recipient count update as I check/uncheck classes and sections so that I know my audience size before I proceed.',
    ac:['Count updates immediately on every checklist change','Shows both a total and a class count (e.g. "≈445 recipients across 5 classes")'],
    status:'review', assignee:'Unassigned' },
  { id:'NOTIF-6', epic:'A', priority:'high',
    title:'Review notice + recipients before publishing',
    story:'As an admin, I want one Review step that shows the full notice and the recipient summary together, with a confirmation checkbox, so that I can\'t accidentally publish to the wrong audience.',
    ac:['Recipient summary is shown on the same screen as the notice details, not a separate step','Publish button is disabled until the confirmation checkbox is checked','Warns that recipients can\'t be edited after publishing in R1'],
    status:'review', assignee:'Unassigned' },
  { id:'NOTIF-7', epic:'A', priority:'medium',
    title:'Auto-detect Draft / Scheduled / Active at publish time',
    story:'As an admin, I want the system to figure out whether my notice should be Scheduled or go Active immediately based on its start date, so that I don\'t have to set status manually.',
    ac:['Start date in the future → status becomes Scheduled','Start date today/past and end date not yet passed → status becomes Active','End date already passed → flagged before publish'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-8', epic:'A', priority:'low',
    title:'Save a notice as a draft from any step',
    story:'As an admin, I want a "Save as draft" option available on every step of the wizard so that I can finish composing a notice later without losing my progress.',
    ac:['"Save as draft" is present on Details, Recipients and Review steps','Draft notices appear in the "Drafts" count on the Overview screen'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-9', epic:'B', priority:'high',
    title:'Notices table with independent filters',
    story:'As an admin, I want to filter the notices table by date, class, section, status and response independently so that I can quickly find a specific notice without one filter resetting another.',
    ac:['Date, Class, Section, Status and Response filters can be combined freely','Search by title works alongside the filters','Table stays concise — no combined mega-filter'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-10', epic:'B', priority:'high',
    title:'Notice Details — full recipient breakdown',
    story:'As an admin, I want to open a notice and see exactly which classes/sections it targeted so that I can confirm who actually received it.',
    ac:['Lists every targeted class with its section scope (All sections vs specific)','Shows an estimated recipient count per class'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-11', epic:'B', priority:'medium',
    title:'Response tracking by grade',
    story:'As an admin, I want to see overall response % and a per-grade breakdown so that I know which groups still need a follow-up.',
    ac:['Overall responded vs. awaiting counts, shown as a ring/percentage','Per-grade progress bars with % responded','Only shown when the notice has "Response required" set to Yes'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-12', epic:'C', priority:'high',
    title:'Push notification for a new notice',
    story:'As a parent/student, I want a push notification when a new notice is posted so that I don\'t have to open the app to find out.',
    ac:['Notification shows the notice title and whether a response is needed','Tapping it opens the notice directly'],
    status:'todo', assignee:'Unassigned' },
  { id:'NOTIF-13', epic:'C', priority:'high',
    title:'Action-needed notices surfaced first in the feed',
    story:'As a parent/student, I want notices that require a response to appear above everything else in my feed so that I don\'t miss something I need to act on.',
    ac:['Feed groups "Action needed" separately from "Earlier"','Action-needed count is visible at a glance'],
    status:'review', assignee:'Unassigned' },
  { id:'NOTIF-14', epic:'C', priority:'high',
    title:'Respond to a notice in one tap',
    story:'As a parent/student, I want to give or withhold consent directly from the notice so that I can respond without extra steps.',
    ac:['Response actions are docked at the bottom of the notice detail screen','At least two response options are available (e.g. "Give consent" / "Can\'t attend")'],
    status:'review', assignee:'Unassigned' },
  { id:'NOTIF-15', epic:'C', priority:'medium',
    title:'Clear confirmation after responding',
    story:'As a parent/student, I want a clear confirmation once I\'ve responded so that I know it was recorded and can change it if needed.',
    ac:['Notice detail shows a "Consent given" (or equivalent) state with a timestamp','A "Change response" action remains available'],
    status:'review', assignee:'Unassigned' },
  { id:'NOTIF-16', epic:'D', priority:'medium',
    title:'School branding on the Overview/Home screen',
    story:'As an admin, I want the Overview screen to lead with our school\'s branding, with Notices as one section beneath it, so that the product feels like it belongs to our school and can hold future sections like Attendance.',
    ac:['Heading shows school logo + name instead of a generic "Notices" title','"Notices" is a clearly labeled section, not the entire page','No redundant entry cards or a duplicate "Recent notices" list on this screen'],
    status:'done', assignee:'Unassigned' },
  { id:'NOTIF-17', epic:'R2', priority:'low',
    title:'Edit or archive a notice after publishing',
    story:'As an admin, I want to edit or archive a notice after it has been published so that I can correct mistakes without creating a duplicate.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Unassigned' },
  { id:'NOTIF-18', epic:'R2', priority:'low',
    title:'Read/unread tracking per recipient',
    story:'As an admin, I want to see who has opened a notice (not just who responded) so that I can measure reach as well as response.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Unassigned' },
  { id:'NOTIF-19', epic:'R2', priority:'low',
    title:'Rich text & attachments in the composer',
    story:'As an admin, I want to format text and attach files/images to a notice so that I can share richer content than plain text.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Unassigned' },
  { id:'NOTIF-20', epic:'R2', priority:'low',
    title:'Recurring notices & templates',
    story:'As an admin, I want to save a notice as a reusable template or set it to repeat on a schedule so that I don\'t have to recreate routine notices.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Unassigned' },
];

const STORE_KEY = 'morwix-notif-r1-board-v1';

function loadOverrides(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch(e){ return {}; }
}
function saveOverrides(overrides){
  localStorage.setItem(STORE_KEY, JSON.stringify(overrides));
}

let overrides = loadOverrides();
let tickets = SEED.map(t => ({ ...t, ...(overrides[t.id] || {}) }));

function setOverride(id, patch){
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  saveOverrides(overrides);
  tickets = tickets.map(t => t.id === id ? { ...t, ...patch } : t);
}

/* ---------- Filter controls ---------- */
const searchEl = document.getElementById('search');
const epicEl = document.getElementById('filter-epic');
const assigneeEl = document.getElementById('filter-assignee');
const priorityEl = document.getElementById('filter-priority');

Object.entries(EPICS).forEach(([key, label]) => {
  const o = document.createElement('option'); o.value = key; o.textContent = label; epicEl.appendChild(o);
});
ASSIGNEES.forEach(name => {
  const o = document.createElement('option'); o.value = name; o.textContent = name; assigneeEl.appendChild(o);
});
['high','medium','low'].forEach(p => {
  const o = document.createElement('option'); o.value = p; o.textContent = p[0].toUpperCase()+p.slice(1); priorityEl.appendChild(o);
});

[searchEl, epicEl, assigneeEl, priorityEl].forEach(el => el.addEventListener('input', render));

document.getElementById('reset-board').addEventListener('click', () => {
  overrides = {};
  saveOverrides(overrides);
  tickets = SEED.map(t => ({ ...t }));
  render();
});

/* ---------- Rendering ---------- */
const board = document.getElementById('board');
const countsEl = document.getElementById('counts');
const statusDotClass = { backlog:'status-dot--backlog', todo:'status-dot--todo', progress:'status-dot--progress', review:'status-dot--review', done:'status-dot--done' };

function filtered(){
  const q = searchEl.value.trim().toLowerCase();
  const epic = epicEl.value, assignee = assigneeEl.value, priority = priorityEl.value;
  return tickets.filter(t => {
    if (q && !(t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))) return false;
    if (epic && t.epic !== epic) return false;
    if (assignee && t.assignee !== assignee) return false;
    if (priority && t.priority !== priority) return false;
    return true;
  });
}

function cardHTML(t){
  const acItems = t.ac.map(a => `<li>${a}</li>`).join('');
  const assigneeOptions = ASSIGNEES.map(n => `<option ${n===t.assignee?'selected':''}>${n}</option>`).join('');
  const statusOptions = STATUSES.map(s => `<option value="${s.key}" ${s.key===t.status?'selected':''}>${s.label}</option>`).join('');
  return `
    <div class="card" data-id="${t.id}">
      <div class="card-top">
        <span class="card-id">${t.id}</span>
        <span class="pr pr--${t.priority}">${t.priority}</span>
        <span class="card-epic">${EPICS[t.epic]}</span>
      </div>
      <div class="card-title">${t.title}</div>
      <div class="card-story">${t.story}</div>
      <div class="ac-toggle" data-toggle-ac>
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        Acceptance criteria (${t.ac.length})
      </div>
      <ul class="ac-list">${acItems}</ul>
      <div class="card-foot">
        <select class="assignee-select" data-role="assignee">${assigneeOptions}</select>
        <div class="status-wrap">
          <select data-role="status">${statusOptions}</select>
        </div>
      </div>
    </div>`;
}

function render(){
  const list = filtered();
  board.innerHTML = STATUSES.map(s => {
    const items = list.filter(t => t.status === s.key);
    return `
      <section class="column" data-status="${s.key}">
        <div class="column-head">
          <span class="status-dot ${statusDotClass[s.key]}"></span>
          <span class="name">${s.label}</span>
          <span class="count">${items.length}</span>
        </div>
        <div class="column-cards">
          ${items.length ? items.map(cardHTML).join('') : '<div class="column-empty">No tickets</div>'}
        </div>
      </section>`;
  }).join('');

  countsEl.innerHTML = `<span><b>${list.length}</b> of ${tickets.length} tickets</span>`;
}

/* Delegated events: assignee/status selects + AC toggle */
board.addEventListener('change', (e) => {
  const card = e.target.closest('.card'); if (!card) return;
  const id = card.dataset.id;
  if (e.target.dataset.role === 'assignee') setOverride(id, { assignee: e.target.value });
  if (e.target.dataset.role === 'status') setOverride(id, { status: e.target.value });
  render();
});
board.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-toggle-ac]'); if (!toggle) return;
  toggle.classList.toggle('open');
  toggle.nextElementSibling.classList.toggle('open');
});

render();
