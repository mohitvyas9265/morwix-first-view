/* ============================================================
   Morwix — Engineering board
   From-scratch delivery plan: infra/DevOps → core platform & auth →
   school onboarding → the Notification Module (R1) flow we prototyped.
   Assignee + status edits persist to localStorage (no backend).
   ============================================================ */

const EPICS = {
  SETUP: '0. Setup (Infra, Platform & Onboarding)',
  A: '1. Create Notice (Admin)',
  B: '2. Manage & Track Notices (Admin)',
  C: '3. Receive & Respond (Parent/Student)',
  D: '4. Notice Module — Branding & Overview',
  R2: '5. Future (R2 backlog)',
};

const STATUSES = [
  { key: 'backlog',  label: 'Backlog' },
  { key: 'todo',     label: 'To Do' },
  { key: 'progress', label: 'In Progress' },
  { key: 'review',   label: 'In Review' },
  { key: 'done',     label: 'Done' },
];

const ASSIGNEES = ['Unassigned', 'Mohit', 'Ronal', 'Sudhanshu'];

/* Seed data — the full from-scratch delivery plan: foundational infra/
   platform/onboarding work first, then the R1 user-flow stories, then
   the R2 backlog. */
const SEED = [
  /* ---------------- 0. Setup — Infrastructure & DevOps ---------------- */
  { id:'INFRA-1', epic:'SETUP', priority:'high',
    title:'Initialize repo structure & branch strategy',
    story:'As the engineering team, we want an initial repo structure with a defined branching strategy and branch protection on main, so that everyone can contribute safely from day one.',
    ac:['main branch protected — required PR review + passing status checks before merge','Repo structure for frontend/backend/infra decided and documented in the README','CODEOWNERS file in place so PRs route to the right reviewers'],
    status:'backlog', assignee:'Mohit' },
  { id:'INFRA-2', epic:'SETUP', priority:'high',
    title:'Set up AWS account structure & IAM baseline',
    story:'As a DevOps engineer, I want a proper AWS account structure with least-privilege IAM roles so that our environments are isolated and access is auditable.',
    ac:['Separate AWS accounts (or fully isolated environments) for dev/staging/prod','IAM roles defined per team/function — no shared long-lived root credentials in use','Billing alerts configured so unexpected spend is caught early'],
    status:'backlog', assignee:'Ronal' },
  { id:'INFRA-3', epic:'SETUP', priority:'high',
    title:'Provision core networking (VPC, subnets, security groups)',
    story:'As a DevOps engineer, I want a VPC with public/private subnets and scoped security groups so that our services run in a secure, well-partitioned network.',
    ac:['VPC with public/private subnets across at least 2 availability zones','Security groups scoped to specific ports/services, not left wide open','NAT gateway configured for private-subnet outbound access'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'INFRA-4', epic:'SETUP', priority:'high',
    title:'Set up CI pipeline (build, lint, test on every PR)',
    story:'As a developer, I want every pull request to automatically build, lint and run tests so that broken code can\'t be merged.',
    ac:['CI runs automatically on every PR','A failing lint/test/build fails the PR status check','Build artifacts/dependencies cached so CI stays fast as the repo grows'],
    status:'backlog', assignee:'Mohit' },
  { id:'INFRA-5', epic:'SETUP', priority:'high',
    title:'Set up CD pipeline to dev/staging/prod',
    story:'As a DevOps engineer, I want an automated deployment pipeline so that merged code reaches dev automatically and can be promoted to staging/prod in a controlled way.',
    ac:['Merge to main auto-deploys to the dev environment','Promotion to staging/prod requires an explicit approval step','Rollback procedure documented and tested at least once before go-live'],
    status:'backlog', assignee:'Ronal' },
  { id:'INFRA-6', epic:'SETUP', priority:'high',
    title:'Provision managed database with migrations tooling',
    story:'As a backend engineer, I want a managed relational database with a schema-migration tool wired into the deploy pipeline so that schema changes are versioned and repeatable across environments.',
    ac:['Managed Postgres (or equivalent) instance provisioned per environment','Migration tool runs automatically as part of deploy — no manual schema edits','Automated backups configured, with at least one tested restore'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'INFRA-7', epic:'SETUP', priority:'high',
    title:'Set up secrets management',
    story:'As a DevOps engineer, I want application secrets stored in a managed secrets service rather than in code or plain env files, so that credentials are never exposed in the repo or CI logs.',
    ac:['No secrets committed to the repo — enforced by a secret-scanning check in CI','Secrets pulled at runtime/deploy from a managed secrets store, not hardcoded','Rotation process for credentials documented'],
    status:'backlog', assignee:'Mohit' },
  { id:'INFRA-8', epic:'SETUP', priority:'medium',
    title:'Set up centralized logging & metrics',
    story:'As an engineer on-call, I want centralized application logs and infrastructure metrics so that I can diagnose an incident without SSHing into individual servers.',
    ac:['Application logs shipped to a central log store','Key infra metrics (CPU, memory, latency, error rate) visible on a dashboard','Log retention policy defined and applied'],
    status:'backlog', assignee:'Ronal' },
  { id:'INFRA-9', epic:'SETUP', priority:'medium',
    title:'Set up alerting & on-call paging',
    story:'As an engineer on-call, I want automatic alerts when a service is down or erroring above a threshold so that I find out before users report it.',
    ac:['Alert fires on service downtime and on elevated error rate','Alert reaches an on-call channel/pager, not just an inbox nobody watches','Each alert type links to a runbook'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'INFRA-10', epic:'SETUP', priority:'high',
    title:'Set up frontend hosting & CDN',
    story:'As a DevOps engineer, I want the frontend served through a CDN with cache invalidation wired into deploys, so that users get fast load times and see the latest release immediately.',
    ac:['Static assets served via a CDN in front of storage/origin','Cache invalidated automatically on every deploy','Cache-control headers set appropriately per asset type'],
    status:'backlog', assignee:'Mohit' },
  { id:'INFRA-11', epic:'SETUP', priority:'high',
    title:'Configure custom domain & SSL',
    story:'As a DevOps engineer, I want the production domain configured with a valid, auto-renewing SSL certificate so that the app is always served securely over HTTPS.',
    ac:['Domain DNS managed in a cloud DNS service','TLS certificate issued and set to auto-renew','Plain HTTP requests redirect to HTTPS'],
    status:'backlog', assignee:'Ronal' },
  { id:'INFRA-12', epic:'SETUP', priority:'medium',
    title:'Set up error tracking & uptime monitoring',
    story:'As an engineer, I want frontend/backend errors captured with stack traces plus external uptime checks, so that I catch issues internal logs alone might miss.',
    ac:['Error-tracking SDK integrated on both frontend and backend','An external uptime check hits the production URL on a fixed interval','Alert fires on repeated uptime check failures'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'INFRA-13', epic:'SETUP', priority:'high',
    title:'Define local development environment setup',
    story:'As a new developer, I want a documented, scripted way to run the full stack locally so that I can start contributing on day one without tribal knowledge.',
    ac:['A single setup script/documented steps brings up the full stack locally','README\'s "Getting started" reflects the real app setup, not just the static prototypes','Seed/sample data available for local testing'],
    status:'backlog', assignee:'Mohit' },
  { id:'INFRA-14', epic:'SETUP', priority:'medium',
    title:'Manage all infrastructure as code',
    story:'As a DevOps engineer, I want every AWS resource defined as code so that infrastructure is reproducible and reviewable like application code, not created by hand in the console.',
    ac:['VPC, database, IAM roles and hosting resources all defined in an IaC tool','Infra changes go through the same PR review process as application code','A plan/diff step runs in CI for any PR that touches infra code'],
    status:'backlog', assignee:'Ronal' },

  /* ---------------- 0. Setup — Core Platform & Auth ---------------- */
  { id:'PLAT-1', epic:'SETUP', priority:'high',
    title:'Design multi-tenant data model',
    story:'As a backend engineer, I want a data model that cleanly isolates each school\'s data so that one school can never see or affect another school\'s data.',
    ac:['Every core table scoped by a school/tenant identifier','Data-access layer enforces tenant scoping by default, not by convention','A cross-tenant access attempt is provably blocked by an automated test'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'PLAT-2', epic:'SETUP', priority:'high',
    title:'Build account registration & login',
    story:'As a user — admin, teacher, parent, or student — I want to log in with an email and password so that I can access the parts of the app relevant to me.',
    ac:['Login form with real-time validation and clear error states','Passwords stored using a strong hash (bcrypt/argon2) — never in plain text','Failed-login attempts are rate-limited'],
    status:'backlog', assignee:'Mohit' },
  { id:'PLAT-3', epic:'SETUP', priority:'medium',
    title:'Build password reset flow',
    story:'As a user, I want to reset my password via email if I forget it so that I\'m not permanently locked out of my account.',
    ac:['"Forgot password" sends a time-limited reset link','Reset link expires after a set window','Old password stops working immediately once the reset completes'],
    status:'backlog', assignee:'Ronal' },
  { id:'PLAT-4', epic:'SETUP', priority:'high',
    title:'Build role-based access control',
    story:'As the platform, I want each user\'s role (Admin / Teacher / Parent / Student) to determine what they can see and do, so that e.g. a parent can\'t reach admin-only notice creation.',
    ac:['At least 4 roles defined with distinct permission sets','UI hides actions a role isn\'t permitted to perform','Backend also enforces the permission — not just a hidden button'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'PLAT-5', epic:'SETUP', priority:'medium',
    title:'Build session management & token refresh',
    story:'As a user, I want to stay logged in through a reasonable session without being kicked out mid-task, while staying secure, so the app doesn\'t interrupt my work.',
    ac:['Access tokens are short-lived with a working refresh mechanism','Logout invalidates the session server-side, not just client-side','Idle and absolute session timeouts are both defined'],
    status:'backlog', assignee:'Mohit' },
  { id:'PLAT-6', epic:'SETUP', priority:'high',
    title:'Build user invite flow',
    story:'As an admin, I want to invite a teacher, parent or student by email so that they set up their own account instead of me creating credentials for them.',
    ac:['Invite email contains a unique, expiring signup link','Invited user sets their own password on first login','Admin can see pending vs. accepted invites'],
    status:'backlog', assignee:'Ronal' },
  { id:'PLAT-7', epic:'SETUP', priority:'low',
    title:'Build audit log for admin actions',
    story:'As an admin, I want key actions (like publishing a notice or changing a user\'s role) recorded in an audit log so that we have accountability and can investigate issues later.',
    ac:['Audit entries capture who, what and when for sensitive actions','Audit log is append-only — not editable or deletable via the app','Admin can view and filter the audit log'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'PLAT-8', epic:'SETUP', priority:'high',
    title:'Port the design system into production',
    story:'As a frontend engineer, I want the tokens and components already validated in the prototypes (buttons, inputs, badges, etc.) built as real, reusable code so that production UI doesn\'t get redesigned from scratch.',
    ac:['Design tokens (color/spacing/type) ported from the prototype CSS into the production codebase','Core components (button, input, badge, table) implemented once and reused everywhere','Visual output matches the already-approved prototypes'],
    status:'backlog', assignee:'Mohit' },
  { id:'PLAT-9', epic:'SETUP', priority:'high',
    title:'Build backend API skeleton & versioning strategy',
    story:'As a backend engineer, I want an initial API service with a defined versioning approach so that future breaking changes don\'t break existing clients.',
    ac:['API exposes a health-check endpoint','API version is present in the route or header from day one','Error responses follow one consistent shape across all endpoints'],
    status:'backlog', assignee:'Ronal' },

  /* ---------------- 0. Setup — School Onboarding ---------------- */
  { id:'ONB-1', epic:'SETUP', priority:'high',
    title:'Admin creates a new school account',
    story:'As a new school administrator, I want to create our school\'s account on Morwix so that we can start setting up our own instance.',
    ac:['Sign-up flow captures the school name and the admin\'s own account details','New school gets its own isolated tenant automatically','Admin is logged in immediately after setup completes'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'ONB-2', epic:'SETUP', priority:'high',
    title:'Admin configures school profile & branding',
    story:'As an admin, I want to set our school\'s name, logo, and academic year so that the app reflects our identity — matching the school-branding work already prototyped on the Overview screen.',
    ac:['Admin can upload a logo and set the school name','Changes reflect immediately on the Overview screen','Academic year setting affects date defaults elsewhere in the app'],
    status:'backlog', assignee:'Mohit' },
  { id:'ONB-3', epic:'SETUP', priority:'high',
    title:'Admin sets up classes & sections',
    story:'As an admin, I want to define our school\'s classes and sections (e.g. Grade 7 → A/B/C/D) so that notices and other features can target them correctly.',
    ac:['Admin can create, edit and delete classes and sections','Class/section list feeds directly into the notice recipient picker already built','Can\'t delete a class currently targeted by an active notice'],
    status:'backlog', assignee:'Ronal' },
  { id:'ONB-4', epic:'SETUP', priority:'medium',
    title:'Admin imports students & parents via CSV',
    story:'As an admin, I want to import our student and parent roster via a CSV upload so that I don\'t have to add hundreds of people one at a time.',
    ac:['A CSV template is available to download','Import validates rows and reports errors per row rather than failing the whole file','Imported parents/students each receive an invite'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'ONB-5', epic:'SETUP', priority:'medium',
    title:'Admin adds/edits an individual student or parent',
    story:'As an admin, I want to add or edit one student/parent record so that I can make small roster corrections without re-running a bulk import.',
    ac:['Form to add a single student/parent with class/section assignment','Editing an existing record doesn\'t force a re-invite unless the email changed'],
    status:'backlog', assignee:'Mohit' },
  { id:'ONB-6', epic:'SETUP', priority:'medium',
    title:'Admin invites teaching/administrative staff',
    story:'As an admin, I want to invite other staff (teachers, co-admins) with the appropriate role so that they can help manage the school\'s account.',
    ac:['Invite flow lets the admin choose a role for the invitee','Multiple admins can exist per school','An admin can revoke another staff member\'s access'],
    status:'backlog', assignee:'Ronal' },
  { id:'ONB-7', epic:'SETUP', priority:'medium',
    title:'Admin configures notification delivery channels',
    story:'As an admin, I want to choose which channels (push, email, SMS) our school\'s notices go out on so that we reach parents through the channels they actually use.',
    ac:['At least push and email supported at launch','Channel choice is configurable per school, not hardcoded','A test notification can be sent to confirm delivery before relying on it'],
    status:'backlog', assignee:'Sudhanshu' },

  /* ---------------- 1. Create Notice (Admin) ---------------- */
  { id:'NOTIF-1', epic:'A', priority:'high',
    title:'Compose notice details',
    story:'As an admin, I want to enter a title, description and effective dates so that I can start composing a new notice.',
    ac:['Title and description are required before continuing','Start and end date are required','Description is plain text only for R1 — no rich text or attachments'],
    status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-2', epic:'A', priority:'medium',
    title:'Mark whether a response is required',
    story:'As an admin, I want to toggle "Response required?" so that recipients know whether they must act on this notice.',
    ac:['Defaults to a sensible value when creating a new notice','Choice is reflected on the Review step and on Notice Details'],
    status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-3', epic:'A', priority:'high',
    title:'Select recipients from one unified checklist',
    story:'As an admin, I want a single class checklist with a "Select all" shortcut so that I can target everyone or a subset without switching between two different modes.',
    ac:['No separate "All classes / Selected classes" mode switch','"Select all" / "Clear all" toggles every class in one tap','Checking every class individually produces the same result as "Select all"'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-4', epic:'A', priority:'high',
    title:'Target specific sections within a class',
    story:'As an admin, I want to narrow a class down to specific sections (e.g. Grade 7 → A & C only) so that I can send a notice to part of a class.',
    ac:['Per-class toggle between "All sections" and "Specific"','Section chips (A/B/C/D) are multi-select','Works independently per class in the same checklist'],
    status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-5', epic:'A', priority:'medium',
    title:'Live recipient count while building the audience',
    story:'As an admin, I want to see an estimated recipient count update as I check/uncheck classes and sections so that I know my audience size before I proceed.',
    ac:['Count updates immediately on every checklist change','Shows both a total and a class count (e.g. "≈445 recipients across 5 classes")'],
    status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-6', epic:'A', priority:'high',
    title:'Review notice + recipients before publishing',
    story:'As an admin, I want one Review step that shows the full notice and the recipient summary together, with a confirmation checkbox, so that I can\'t accidentally publish to the wrong audience.',
    ac:['Recipient summary is shown on the same screen as the notice details, not a separate step','Publish button is disabled until the confirmation checkbox is checked','Warns that recipients can\'t be edited after publishing in R1'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-7', epic:'A', priority:'medium',
    title:'Auto-detect Draft / Scheduled / Active at publish time',
    story:'As an admin, I want the system to figure out whether my notice should be Scheduled or go Active immediately based on its start date, so that I don\'t have to set status manually.',
    ac:['Start date in the future → status becomes Scheduled','Start date today/past and end date not yet passed → status becomes Active','End date already passed → flagged before publish'],
    status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-8', epic:'A', priority:'low',
    title:'Save a notice as a draft from any step',
    story:'As an admin, I want a "Save as draft" option available on every step of the wizard so that I can finish composing a notice later without losing my progress.',
    ac:['"Save as draft" is present on Details, Recipients and Review steps','Draft notices appear in the "Drafts" count on the Overview screen'],
    status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-9', epic:'B', priority:'high',
    title:'Notices table with independent filters',
    story:'As an admin, I want to filter the notices table by date, class, section, status and response independently so that I can quickly find a specific notice without one filter resetting another.',
    ac:['Date, Class, Section, Status and Response filters can be combined freely','Search by title works alongside the filters','Table stays concise — no combined mega-filter'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-10', epic:'B', priority:'high',
    title:'Notice Details — full recipient breakdown',
    story:'As an admin, I want to open a notice and see exactly which classes/sections it targeted so that I can confirm who actually received it.',
    ac:['Lists every targeted class with its section scope (All sections vs specific)','Shows an estimated recipient count per class'],
    status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-11', epic:'B', priority:'medium',
    title:'Response tracking by grade',
    story:'As an admin, I want to see overall response % and a per-grade breakdown so that I know which groups still need a follow-up.',
    ac:['Overall responded vs. awaiting counts, shown as a ring/percentage','Per-grade progress bars with % responded','Only shown when the notice has "Response required" set to Yes'],
    status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-12', epic:'C', priority:'high',
    title:'Push notification for a new notice',
    story:'As a parent/student, I want a push notification when a new notice is posted so that I don\'t have to open the app to find out.',
    ac:['Notification shows the notice title and whether a response is needed','Tapping it opens the notice directly'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-13', epic:'C', priority:'high',
    title:'Action-needed notices surfaced first in the feed',
    story:'As a parent/student, I want notices that require a response to appear above everything else in my feed so that I don\'t miss something I need to act on.',
    ac:['Feed groups "Action needed" separately from "Earlier"','Action-needed count is visible at a glance'],
    status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-14', epic:'C', priority:'high',
    title:'Respond to a notice in one tap',
    story:'As a parent/student, I want to give or withhold consent directly from the notice so that I can respond without extra steps.',
    ac:['Response actions are docked at the bottom of the notice detail screen','At least two response options are available (e.g. "Give consent" / "Can\'t attend")'],
    status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-15', epic:'C', priority:'medium',
    title:'Clear confirmation after responding',
    story:'As a parent/student, I want a clear confirmation once I\'ve responded so that I know it was recorded and can change it if needed.',
    ac:['Notice detail shows a "Consent given" (or equivalent) state with a timestamp','A "Change response" action remains available'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-16', epic:'D', priority:'medium',
    title:'School branding on the Overview/Home screen',
    story:'As an admin, I want the Overview screen to lead with our school\'s branding, with Notices as one section beneath it, so that the product feels like it belongs to our school and can hold future sections like Attendance.',
    ac:['Heading shows school logo + name instead of a generic "Notices" title','"Notices" is a clearly labeled section, not the entire page','No redundant entry cards or a duplicate "Recent notices" list on this screen'],
    status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-17', epic:'R2', priority:'low',
    title:'Edit or archive a notice after publishing',
    story:'As an admin, I want to edit or archive a notice after it has been published so that I can correct mistakes without creating a duplicate.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-18', epic:'R2', priority:'low',
    title:'Read/unread tracking per recipient',
    story:'As an admin, I want to see who has opened a notice (not just who responded) so that I can measure reach as well as response.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-19', epic:'R2', priority:'low',
    title:'Rich text & attachments in the composer',
    story:'As an admin, I want to format text and attach files/images to a notice so that I can share richer content than plain text.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-20', epic:'R2', priority:'low',
    title:'Recurring notices & templates',
    story:'As an admin, I want to save a notice as a reusable template or set it to repeat on a schedule so that I don\'t have to recreate routine notices.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    status:'backlog', assignee:'Ronal' },
];

/* v2: full from-scratch backlog + new assignee list — bumped so any
   previously saved overrides (old assignee names, non-backlog statuses)
   don't silently resurrect on top of the new seed. */
const STORE_KEY = 'morwix-notif-r1-board-v2';

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
