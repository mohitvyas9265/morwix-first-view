/* ============================================================
   Morwix — Engineering board
   From-scratch delivery plan, MVP-refined: Setup work split into
   3 parallel tracks (Backend / Web / App), then the Notification
   Module (R1) flow we prototyped, then the R2 backlog.
   Assignee + status edits persist to localStorage (no backend).
   ============================================================ */

const EPICS = {
  SETUP_BE: '0a. Setup — Backend',
  SETUP_WEB: '0b. Setup — Web',
  SETUP_APP: '0c. Setup — App',
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

/* Seed data — MVP-refined delivery plan.
   Setup work is split into 3 parallel tracks (Backend / Web / App).
   A ticket's `dependsOn` lists IDs that must land first; tickets with
   no `dependsOn` can start immediately / in parallel with everything
   else that also has none. `tag` flags things explicitly deferred or
   downgraded during MVP scoping (Nice to have / Future / etc). */
const SEED = [
  /* ---------------- 0a. Setup — Backend ---------------- */
  { id:'SETUP-BE-1', epic:'SETUP_BE', priority:'high',
    title:'Decide core architecture: multi-tenant app, domains, server vs serverless',
    story:'As the engineering team, we want to decide our core architecture — one multi-tenant application, one domain each for web, the Android app\'s backend-facing endpoints, and backend services, and whether we run server-based or serverless compute — so that everything else we build has a settled foundation.',
    ac:['Decision recorded: single multi-tenant application (confirmed direction)','Domain/subdomain names assigned for web, app, and backend services','Decision recorded: server-based vs serverless compute, with rationale'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-2', epic:'SETUP_BE', priority:'high',
    title:'Set up single AWS account with root & admin roles',
    story:'As a DevOps engineer, I want one AWS account with a root user and a single admin role so that we can operate simply without managing multiple accounts or complex IAM policies.',
    ac:['One AWS account provisioned — no separate dev/staging/prod accounts','Root user secured (MFA enabled) and not used for day-to-day work','One admin IAM role created and used for daily operations'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-3', epic:'SETUP_BE', priority:'high',
    title:'Provision simplified single-AZ networking',
    story:'As a DevOps engineer, I want a minimal single-AZ network (VPC + security groups only) so that we can run our MVP without the cost or complexity of multi-AZ redundancy or load balancing we don\'t need yet.',
    ac:['VPC provisioned in a single Availability Zone','Security groups scoped to the services we actually run','No NAT gateway and no ALB/NLB — explicitly out of scope for MVP'],
    dependsOn:['SETUP-BE-2'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-4', epic:'SETUP_BE', priority:'high',
    title:'Decide self-hosted vs AWS-managed database',
    story:'As a backend engineer, I want to decide whether we self-host our database or use an AWS-managed service (e.g. RDS) so that we pick the right tradeoff of cost vs. operational overhead for our MVP scale.',
    ac:['Decision recorded: self-hosted vs AWS-managed, with rationale (cost, ops burden, scale)','No schema-migration tooling required for MVP — manual schema changes are acceptable for now'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-5', epic:'SETUP_BE', priority:'high',
    title:'Design multi-tenant data model',
    story:'As a backend engineer, I want a data model that cleanly isolates each school\'s data so that one school can never see or affect another school\'s data.',
    ac:['Every core table scoped by a school/tenant identifier','Data-access layer enforces tenant scoping by default, not by convention','A cross-tenant access attempt is provably blocked by an automated test'],
    dependsOn:['SETUP-BE-4'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-6', epic:'SETUP_BE', priority:'high',
    title:'Build internal controller: provision school + admin/student/parent records',
    story:'As an internal operator, I want a controller (not a public sign-up form) that provisions a school and its admin/student/parent records so that schools are onboarded deliberately by us rather than through open self-service.',
    ac:['Internal endpoint creates a school record plus its initial admin/student/parent records in one call','Not reachable or discoverable from the public web/app — internal use only','Covers what was previously separate "create school account" and "registration" tickets — this is the one place that provisioning happens'],
    dependsOn:['SETUP-BE-5', 'SETUP-BE-3'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-7', epic:'SETUP_BE', priority:'high',
    title:'Build login — Backend',
    story:'As a user of any surface (web or app), I want a backend that authenticates my email/password and issues a session so that I can log in from either surface against the same account.',
    ac:['Authenticates against records created by the internal controller','Issues a session/token; session invalidated server-side on logout','Failed-login attempts are rate-limited','Covers session issuance and refresh — no separate session-management ticket needed for MVP'],
    dependsOn:['SETUP-BE-6'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-8', epic:'SETUP_BE', priority:'high',
    title:'Build role-based access control',
    story:'As the platform, I want each user\'s role (Admin / Teacher / Parent / Student) to determine what they can see and do, so that e.g. a parent can\'t reach admin-only notice creation.',
    ac:['At least 4 roles defined with distinct permission sets','UI hides actions a role isn\'t permitted to perform','Backend also enforces the permission — not just a hidden button'],
    dependsOn:['SETUP-BE-5'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-9', epic:'SETUP_BE', priority:'medium',
    title:'Decide IaC tool: CloudFormation vs Terraform',
    story:'As a DevOps engineer, I want to compare CloudFormation and Terraform so that we deliberately choose one IaC tool instead of defaulting to whichever is more familiar.',
    ac:['Comparison covers cost, learning curve, and fit with our single-account setup','Decision recorded with rationale'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-10', epic:'SETUP_BE', priority:'low', tag:'Nice to have',
    title:'Set up CI pipeline (build, lint, test on every PR)',
    story:'As a developer, I want every pull request to automatically build, lint and run tests so that broken code can\'t be merged.',
    ac:['CI runs automatically on every PR','A failing lint/test/build fails the PR status check'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-11', epic:'SETUP_BE', priority:'low',
    title:'Set up basic deploy pipeline (single environment)',
    story:'As a DevOps engineer, I want merging to main to deploy to our one environment so that shipping doesn\'t require a manual release step.',
    ac:['Merge to main deploys automatically','A documented rollback step exists, even if manual, for our single-environment setup'],
    dependsOn:['SETUP-BE-2'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-12', epic:'SETUP_BE', priority:'low', tag:'Needed at deploy',
    title:'Set up secrets management',
    story:'As a DevOps engineer, I want application secrets stored in a managed secrets service rather than in code or plain env files, so that credentials are never exposed in the repo or logs.',
    ac:['No secrets committed to the repo','Secrets pulled at runtime/deploy from a managed secrets store, not hardcoded','Only needed once we actually deploy a real service — not before'],
    dependsOn:['SETUP-BE-2'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-13', epic:'SETUP_BE', priority:'low', tag:'Future',
    title:'Set up centralized logging & metrics',
    story:'As an engineer on-call, I want centralized application logs and infrastructure metrics so that I can diagnose an incident without SSHing into individual servers.',
    ac:['Deferred until after MVP launch — logged here so it isn\'t forgotten'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-14', epic:'SETUP_BE', priority:'low', tag:'Future',
    title:'Set up alerting & on-call paging',
    story:'As an engineer on-call, I want automatic alerts when a service is down or erroring above a threshold so that I find out before users report it.',
    ac:['Deferred until after MVP launch — logged here so it isn\'t forgotten'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-15', epic:'SETUP_BE', priority:'low', tag:'Future',
    title:'Build password reset flow',
    story:'As a user, I want to reset my password via email if I forget it so that I\'m not permanently locked out of my account.',
    ac:['Deferred for MVP — an internal operator can reset a password manually via the internal controller in the meantime'],
    dependsOn:['SETUP-BE-6'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-16', epic:'SETUP_BE', priority:'low', tag:'Nice to have',
    title:'Build user invite flow (additional staff/admins)',
    story:'As an admin, I want to invite another staff member or co-admin by email so that they can set up their own account instead of me creating credentials for them.',
    ac:['Invite email contains a unique, expiring signup link','Deferred behind the internal controller for MVP — single-admin schools don\'t need this yet'],
    dependsOn:['SETUP-BE-6'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-BE-17', epic:'SETUP_BE', priority:'low', tag:'Future',
    title:'Build audit log for admin actions',
    story:'As an admin, I want key actions (like publishing a notice or changing a user\'s role) recorded in an audit log so that we have accountability and can investigate issues later.',
    ac:['Deferred until after MVP launch — logged here so it isn\'t forgotten'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },

  /* ---------------- 0b. Setup — Web ---------------- */
  { id:'SETUP-WEB-1', epic:'SETUP_WEB', priority:'high',
    title:'Migrate landing page to AWS hosting with domain & SSL',
    story:'As a DevOps engineer, I want to move our current landing page (currently on GitHub Pages) to AWS hosting with our domain pointed at it and an AWS Certificate Manager certificate, so that our production site runs on our own infrastructure securely.',
    ac:['Landing page served from AWS','Domain DNS points at the new AWS-hosted site','ACM certificate issued and auto-renewing; HTTP redirects to HTTPS'],
    dependsOn:['SETUP-BE-2'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-WEB-2', epic:'SETUP_WEB', priority:'high',
    title:'Build login — Web',
    story:'As a user, I want to log in on the web app with my email and password so that I can access the parts of the app relevant to my role.',
    ac:['Login form with real-time validation and clear error states','Calls the backend login API and stores the session appropriately','Redirects to the right landing screen per role after login'],
    dependsOn:['SETUP-BE-7'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-WEB-3', epic:'SETUP_WEB', priority:'medium',
    title:'Admin configures school profile & branding — Web',
    story:'As an admin, I want to set our school\'s name, logo, and academic year so that the app reflects our identity — matching the school-branding work already prototyped on the Overview screen.',
    ac:['Admin can upload a logo and set the school name','Changes reflect immediately on the Overview screen','Initial values can already be set by the internal controller at provisioning time — this screen is for edits after the fact'],
    dependsOn:['SETUP-BE-6'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-WEB-4', epic:'SETUP_WEB', priority:'high',
    title:'Admin sets up classes & sections — Web',
    story:'As an admin, I want to define our school\'s classes and sections (e.g. Grade 7 → A/B/C/D) so that notices and other features can target them correctly.',
    ac:['Admin can create, edit and delete classes and sections','Class/section list feeds directly into the notice recipient picker already built','Can\'t delete a class currently targeted by an active notice'],
    dependsOn:['SETUP-BE-6'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-WEB-5', epic:'SETUP_WEB', priority:'high',
    title:'Admin adds/edits an individual student or parent — Web',
    story:'As an admin, I want to add or edit one student/parent record so that our roster is accurate — this is the only way to manage the roster for MVP (see SETUP-WEB-6 for why bulk import is deferred).',
    ac:['Form to add a single student/parent with class/section assignment','Editing an existing record doesn\'t force a re-invite unless the email changed'],
    dependsOn:['SETUP-BE-6'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-WEB-6', epic:'SETUP_WEB', priority:'low', tag:'Deferred',
    title:'Admin imports students & parents via CSV',
    story:'As an admin, I want to import our student and parent roster via a CSV upload so that I don\'t have to add hundreds of people one at a time.',
    ac:['Not needed for now — manual add/edit (SETUP-WEB-5) covers MVP','Revisit once an actual school asks for bulk import'],
    dependsOn:['SETUP-WEB-5'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-WEB-7', epic:'SETUP_WEB', priority:'medium',
    title:'Admin invites teaching/administrative staff — Web',
    story:'As an admin, I want to invite other staff (teachers, co-admins) with the appropriate role so that they can help manage the school\'s account.',
    ac:['Invite flow lets the admin choose a role for the invitee','An admin can revoke another staff member\'s access'],
    dependsOn:['SETUP-BE-16'], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-WEB-8', epic:'SETUP_WEB', priority:'low', tag:'Future',
    title:'Admin configures notification delivery channels — Web',
    story:'As an admin, I want to choose which channels (push, email, SMS) our school\'s notices go out on so that we reach parents through the channels they actually use.',
    ac:['Deferred for MVP — ship with a fixed default channel set (push + email) and revisit configurability later'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },

  /* ---------------- 0c. Setup — App ---------------- */
  { id:'SETUP-APP-1', epic:'SETUP_APP', priority:'high',
    title:'Set up Android app project shell & build pipeline',
    story:'As a mobile engineer, I want a basic Android app project with a working build so that we have somewhere to put the login and notices screens once the backend is ready.',
    ac:['Project builds and runs a minimal "hello world" screen','Basic build pipeline produces an installable build'],
    dependsOn:[], status:'backlog', assignee:'Unassigned' },
  { id:'SETUP-APP-2', epic:'SETUP_APP', priority:'high',
    title:'Build login — App',
    story:'As a user, I want to log in on the Android app with my email and password so that I can access the parts of the app relevant to my role.',
    ac:['Login screen with real-time validation and clear error states','Calls the backend login API and stores the session appropriately','Routes to the right landing screen per role after login'],
    dependsOn:['SETUP-BE-7', 'SETUP-APP-1'], status:'backlog', assignee:'Unassigned' },

  /* ---------------- 1. Create Notice (Admin) ---------------- */
  { id:'NOTIF-1', epic:'A', priority:'high',
    title:'Compose notice details',
    story:'As an admin, I want to enter a title, description and effective dates so that I can start composing a new notice.',
    ac:['Title and description are required before continuing','Start and end date are required','Description is plain text only for R1 — no rich text or attachments'],
    dependsOn:[], status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-2', epic:'A', priority:'medium',
    title:'Mark whether a response is required',
    story:'As an admin, I want to toggle "Response required?" so that recipients know whether they must act on this notice.',
    ac:['Defaults to a sensible value when creating a new notice','Choice is reflected on the Review step and on Notice Details'],
    dependsOn:[], status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-3', epic:'A', priority:'high',
    title:'Select recipients from one unified checklist',
    story:'As an admin, I want a single class checklist with a "Select all" shortcut so that I can target everyone or a subset without switching between two different modes.',
    ac:['No separate "All classes / Selected classes" mode switch','"Select all" / "Clear all" toggles every class in one tap','Checking every class individually produces the same result as "Select all"'],
    dependsOn:[], status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-4', epic:'A', priority:'high',
    title:'Target specific sections within a class',
    story:'As an admin, I want to narrow a class down to specific sections (e.g. Grade 7 → A & C only) so that I can send a notice to part of a class.',
    ac:['Per-class toggle between "All sections" and "Specific"','Section chips (A/B/C/D) are multi-select','Works independently per class in the same checklist'],
    dependsOn:[], status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-5', epic:'A', priority:'medium',
    title:'Live recipient count while building the audience',
    story:'As an admin, I want to see an estimated recipient count update as I check/uncheck classes and sections so that I know my audience size before I proceed.',
    ac:['Count updates immediately on every checklist change','Shows both a total and a class count (e.g. "≈445 recipients across 5 classes")'],
    dependsOn:[], status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-6', epic:'A', priority:'high',
    title:'Review notice + recipients before publishing',
    story:'As an admin, I want one Review step that shows the full notice and the recipient summary together, with a confirmation checkbox, so that I can\'t accidentally publish to the wrong audience.',
    ac:['Recipient summary is shown on the same screen as the notice details, not a separate step','Publish button is disabled until the confirmation checkbox is checked','Warns that recipients can\'t be edited after publishing in R1'],
    dependsOn:[], status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-7', epic:'A', priority:'medium',
    title:'Auto-detect Draft / Scheduled / Active at publish time',
    story:'As an admin, I want the system to figure out whether my notice should be Scheduled or go Active immediately based on its start date, so that I don\'t have to set status manually.',
    ac:['Start date in the future → status becomes Scheduled','Start date today/past and end date not yet passed → status becomes Active','End date already passed → flagged before publish'],
    dependsOn:[], status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-8', epic:'A', priority:'low',
    title:'Save a notice as a draft from any step',
    story:'As an admin, I want a "Save as draft" option available on every step of the wizard so that I can finish composing a notice later without losing my progress.',
    ac:['"Save as draft" is present on Details, Recipients and Review steps','Draft notices appear in the "Drafts" count on the Overview screen'],
    dependsOn:[], status:'backlog', assignee:'Ronal' },

  /* ---------------- 2. Manage & Track Notices (Admin) ---------------- */
  { id:'NOTIF-9', epic:'B', priority:'high',
    title:'Notices table with independent filters',
    story:'As an admin, I want to filter the notices table by date, class, section, status and response independently so that I can quickly find a specific notice without one filter resetting another.',
    ac:['Date, Class, Section, Status and Response filters can be combined freely','Search by title works alongside the filters','Table stays concise — no combined mega-filter'],
    dependsOn:[], status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-10', epic:'B', priority:'high',
    title:'Notice Details — full recipient breakdown',
    story:'As an admin, I want to open a notice and see exactly which classes/sections it targeted so that I can confirm who actually received it.',
    ac:['Lists every targeted class with its section scope (All sections vs specific)','Shows an estimated recipient count per class'],
    dependsOn:[], status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-11', epic:'B', priority:'medium',
    title:'Response tracking by grade',
    story:'As an admin, I want to see overall response % and a per-grade breakdown so that I know which groups still need a follow-up.',
    ac:['Overall responded vs. awaiting counts, shown as a ring/percentage','Per-grade progress bars with % responded','Only shown when the notice has "Response required" set to Yes'],
    dependsOn:[], status:'backlog', assignee:'Ronal' },

  /* ---------------- 3. Receive & Respond (Parent/Student) ---------------- */
  { id:'NOTIF-12', epic:'C', priority:'high',
    title:'Push notification for a new notice',
    story:'As a parent/student, I want a push notification when a new notice is posted so that I don\'t have to open the app to find out.',
    ac:['Notification shows the notice title and whether a response is needed','Tapping it opens the notice directly'],
    dependsOn:[], status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-13', epic:'C', priority:'high',
    title:'Action-needed notices surfaced first in the feed',
    story:'As a parent/student, I want notices that require a response to appear above everything else in my feed so that I don\'t miss something I need to act on.',
    ac:['Feed groups "Action needed" separately from "Earlier"','Action-needed count is visible at a glance'],
    dependsOn:[], status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-14', epic:'C', priority:'high',
    title:'Respond to a notice in one tap',
    story:'As a parent/student, I want to give or withhold consent directly from the notice so that I can respond without extra steps.',
    ac:['Response actions are docked at the bottom of the notice detail screen','At least two response options are available (e.g. "Give consent" / "Can\'t attend")'],
    dependsOn:[], status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-15', epic:'C', priority:'medium',
    title:'Clear confirmation after responding',
    story:'As a parent/student, I want a clear confirmation once I\'ve responded so that I know it was recorded and can change it if needed.',
    ac:['Notice detail shows a "Consent given" (or equivalent) state with a timestamp','A "Change response" action remains available'],
    dependsOn:[], status:'backlog', assignee:'Sudhanshu' },

  /* ---------------- 4. Notice Module — Branding & Overview ---------------- */
  { id:'NOTIF-16', epic:'D', priority:'medium',
    title:'School branding on the Overview/Home screen',
    story:'As an admin, I want the Overview screen to lead with our school\'s branding, with Notices as one section beneath it, so that the product feels like it belongs to our school and can hold future sections like Attendance.',
    ac:['Heading shows school logo + name instead of a generic "Notices" title','"Notices" is a clearly labeled section, not the entire page','No redundant entry cards or a duplicate "Recent notices" list on this screen'],
    dependsOn:[], status:'backlog', assignee:'Mohit' },

  /* ---------------- 5. Future (R2 backlog) ---------------- */
  { id:'NOTIF-17', epic:'R2', priority:'low',
    title:'Edit or archive a notice after publishing',
    story:'As an admin, I want to edit or archive a notice after it has been published so that I can correct mistakes without creating a duplicate.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    dependsOn:[], status:'backlog', assignee:'Ronal' },
  { id:'NOTIF-18', epic:'R2', priority:'low',
    title:'Read/unread tracking per recipient',
    story:'As an admin, I want to see who has opened a notice (not just who responded) so that I can measure reach as well as response.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    dependsOn:[], status:'backlog', assignee:'Sudhanshu' },
  { id:'NOTIF-19', epic:'R2', priority:'low',
    title:'Rich text & attachments in the composer',
    story:'As an admin, I want to format text and attach files/images to a notice so that I can share richer content than plain text.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    dependsOn:[], status:'backlog', assignee:'Mohit' },
  { id:'NOTIF-20', epic:'R2', priority:'low',
    title:'Recurring notices & templates',
    story:'As an admin, I want to save a notice as a reusable template or set it to repeat on a schedule so that I don\'t have to recreate routine notices.',
    ac:['Explicitly out of scope for R1 — logged here for R2 planning'],
    dependsOn:[], status:'backlog', assignee:'Ronal' },
];

/* v3: Setup split into Backend/Web/App parallel tracks, MVP trim
   (cut design-system-port, API-skeleton, error-tracking, local-dev-env
   tickets; merged registration+school-creation into one internal-
   controller ticket; deferred CSV import, invite flow, channel config,
   password reset). Bumped so old overrides (old IDs, old statuses)
   don't resurrect over the new seed. */
const STORE_KEY = 'morwix-notif-r1-board-v3';

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
const readyEl = document.getElementById('filter-ready');

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
readyEl.addEventListener('change', render);

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

/* A ticket is "ready to start" if it has no unfinished dependency
   (or no dependencies at all) — i.e. it can be worked in parallel
   with any other ready ticket right now. */
function isReady(t){
  if (!t.dependsOn || t.dependsOn.length === 0) return true;
  return t.dependsOn.every(depId => {
    const dep = tickets.find(x => x.id === depId);
    return dep && dep.status === 'done';
  });
}

function filtered(){
  const q = searchEl.value.trim().toLowerCase();
  const epic = epicEl.value, assignee = assigneeEl.value, priority = priorityEl.value;
  const readyOnly = readyEl.checked;
  return tickets.filter(t => {
    if (q && !(t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))) return false;
    if (epic && t.epic !== epic) return false;
    if (assignee && t.assignee !== assignee) return false;
    if (priority && t.priority !== priority) return false;
    if (readyOnly && !isReady(t)) return false;
    return true;
  });
}

function cardHTML(t){
  const acItems = t.ac.map(a => `<li>${a}</li>`).join('');
  const assigneeOptions = ASSIGNEES.map(n => `<option ${n===t.assignee?'selected':''}>${n}</option>`).join('');
  const statusOptions = STATUSES.map(s => `<option value="${s.key}" ${s.key===t.status?'selected':''}>${s.label}</option>`).join('');
  const tagBadge = t.tag ? `<span class="card-tag">${t.tag}</span>` : '';
  const deps = (t.dependsOn && t.dependsOn.length)
    ? `<div class="deps">⧗ Depends on: ${t.dependsOn.join(', ')}</div>`
    : `<div class="deps deps--ready">✓ No blockers — can start now</div>`;
  return `
    <div class="card" data-id="${t.id}">
      <div class="card-top">
        <span class="card-id">${t.id}</span>
        <span class="pr pr--${t.priority}">${t.priority}</span>
        ${tagBadge}
        <span class="card-epic">${EPICS[t.epic]}</span>
      </div>
      <div class="card-title">${t.title}</div>
      <div class="card-story">${t.story}</div>
      ${deps}
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

  const readyCount = list.filter(isReady).length;
  countsEl.innerHTML = `<span><b>${list.length}</b> of ${tickets.length} tickets</span><span><b>${readyCount}</b> ready to start now</span>`;
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
