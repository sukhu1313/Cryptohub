const initialProjects = [
  { id: 1, name: 'Northstar Dental', client: 'Aarav Mehta', type: 'Marketing website', status: 'In progress', initials: 'AM', color: 'purple', updated: '18 min ago', brief: 'A conversion-focused site with appointment booking and a calm, trustworthy feel.' },
  { id: 2, name: 'Meadow & Pine', client: 'Priya Shah', type: 'Online store', status: 'Needs review', initials: 'PS', color: 'orange', updated: '2 hours ago', brief: 'A considered storefront for small-batch home goods, with inventory and payments.' },
  { id: 3, name: 'Luma Finance', client: 'Rohan Kapoor', type: 'Client portal', status: 'Live', initials: 'RK', color: 'pink', updated: 'Yesterday', brief: 'A secure client portal that makes monthly financial reporting feel effortless.' }
];
const initialConnections = [
  { id: 1, name: 'Northstar production', project: 'Northstar Dental', type: 'PostgreSQL', environment: 'Production', status: 'Connected' },
  { id: 2, name: 'Meadow catalog', project: 'Meadow & Pine', type: 'Supabase', environment: 'Production', status: 'Connected' },
  { id: 3, name: 'Luma portal staging', project: 'Luma Finance', type: 'MongoDB', environment: 'Staging', status: 'Connected' },
  { id: 4, name: 'Luma production', project: 'Luma Finance', type: 'PostgreSQL', environment: 'Production', status: 'Connected' }
];
const initialActivity = [
  { icon: '✓', title: 'Anand approved a deployment', detail: 'Luma Finance · production', time: '18 minutes ago' },
  { icon: '◌', title: 'Priya requested changes', detail: 'Meadow & Pine · homepage review', time: '2 hours ago' },
  { icon: '⌘', title: 'New database connected', detail: 'Northstar production · PostgreSQL', time: 'Yesterday at 4:32 PM' },
  { icon: '▣', title: 'Project brief was updated', detail: 'Northstar Dental · by Anand', time: 'Yesterday at 11:08 AM' }
];
let projects = JSON.parse(localStorage.getItem('cortexweb_projects') || 'null') || initialProjects;
let connections = JSON.parse(localStorage.getItem('cortexweb_connections') || 'null') || initialConnections;
let activity = JSON.parse(localStorage.getItem('cortexweb_activity') || 'null') || initialActivity;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
function save() { localStorage.setItem('cortexweb_projects', JSON.stringify(projects)); localStorage.setItem('cortexweb_connections', JSON.stringify(connections)); localStorage.setItem('cortexweb_activity', JSON.stringify(activity)); }
function showToast(message) { $('#toastMessage').textContent = message; $('#toast').classList.add('show'); setTimeout(() => $('#toast').classList.remove('show'), 2600); }
function statusClass(status) { return status === 'Live' ? 'live' : status === 'Needs review' ? 'review' : 'in-progress'; }
function renderProjects() {
  $('#projectCount').textContent = projects.length; $('#activeMetric').textContent = projects.filter((p) => p.status !== 'Live').length; $('#allProjectCount').textContent = projects.length;
  $('#projectRows').innerHTML = projects.slice(0, 3).map((p) => `<tr><td>${p.name}</td><td><span class="project-client"><span class="mini-avatar ${p.color}">${p.initials}</span>${p.client}</span></td><td><span class="status-pill ${statusClass(p.status)}">${p.status}</span></td><td>${p.updated}</td><td>•••</td></tr>`).join('');
  const query = ($('#projectSearch')?.value || '').toLowerCase();
  $('#projectCards').innerHTML = projects.filter((p) => `${p.name} ${p.client}`.toLowerCase().includes(query)).map((p) => `<article class="project-card"><div class="project-card-top"><span class="mini-avatar ${p.color}">${p.initials}</span><span class="status-pill ${statusClass(p.status)}">${p.status}</span></div><h3>${p.name}</h3><span class="client">${p.client} · ${p.type}</span><p class="card-brief">${p.brief}</p><div class="project-card-footer"><span>Updated ${p.updated}</span><button class="open-builder" data-project-id="${p.id}">Open builder →</button></div></article>`).join('');
  $$('.open-builder').forEach((button) => button.addEventListener('click', () => openBuilder(Number(button.dataset.projectId))));
}
function activityMarkup(items) { return items.map((a) => `<div class="activity-item"><span class="activity-dot">${a.icon}</span><div><strong>${a.title}</strong><p>${a.detail}</p><time>${a.time}</time></div></div>`).join(''); }
function renderActivity() { $('#activityFeed').innerHTML = activityMarkup(activity.slice(0, 4)); $('#fullActivityFeed').innerHTML = activityMarkup(activity); }
function renderConnections() {
  $('#connectionMetric').textContent = connections.length; $('#connectionSummary').textContent = `${connections.length} connections across ${new Set(connections.map((c) => c.project)).size} projects.`;
  const query = ($('#connectionSearch')?.value || '').toLowerCase();
  $('#connectionList').innerHTML = connections.filter((c) => `${c.name} ${c.project} ${c.type}`.toLowerCase().includes(query)).map((c) => `<div class="connection-row"><div class="connection-name"><span class="db-icon">⌘</span><span><strong>${c.name}</strong><small>${c.project}</small></span></div><span>${c.type}</span><span class="env">● ${c.environment}</span><span>Updated today</span><button class="icon-button more" title="More options">•••</button></div>`).join('');
}
function renderAll() { renderProjects(); renderActivity(); renderConnections(); }
function openModal(id) { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); }
function navigate(view) { if (document.body.classList.contains('user-mode') && !['builder', 'profile'].includes(view)) return; $$('.page-view').forEach((section) => section.classList.remove('active-view')); $(`#${view}View`).classList.add('active-view'); $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view)); $('#breadcrumbCurrent').textContent = view.charAt(0).toUpperCase() + view.slice(1); $('#sidebar').classList.remove('open'); }
$$('.nav-item, [data-view="projects"]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.view || 'projects')));
$('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$('#topNewProject').addEventListener('click', () => openModal('#projectModal')); $('#newProjectButton').addEventListener('click', () => openModal('#projectModal')); $('#newConnectionButton').addEventListener('click', () => { $('#connectionProject').innerHTML = projects.map((p) => `<option>${p.name}</option>`).join(''); openModal('#connectionModal'); });
$$('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(`#${button.dataset.close}`)));
$$('.modal-backdrop').forEach((backdrop) => backdrop.addEventListener('click', (event) => { if (event.target === backdrop) backdrop.classList.remove('open'); }));
$('#projectForm').addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); const initials = data.client.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(); projects.unshift({ id: Date.now(), name: data.name, client: data.client, type: data.type, status: 'In progress', initials, color: 'purple', updated: 'Just now', brief: data.brief }); activity.unshift({ icon: '▣', title: 'New project created', detail: `${data.name} · by Anand`, time: 'Just now' }); save(); renderAll(); closeModal('#projectModal'); event.target.reset(); navigate('projects'); showToast('Project created successfully.'); });
$('#connectionForm').addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); connections.unshift({ id: Date.now(), name: data.name, project: data.project, type: data.type, environment: data.environment, status: 'Connected' }); activity.unshift({ icon: '⌘', title: 'New database connected', detail: `${data.name} · ${data.type}`, time: 'Just now' }); save(); renderAll(); closeModal('#connectionModal'); event.target.reset(); navigate('connections'); showToast('Database connection added.'); });
$('#projectSearch').addEventListener('input', renderProjects); $('#connectionSearch').addEventListener('input', renderConnections); $('#clientToast').addEventListener('click', () => showToast('Client directory is ready for the next step.'));
renderAll();
document.querySelector('.quote-panel small').textContent = 'CortexWeb field notes · 04';

const blockDefinitions = [
  { type: 'nav', icon: '≡', label: 'Navbar', order: 10, heading: 'Your brand, made clear.', description: 'A simple, focused way to help visitors find their way.', button: 'Explore' },
  { type: 'hero', icon: '✦', label: 'Hero section', order: 20, heading: 'Make a memorable first impression.', description: 'Tell people what you do and why it matters in one clear sentence.', button: 'Get started' },
  { type: 'text', icon: 'T', label: 'Text section', order: 30, heading: 'Share your story.', description: 'Explain what makes your business different with clear, flexible content.', button: '' },
  { type: 'image', icon: '▧', label: 'Image & video', order: 40, heading: 'Show, don’t just tell.', description: 'Add a visual moment that makes your page feel unmistakably yours.', button: 'View gallery' },
  { type: 'feature', icon: '▦', label: 'Feature cards', order: 50, heading: 'Everything your audience needs.', description: 'Showcase the important details with a flexible set of feature cards.', button: 'Learn more' },
  { type: 'button', icon: '↗', label: 'Call-to-action', order: 60, heading: 'Ready when you are.', description: 'Guide visitors toward the next step with a clear action.', button: 'Get started' },
  { type: 'pricing', icon: '₹', label: 'Pricing table', order: 70, heading: 'Simple plans that scale.', description: 'Make it easy for people to understand your offer and choose a plan.', button: 'Choose plan' },
  { type: 'testimonial', icon: '“', label: 'Testimonials', order: 80, heading: 'Loved by people like you.', description: '“CortexWeb helped us launch with confidence.” — A happy customer', button: '' },
  { type: 'faq', icon: '?', label: 'FAQ section', order: 90, heading: 'Frequently asked questions.', description: 'Answer the questions your visitors are already thinking about.', button: 'See all answers' },
  { type: 'form', icon: '▤', label: 'Contact form', order: 100, heading: 'Let’s make something useful.', description: 'Give visitors a simple way to reach you.', button: 'Send message' },
  { type: 'register', icon: '□', label: 'Register form', order: 110, heading: 'Create your account.', description: 'A clear signup experience for members, customers, or communities.', button: 'Create account' },
  { type: 'login', icon: '→', label: 'Login form', order: 120, heading: 'Welcome back.', description: 'Let returning users securely access their account.', button: 'Log in' },
  { type: 'gallery', icon: '▤', label: 'Gallery grid', order: 130, heading: 'A closer look.', description: 'Arrange images, work, or products in a responsive visual grid.', button: 'View more' },
  { type: 'footer', icon: '⌄', label: 'Footer', order: 999, heading: 'Built with intention.', description: '© 2026 Your brand. All rights reserved.', button: '' }
];
const themeDefinitions = [
  { id: 'studio', name: 'Studio editorial', note: 'Portfolio & agency · 4 pages', swatch: '#172320', pages: [['Home', ['nav', 'hero', 'feature', 'testimonial', 'footer']], ['About', ['nav', 'text', 'image', 'footer']], ['Services', ['nav', 'feature', 'pricing', 'faq', 'footer']], ['Contact', ['nav', 'form', 'footer']]] },
  { id: 'commerce', name: 'Commerce bright', note: 'Store & products · 4 pages', swatch: '#d8f36b', pages: [['Home', ['nav', 'hero', 'feature', 'footer']], ['Shop', ['nav', 'gallery', 'pricing', 'footer']], ['Product', ['nav', 'image', 'text', 'button', 'footer']], ['Account', ['nav', 'login', 'register', 'footer']]] },
  { id: 'saas', name: 'SaaS launch', note: 'Product & startup · 3 pages', swatch: '#dfeaff', pages: [['Home', ['nav', 'hero', 'feature', 'testimonial', 'footer']], ['Pricing', ['nav', 'pricing', 'faq', 'button', 'footer']], ['Login', ['nav', 'login', 'register', 'footer']]] },
  { id: 'community', name: 'Community warm', note: 'Membership & events · 4 pages', swatch: '#ffdcd3', pages: [['Home', ['nav', 'hero', 'text', 'footer']], ['Events', ['nav', 'gallery', 'feature', 'footer']], ['Members', ['nav', 'register', 'login', 'testimonial', 'footer']], ['Contact', ['nav', 'form', 'faq', 'footer']]] },
  { id: 'restaurant', name: 'Restaurant & cafe', note: 'Food, menus & bookings · 3 pages', swatch: '#f6d6a8', pages: [['Home', ['nav', 'hero', 'feature', 'button', 'footer']], ['Menu', ['nav', 'gallery', 'pricing', 'footer']], ['Contact', ['nav', 'form', 'faq', 'footer']]] },
  { id: 'creator', name: 'Creator portfolio', note: 'Personal brand & work · 3 pages', swatch: '#d9e7ff', pages: [['Home', ['nav', 'hero', 'gallery', 'footer']], ['Work', ['nav', 'image', 'feature', 'footer']], ['Contact', ['nav', 'testimonial', 'form', 'footer']]] },
  { id: 'course', name: 'Course launch', note: 'Education & cohorts · 4 pages', swatch: '#e5dcff', pages: [['Home', ['nav', 'hero', 'feature', 'testimonial', 'footer']], ['Curriculum', ['nav', 'text', 'faq', 'button', 'footer']], ['Pricing', ['nav', 'pricing', 'faq', 'footer']], ['Enroll', ['nav', 'register', 'form', 'footer']]] },
  { id: 'real-estate', name: 'Real estate', note: 'Property listings & agents · 4 pages', swatch: '#dcefe8', pages: [['Home', ['nav', 'hero', 'feature', 'button', 'footer']], ['Properties', ['nav', 'gallery', 'pricing', 'form', 'footer']], ['About', ['nav', 'text', 'testimonial', 'footer']], ['Contact', ['nav', 'form', 'faq', 'footer']]] },
  { id: 'fitness', name: 'Fitness studio', note: 'Classes, coaching & wellness · 3 pages', swatch: '#ffe0c7', pages: [['Home', ['nav', 'hero', 'feature', 'testimonial', 'footer']], ['Classes', ['nav', 'pricing', 'faq', 'footer']], ['Join us', ['nav', 'register', 'form', 'footer']]] },
  { id: 'events', name: 'Events & conference', note: 'Conferences, launches & tickets · 4 pages', swatch: '#dce2ff', pages: [['Home', ['nav', 'hero', 'button', 'footer']], ['Schedule', ['nav', 'feature', 'faq', 'footer']], ['Speakers', ['nav', 'gallery', 'testimonial', 'footer']], ['Register', ['nav', 'register', 'form', 'footer']]] }
];
const savedTemplates = JSON.parse(localStorage.getItem('cortexweb_custom_templates') || '[]');
themeDefinitions.push(...savedTemplates.filter((template) => template.id && template.name && Array.isArray(template.pages)));
const themeProfiles = {
  studio: { title: 'Atelier Studio', description: 'Independent design and digital direction for brands with something to say.', accent: '#d8f36b', hero: 'Design with a point of view.', heroDescription: 'A thoughtful creative partner for identities, websites, and digital experiences.' },
  commerce: { title: 'Good Things Market', description: 'Small-batch objects, considered materials, and everyday pieces worth keeping.', accent: '#d8f36b', hero: 'Objects for a life well lived.', heroDescription: 'Discover useful, beautiful goods made slowly and chosen carefully.' },
  saas: { title: 'Northstar', description: 'A calmer command center for teams building what comes next.', accent: '#a9c4ff', hero: 'Move your best work forward.', heroDescription: 'Plan clearly, collaborate quickly, and turn ambitious ideas into momentum.' },
  community: { title: 'Common Ground', description: 'A warm place for curious people to meet, learn, and make things together.', accent: '#ffad96', hero: 'There is room for everyone here.', heroDescription: 'Find your people, join the conversation, and make your next connection count.' },
  restaurant: { title: 'Juniper Table', description: 'Seasonal plates, open-fire cooking, and a table waiting for you.', accent: '#e6a355', hero: 'Come hungry. Leave happy.', heroDescription: 'A neighborhood kitchen serving generous food and good reasons to linger.' },
  creator: { title: 'Mira Rao', description: 'Writer, image-maker, and creative partner for meaningful ideas.', accent: '#8db5e8', hero: 'Stories that stay with you.', heroDescription: 'Selected work, honest notes, and a closer look at the process behind the work.' },
  course: { title: 'The Practice Room', description: 'Practical learning for people ready to make their next move.', accent: '#ad91e8', hero: 'Learn it. Use it. Make it yours.', heroDescription: 'A focused curriculum and a generous community to help you build with confidence.' },
  'real-estate': { title: 'Field & Form', description: 'Homes with character, guided by people who know the neighborhood.', accent: '#7cba9f', hero: 'Find a place to become.', heroDescription: 'Thoughtfully represented homes and a more personal way to move.' },
  fitness: { title: 'Form House', description: 'Strength, mobility, and steady progress in a studio built around you.', accent: '#ed9a67', hero: 'Feel stronger in your own body.', heroDescription: 'Small-group training and expert coaching for sustainable energy every day.' },
  events: { title: 'Signal / 26', description: 'Ideas, people, and the conversations shaping the next chapter.', accent: '#91a5ed', hero: 'The future is a conversation.', heroDescription: 'One focused day of talks, workshops, and useful collisions of perspective.' }
};
const completePageSets = {
  studio: [['Home', ['nav', 'hero', 'feature', 'footer']], ['Work', ['nav', 'gallery', 'image', 'footer']], ['Services', ['nav', 'feature', 'pricing', 'footer']], ['Journal', ['nav', 'text', 'testimonial', 'footer']], ['Contact', ['nav', 'form', 'faq', 'footer']]],
  commerce: [['Home', ['nav', 'hero', 'feature', 'footer']], ['Shop', ['nav', 'gallery', 'pricing', 'footer']], ['Collections', ['nav', 'image', 'feature', 'footer']], ['About', ['nav', 'text', 'testimonial', 'footer']], ['Contact', ['nav', 'form', 'faq', 'footer']]],
  saas: [['Home', ['nav', 'hero', 'feature', 'footer']], ['Product', ['nav', 'feature', 'image', 'footer']], ['Solutions', ['nav', 'feature', 'testimonial', 'footer']], ['Resources', ['nav', 'text', 'faq', 'footer']], ['Sign in', ['nav', 'login', 'register', 'footer']]],
  community: [['Home', ['nav', 'hero', 'text', 'footer']], ['Events', ['nav', 'gallery', 'feature', 'footer']], ['Members', ['nav', 'register', 'testimonial', 'footer']], ['Resources', ['nav', 'text', 'faq', 'footer']], ['Contact', ['nav', 'form', 'footer']]],
  restaurant: [['Home', ['nav', 'hero', 'feature', 'footer']], ['Menu', ['nav', 'gallery', 'pricing', 'footer']], ['Specials', ['nav', 'image', 'feature', 'footer']], ['Our story', ['nav', 'text', 'testimonial', 'footer']], ['Contact', ['nav', 'form', 'faq', 'footer']]],
  creator: [['Home', ['nav', 'hero', 'gallery', 'footer']], ['Portfolio', ['nav', 'gallery', 'image', 'footer']], ['About', ['nav', 'text', 'testimonial', 'footer']], ['Process', ['nav', 'feature', 'faq', 'footer']], ['Contact', ['nav', 'form', 'footer']]],
  course: [['Home', ['nav', 'hero', 'feature', 'footer']], ['Curriculum', ['nav', 'text', 'faq', 'footer']], ['Resources', ['nav', 'gallery', 'feature', 'footer']], ['Pricing', ['nav', 'pricing', 'testimonial', 'footer']], ['Enroll', ['nav', 'register', 'form', 'footer']]],
  'real-estate': [['Home', ['nav', 'hero', 'feature', 'footer']], ['Properties', ['nav', 'gallery', 'pricing', 'footer']], ['Neighborhoods', ['nav', 'image', 'text', 'footer']], ['Buying guide', ['nav', 'text', 'faq', 'footer']], ['Contact', ['nav', 'form', 'footer']]],
  fitness: [['Home', ['nav', 'hero', 'feature', 'footer']], ['Classes', ['nav', 'pricing', 'faq', 'footer']], ['Training', ['nav', 'image', 'feature', 'footer']], ['About', ['nav', 'text', 'testimonial', 'footer']], ['Join us', ['nav', 'register', 'form', 'footer']]],
  events: [['Home', ['nav', 'hero', 'button', 'footer']], ['Schedule', ['nav', 'feature', 'faq', 'footer']], ['Speakers', ['nav', 'gallery', 'testimonial', 'footer']], ['Resources', ['nav', 'text', 'image', 'footer']], ['Register', ['nav', 'register', 'form', 'footer']]]
};
Object.entries(completePageSets).forEach(([id, pages]) => { const theme = themeDefinitions.find((item) => item.id === id); if (theme) { theme.pages = pages; theme.note = theme.note.replace(/\d+ pages/, '5 pages'); } });
let activeProject = null;
let selectedSection = null;
let activePageIndex = 0;
function openBuilder(projectId) {
  activeProject = projects.find((project) => project.id === projectId) || projects[0];
  if (!activeProject) { showToast('Create a project before opening the builder.'); return; }
  addProfilePage();
  addExportControls();
  addSiteSettings();
  $('#builderTitle').textContent = activeProject.name;
  $('#builderProjectLabel').textContent = activeProject.name;
  $('#builderTypeLabel').textContent = activeProject.type;
  function addSiteSettings() {
    if ($('#siteSettings')) return;
    $('.builder-heading').insertAdjacentHTML('afterend', '<form id="siteSettings" class="site-settings"><strong>Site settings</strong><label>Site title<input id="siteTitle" maxlength="60" /></label><label>Site description<input id="siteDescription" maxlength="140" /></label><label>Brand color<input id="siteAccent" type="color" value="#d8f36b" /></label><button class="outline-button" type="submit">Save site settings</button></form>');
    $('#siteSettings').addEventListener('submit', (event) => { event.preventDefault(); activeProject.siteSettings = { title: $('#siteTitle').value.trim() || activeProject.name, description: $('#siteDescription').value.trim(), accent: $('#siteAccent').value }; save(); renderHostedPage(activePageIndex); showToast('Site settings saved.'); });
  }
  function renderSiteSettings() {
    const settings = activeProject?.siteSettings || {};
    if (!$('#siteSettings')) return;
    $('#siteTitle').value = settings.title || activeProject.name;
    $('#siteDescription').value = settings.description || activeProject.brief || '';
    $('#siteAccent').value = settings.accent || '#d8f36b';
  }
  $('#canvasSlug').textContent = activeProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'your-site';
  if (!$('#toggleLibrary')) { $('.builder-actions').insertAdjacentHTML('afterbegin', '<button class="outline-button" id="toggleLibrary">☷ Sections</button>'); $('#toggleLibrary').addEventListener('click', () => { $('.builder-layout').classList.toggle('library-collapsed'); $('#toggleLibrary').textContent = $('.builder-layout').classList.contains('library-collapsed') ? '☷ Show sections' : '☷ Sections'; }); }
  const saveState = $('.builder-actions .save-state'); if (saveState) $('.builder-actions').insertBefore(saveState, $('.builder-actions').firstElementChild);
  if (!$('#publishedLinkBar')) { $('.builder-heading').insertAdjacentHTML('afterend', '<div class="published-link-bar" id="publishedLinkBar"><span>● Published URL</span><a id="editorPublishedUrl" target="_blank" rel="noopener"></a><button class="outline-button" id="editorCopyLink">Copy link</button></div>'); $('#editorCopyLink').addEventListener('click', () => copyPublishedLink()); }
  if (activeProject.publishedUrl) { $('#publishedLinkBar').classList.add('visible'); $('#editorPublishedUrl').textContent = activeProject.publishedUrl; $('#editorPublishedUrl').href = activeProject.publishedUrl; }
  navigate('builder');
  renderBuilderBlocks();
    renderSiteSettings();
  renderPageTabs();
  renderCanvas();
}
function setupTemplateModal() {
  if ($('#templateModal')) return;
  $('.main-content').insertAdjacentHTML('beforeend', '<div class="template-modal" id="templateModal"><div class="template-window"><div class="template-window-head"><div><p class="eyebrow">CortexWeb library</p><h2>Inbuilt templates</h2><p>Choose a complete website, then edit every page and section.</p></div><button class="modal-close" id="closeTemplates">×</button></div><div class="template-tools" id="templateTools"><input id="templateSearch" placeholder="Search templates" /><div><input id="templateApiUrl" placeholder="Template API URL" /><button class="outline-button" id="addApiTemplate" type="button">＋ Add from API</button></div><small>Use a JSON template URL or upload a template file.</small></div><div class="template-gallery" id="templateGallery"></div></div></div>');
  $('#closeTemplates').addEventListener('click', () => $('#templateModal').classList.remove('open'));
  $('#templateSearch').addEventListener('input', renderBuilderBlocks);
}
function renderBuilderBlocks() {
  setupTemplateModal();
  if ($('#themeLibrary')) { $('#themeLibrary').style.display = 'none'; $('#themeLibrary').previousElementSibling.style.display = 'none'; }
  $('#addApiTemplate').onclick = addTemplateFromApi;
  const query = ($('#templateSearch').value || '').toLowerCase();
  $('#templateGallery').innerHTML = themeDefinitions.filter((theme) => `${theme.name} ${theme.note}`.toLowerCase().includes(query)).map((theme) => `<button class="theme-card ${activeProject.builderTheme === theme.id ? 'selected' : ''}" data-theme-id="${theme.id}"><span class="template-preview" style="--template-color:${theme.swatch}"><i></i><i></i><i></i><strong>${(themeProfiles[theme.id]?.title || theme.name).split(' ')[0]}</strong></span><span><strong>${theme.name}</strong><small>${themeProfiles[theme.id]?.description || theme.note}</small></span><b>Use</b></button>`).join('') || '<p class="template-empty">No templates found.</p>';
  $$('#templateGallery .theme-card').forEach((card) => card.addEventListener('click', () => { applyTheme(card.dataset.themeId); $('#templateModal').classList.remove('open'); }));
  $('#blockLibrary').innerHTML = blockDefinitions.map((block) => `<div class="library-block" draggable="true" data-block-type="${block.type}"><span class="block-icon">${block.icon}</span>${block.label}<span class="drag-grip">⠿</span></div>`).join('');
  $$('.library-block').forEach((block) => {
    block.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', block.dataset.blockType));
    block.addEventListener('click', () => addSection(block.dataset.blockType));
  });
}
function addTemplateFromApi() {
  const url = $('#templateApiUrl').value.trim();
  if (!url) { showToast('Paste a template API URL first.'); return; }
  fetch(url).then((response) => { if (!response.ok) throw new Error('Request failed'); return response.json(); }).then((data) => {
    const incoming = Array.isArray(data) ? data : data.templates || [data];
    const valid = incoming.filter((template) => template.name && Array.isArray(template.pages) && template.pages.every((page) => Array.isArray(page) && page.length === 2 && Array.isArray(page[1]) && page[1].every((type) => blockDefinitions.some((block) => block.type === type)))).map((template, index) => ({ id: `api-${Date.now()}-${index}`, name: template.name, note: template.note || 'Custom template · API', swatch: template.swatch || '#dfeaff', pages: template.pages }));
    if (!valid.length) throw new Error('Invalid template format');
    themeDefinitions.push(...valid); localStorage.setItem('cortexweb_custom_templates', JSON.stringify([...savedTemplates, ...valid])); renderBuilderBlocks(); showToast(`${valid.length} template${valid.length === 1 ? '' : 's'} added.`);
  }).catch(() => showToast('Could not load templates. Check the URL and CORS settings.'));
}
function applyTheme(themeId) {
  const theme = themeDefinitions.find((item) => item.id === themeId);
  if (!theme || !activeProject) return;
  const profile = themeProfiles[themeId] || { title: theme.name, description: theme.note, accent: theme.swatch, hero: 'Make something people remember.', heroDescription: 'A flexible starting point for your next website.' };
  const byType = (type) => blockDefinitions.find((block) => block.type === type);
  activeProject.builderTheme = themeId;
  activeProject.siteSettings = { title: profile.title, description: profile.description, accent: profile.accent };
  activeProject.builderPages = theme.pages.map(([name, types]) => ({ name, sections: types.map((type) => { const definition = byType(type); const isHero = type === 'hero'; return { type, order: definition.order, content: { heading: isHero ? profile.hero : definition.heading, description: isHero ? profile.heroDescription : definition.description, button: definition.button, navLinks: type === 'nav' ? ['Home', 'Products', 'Services', 'About', 'Contact'] : undefined, background: isHero ? `${profile.accent}33` : '#ffffff', textColor: '#172320', buttonColor: '#172320' } }; }) }));
  activeProject.builderSections = activeProject.builderPages[0].sections; activePageIndex = 0; selectedSection = null; $('#inspectorForm').classList.remove('visible'); $('#inspectorEmpty').style.display = 'block'; renderPageTabs(); renderCanvas(); showToast(`${theme.name} template applied with ${theme.pages.length} pages.`);
}
function ensurePages() { if (!activeProject.builderPages) activeProject.builderPages = [{ name: 'Home', sections: activeProject.builderSections || [] }]; activeProject.builderSections = activeProject.builderPages[activePageIndex].sections; }
function renderPageTabs() { ensurePages(); let tabs = $('#pageTabs'); if (!tabs) { $('.canvas-toolbar').insertAdjacentHTML('beforebegin', '<div id="pageTabs" class="page-tabs"></div>'); tabs = $('#pageTabs'); } tabs.innerHTML = `${activeProject.builderPages.map((page, index) => `<button class="page-tab ${index === activePageIndex ? 'active' : ''}" data-page-index="${index}" title="Double-click to rename">${page.name} <span class="rename-hint">✎</span></button>`).join('')}<button class="page-tab add-page" id="addPage">＋ Add page</button>`; $$('.page-tab[data-page-index]').forEach((tab) => { tab.addEventListener('click', () => { activePageIndex = Number(tab.dataset.pageIndex); ensurePages(); selectedSection = null; renderPageTabs(); renderCanvas(); }); tab.addEventListener('dblclick', (event) => { event.preventDefault(); renamePage(Number(tab.dataset.pageIndex)); }); }); $('#addPage').addEventListener('click', () => { const pageName = `Page ${activeProject.builderPages.length + 1}`; activeProject.builderPages.push({ name: pageName, sections: [] }); activePageIndex = activeProject.builderPages.length - 1; ensurePages(); renderPageTabs(); renderCanvas(); showToast(`${pageName} added.`); }); }
function renamePage(index) { const currentName = activeProject.builderPages[index].name; const nextName = window.prompt('Enter a name for this page', currentName); if (!nextName || !nextName.trim()) return; activeProject.builderPages[index].name = nextName.trim().slice(0, 32); save(); renderPageTabs(); showToast('Page name updated.'); }
function sectionMarkup(section, index) {
  const definition = blockDefinitions.find((block) => block.type === section.type) || blockDefinitions[1];
  const content = section.content || definition;
  const style = `background-color:${content.background || ''};color:${content.textColor || ''};${content.backgroundImage ? `background-image:linear-gradient(90deg,rgba(255,255,255,.9),rgba(255,255,255,.55)),url(${content.backgroundImage});background-size:cover;background-position:center;` : ''}`;
  const navLinks = section.type === 'nav' ? `<nav class="section-nav-links">${(content.navLinks || ['Home', 'Products', 'Services', 'About', 'Contact']).map((link) => `<a href="#${link.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" data-nav-link>${link}</a>`).join('')}</nav>` : '';
  const button = content.button ? `<a class="canvas-button" style="background-color:${content.buttonColor || ''}" href="${content.link || '#'}" ${content.link ? 'target="_blank" rel="noopener"' : ''}>${content.button} →</a>` : '';
  const features = section.type === 'feature' ? '<div class="section-feature"><div class="feature-box"><strong>Simple setup</strong><p>Everything in one place.</p></div><div class="feature-box"><strong>Made for you</strong><p>Flexible and easy to edit.</p></div><div class="feature-box"><strong>Ready to grow</strong><p>Built for what is next.</p></div></div>' : '';
  const formTypes = ['form', 'register', 'login'];
  const form = formTypes.includes(section.type) ? `<form class="ready-form"><input required type="email" placeholder="${section.type === 'login' ? 'Email address' : 'Your email address'}" />${section.type !== 'login' ? '<input required placeholder="Password" type="password" />' : '<input required placeholder="Password" type="password" />'}<button class="canvas-button" type="submit">${content.button || 'Submit'} →</button></form>` : '';
  const image = ['image', 'gallery'].includes(section.type) ? content.image ? `<img class="uploaded-section-image" src="${content.image}" alt="Section visual" />` : '<div class="visual-placeholder"><span>▧</span><small>Drop an image or video</small></div>' : content.image ? `<img class="uploaded-section-image" src="${content.image}" alt="Section visual" />` : '';
  const pricing = section.type === 'pricing' ? '<div class="price-cards"><div><small>Starter</small><strong>₹999</strong><span>per month</span></div><div><small>Growth</small><strong>₹2,499</strong><span>per month</span></div></div>' : '';
  const faq = section.type === 'faq' ? '<div class="faq-lines"><span>What does this include? <b>＋</b></span><span>Can I change my plan? <b>＋</b></span></div>' : '';
  return `<article class="canvas-section section-${section.type} ${selectedSection === index ? 'selected' : ''}" draggable="true" style="${style}" data-section-index="${index}"><div class="section-controls"><button class="move-section" type="button" data-move="top" title="Move to top">⇈</button><button class="move-section" type="button" data-move="up" title="Move up">↑</button><button class="move-section" type="button" data-move="down" title="Move down">↓</button><button class="move-section" type="button" data-move="bottom" title="Move to bottom">⇊</button><button class="remove-section" type="button" title="Remove section" aria-label="Remove ${definition.label}">×</button></div>${image}<h2>${content.heading}</h2><p>${content.description}</p>${navLinks}${features}${pricing}${faq}${form}${!formTypes.includes(section.type) && !['feature', 'pricing', 'faq', 'image', 'gallery', 'nav'].includes(section.type) ? button : ''}</article>`;
}
function importProjectFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const imported = data.format === 'cortexweb-template' ? data.project : data.projects?.[0];
      if (!imported || !imported.name || (!imported.builderPages && !imported.builderSections)) throw new Error('Invalid template');
      const project = JSON.parse(JSON.stringify(imported));
      project.id = Date.now(); project.name = `${project.name} (imported)`; project.status = 'In progress'; project.updated = 'Just now'; delete project.publishedUrl;
      projects.unshift(project); save(); renderAll(); openBuilder(project.id); showToast('Template imported into a new project.');
    } catch { showToast('That file is not a valid CortexWeb template.'); }
    event.target.value = '';
  };
  reader.readAsText(file);
}
function renderCanvas() {
  ensurePages();
  const sections = activeProject.builderSections || [];
  activeProject.builderSections = sections;
  $('#canvasEmpty').style.display = sections.length ? 'none' : 'flex';
  $('#builderCanvas').querySelectorAll('.canvas-section').forEach((node) => node.remove());
  sections.forEach((section, index) => $('#builderCanvas').insertAdjacentHTML('beforeend', sectionMarkup(section, index)));
  if (document.body.classList.contains('user-mode')) $$('#builderCanvas .section-controls').forEach((controls) => controls.insertAdjacentHTML('afterbegin', '<button class="duplicate-section" type="button" title="Duplicate section">＋</button>'));
  $$('#builderCanvas .canvas-section').forEach((section) => { section.addEventListener('click', (event) => { if (!event.target.closest('.section-controls')) selectSection(Number(section.dataset.sectionIndex)); }); section.addEventListener('dragstart', (event) => { event.dataTransfer.setData('application/x-cortex-section', section.dataset.sectionIndex); section.classList.add('dragging'); }); section.addEventListener('dragend', () => section.classList.remove('dragging')); section.querySelector('.remove-section').addEventListener('click', (event) => { event.stopPropagation(); removeSection(Number(section.dataset.sectionIndex)); }); section.querySelector('.duplicate-section')?.addEventListener('click', (event) => { event.stopPropagation(); duplicateSection(Number(section.dataset.sectionIndex)); }); section.querySelectorAll('.move-section').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); moveSection(Number(section.dataset.sectionIndex), button.dataset.move); })); });
  save();
}
function duplicateSection(index) { const copy = JSON.parse(JSON.stringify(activeProject.builderSections[index])); activeProject.builderSections.splice(index + 1, 0, copy); activeProject.builderPages[activePageIndex].sections = activeProject.builderSections; selectedSection = index + 1; renderCanvas(); selectSection(selectedSection); showToast('Section duplicated.'); }
function removeSection(index) { const removed = activeProject.builderSections.splice(index, 1)[0]; activeProject.builderPages[activePageIndex].sections = activeProject.builderSections; selectedSection = null; $('#inspectorForm').classList.remove('visible'); $('#inspectorEmpty').style.display = 'block'; renderCanvas(); showToast(`${blockDefinitions.find((block) => block.type === removed.type)?.label || 'Section'} removed.`); }
function moveSection(index, direction) { const sections = activeProject.builderSections; const destination = direction === 'top' ? 0 : direction === 'bottom' ? sections.length - 1 : direction === 'up' ? index - 1 : index + 1; if (destination < 0 || destination >= sections.length || destination === index) return; const [moved] = sections.splice(index, 1); sections.splice(destination, 0, moved); activeProject.builderPages[activePageIndex].sections = sections; selectedSection = destination; renderCanvas(); selectSection(destination); showToast('Section moved.'); }
function addSection(type) {
  ensurePages();
  const definition = blockDefinitions.find((block) => block.type === type);
  const newSection = { type, order: definition.order, content: { heading: definition.heading, description: definition.description, button: definition.button, navLinks: type === 'nav' ? ['Home', 'Products', 'Services', 'About', 'Contact'] : undefined } };
  activeProject.builderPages[activePageIndex].sections = [...activeProject.builderPages[activePageIndex].sections, newSection];
  activeProject.builderSections = activeProject.builderPages[activePageIndex].sections;
  renderCanvas(); selectedSection = activeProject.builderSections.indexOf(newSection); selectSection(selectedSection); showToast(`${definition.label} added to your page.`);
}
function selectSection(index) {
  selectedSection = index; const section = activeProject.builderSections[index]; const content = section.content;
  $('#inspectorEmpty').style.display = 'none'; $('#inspectorForm').classList.add('visible'); $('#editHeading').value = content.heading; $('#editDescription').value = content.description; $('#editButton').value = content.button; $('#editLink').value = content.link || ''; $('#editBackground').value = content.background || '#ffffff'; $('#editTextColor').value = content.textColor || '#172320'; $('#editButtonColor').value = content.buttonColor || '#172320'; $('#uploadPreview').style.backgroundImage = content.image ? `url(${content.image})` : content.backgroundImage ? `url(${content.backgroundImage})` : ''; $('#uploadPreview').textContent = content.image || content.backgroundImage ? '' : 'Upload an image to preview it here.';
  $$('#builderCanvas .canvas-section').forEach((node, nodeIndex) => node.classList.toggle('selected', nodeIndex === index));
}
$('#builderCanvas').addEventListener('dragover', (event) => { event.preventDefault(); const target = event.target.closest('.canvas-section'); $$('#builderCanvas .canvas-section').forEach((section) => section.classList.remove('drop-target')); if (target) target.classList.add('drop-target'); });
$('#builderCanvas').addEventListener('drop', (event) => { event.preventDefault(); const movedIndex = Number(event.dataTransfer.getData('application/x-cortex-section')); if (Number.isInteger(movedIndex) && event.dataTransfer.types.includes('application/x-cortex-section')) { const target = event.target.closest('.canvas-section'); const sections = activeProject.builderSections; const [moved] = sections.splice(movedIndex, 1); let targetIndex = sections.length; if (target) { targetIndex = Number(target.dataset.sectionIndex); const insertAfter = event.clientY > target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2; if (insertAfter) targetIndex += 1; if (movedIndex < targetIndex) targetIndex -= 1; } sections.splice(Math.max(0, targetIndex), 0, moved); selectedSection = targetIndex; renderCanvas(); showToast('Section moved.'); } else { addSection(event.dataTransfer.getData('text/plain')); } });
function readImage(file, callback) { if (!file) return callback(null); const reader = new FileReader(); reader.onload = () => callback(reader.result); reader.readAsDataURL(file); }
function refreshInspectorPreview(content) { $('#uploadPreview').style.backgroundImage = content.image ? `url(${content.image})` : content.backgroundImage ? `url(${content.backgroundImage})` : ''; $('#uploadPreview').textContent = content.image || content.backgroundImage ? '' : 'Upload an image to preview it here.'; }
$('#editImage').addEventListener('change', (event) => readImage(event.target.files[0], (image) => { if (activeProject && selectedSection !== null) { activeProject.builderSections[selectedSection].content.image = image; activeProject.builderPages[activePageIndex].sections = activeProject.builderSections; save(); refreshInspectorPreview(activeProject.builderSections[selectedSection].content); renderCanvas(); selectSection(selectedSection); } }));
$('#editBackgroundImage').addEventListener('change', (event) => readImage(event.target.files[0], (image) => { if (activeProject && selectedSection !== null) { activeProject.builderSections[selectedSection].content.backgroundImage = image; activeProject.builderPages[activePageIndex].sections = activeProject.builderSections; save(); refreshInspectorPreview(activeProject.builderSections[selectedSection].content); renderCanvas(); selectSection(selectedSection); } }));
$('#inspectorForm').addEventListener('submit', (event) => { event.preventDefault(); const content = activeProject.builderSections[selectedSection].content; content.heading = $('#editHeading').value; content.description = $('#editDescription').value; content.button = $('#editButton').value; content.link = $('#editLink').value; content.background = $('#editBackground').value; content.textColor = $('#editTextColor').value; content.buttonColor = $('#editButtonColor').value; renderCanvas(); selectSection(selectedSection); showToast('Section styling and content updated. Click Publish site when ready.'); });
$('#closeInspector').addEventListener('click', () => { selectedSection = null; $('#inspectorForm').classList.remove('visible'); $('#inspectorEmpty').style.display = 'block'; $$('#builderCanvas .canvas-section').forEach((node) => node.classList.remove('selected')); });
$('#backToProjects').addEventListener('click', () => navigate('projects'));
$('#previewButton').addEventListener('click', () => { $('#builderView').classList.toggle('preview-mode'); showToast($('#builderView').classList.contains('preview-mode') ? 'Preview mode enabled.' : 'Back to editing.'); });
function renderHostedPage(pageIndex) { ensurePages(); const page = activeProject.builderPages[pageIndex]; const settings = activeProject.siteSettings || {}; const pageNav = activeProject.builderPages.map((item, index) => `<button class="hosted-page-tab ${index === pageIndex ? 'active' : ''}" data-hosted-page="${index}">${item.name}</button>`).join(''); const sections = page.sections.map((section, index) => sectionMarkup(section, index)).join(''); $('#hostedSite').innerHTML = `<nav class="hosted-page-nav">${pageNav}</nav><header class="hosted-site-intro"><h1>${settings.title || activeProject.name}</h1>${settings.description ? `<p>${settings.description}</p>` : ''}</header><div class="hosted-page-content">${sections}</div>`; $('#hostedSite').style.setProperty('--site-accent', settings.accent || '#d8f36b'); $('#hostedSite').querySelectorAll('.section-controls').forEach((control) => control.remove()); $('#hostedSite').querySelectorAll('.canvas-section').forEach((section) => { section.classList.remove('selected'); section.removeAttribute('draggable'); }); $('#hostedSite').querySelectorAll('.hosted-page-tab').forEach((tab) => tab.addEventListener('click', () => renderHostedPage(Number(tab.dataset.hostedPage)))); bindHostedInteractions(); }
function bindHostedInteractions() { $('#hostedSite').querySelectorAll('.ready-form').forEach((form) => form.addEventListener('submit', (event) => { event.preventDefault(); form.reset(); showToast('Thanks. Your message was received.'); })); $('#hostedSite').querySelectorAll('.faq-lines span').forEach((item) => item.addEventListener('click', () => { item.classList.toggle('expanded'); item.querySelector('b').textContent = item.classList.contains('expanded') ? '−' : '＋'; })); $('#hostedSite').querySelectorAll('.canvas-button[href="#"]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); showToast('Add a destination link in the section settings.'); })); }
function showHostedSite() { ensurePages(); renderHostedPage(activePageIndex); $('#hostedUrl').textContent = activeProject.publishedUrl; $('#hostedUrl').href = activeProject.publishedUrl; $('#hostedModal').classList.add('open'); }
function publishedUrlFor(project) { return `${location.origin}${location.pathname}?site=${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`; }
function publishCurrentSite() { if (!activeProject) { showToast('Open a project before publishing.'); return; } ensurePages(); activeProject.status = 'Live'; activeProject.publishedUrl = publishedUrlFor(activeProject); activeProject.publishedAt = new Date().toISOString(); save(); $('#publishedLinkBar').classList.add('visible'); $('#editorPublishedUrl').textContent = activeProject.publishedUrl; $('#editorPublishedUrl').href = activeProject.publishedUrl; showHostedSite(); showToast(`Website updated and published at ${activeProject.publishedUrl}`); }
async function copyPublishedLink() { const url = activeProject?.publishedUrl; if (!url) return; try { await navigator.clipboard.writeText(url); showToast('Published link copied.'); } catch { const helper = document.createElement('textarea'); helper.value = url; document.body.appendChild(helper); helper.select(); document.execCommand('copy'); helper.remove(); showToast('Published link copied.'); } }
$('#publishButton').addEventListener('click', publishCurrentSite);
$('#importFile').addEventListener('change', importProjectFile);
function addProfilePage() {
  if ($('#profileView')) return;
  $('.main-content').insertAdjacentHTML('beforeend', '<section class="page-view profile-view" id="profileView"><div class="profile-hero"><div><p class="eyebrow">Your account</p><h1>Your profile</h1><p class="heading-copy">Manage your identity and keep your website workspace personal.</p></div><button class="outline-button" id="profileBack">← Back to builder</button></div><div class="profile-grid"><div class="profile-card profile-identity"><div class="profile-avatar" id="profileAvatar">U</div><div><h2 id="profileNameDisplay">Website owner</h2><p id="profileEmailDisplay">you@example.com</p><p id="profileBioDisplay">Creator workspace</p></div><span class="profile-status">● Active account</span></div><form class="profile-card profile-form" id="profileForm"><h2>Customize your profile</h2><label>Full name<input id="profileName" required maxlength="60" /></label><label>Email address<input id="profileEmail" type="email" required maxlength="100" /></label><label>Workspace name<input id="profileWorkspace" required maxlength="60" /></label><label>Short bio<textarea id="profileBio" maxlength="120" placeholder="Tell visitors what you create"></textarea></label><label>Avatar color<input id="profileColor" type="color" value="#d8f36b" /></label><button class="primary-button" type="submit">Save profile</button></form><div class="profile-card profile-stats"><h2>Workspace snapshot</h2><div><strong id="profileProjectCount">0</strong><span>Projects</span></div><div><strong id="profileLiveCount">0</strong><span>Published sites</span></div><div><strong id="profileSectionCount">0</strong><span>Built sections</span></div></div><div class="profile-card profile-activity"><h2>Recent activity</h2><div id="profileActivity"></div></div></div></section>');
  const profileVisual = $('.auth-art').cloneNode(true); profileVisual.className = 'profile-visual'; $('.profile-grid').append(profileVisual);
  $('#profileColor').closest('label').style.display = 'none';
  $('#profileBack').addEventListener('click', () => navigate('builder'));
  $('#profileForm').addEventListener('submit', (event) => { event.preventDefault(); const user = JSON.parse(localStorage.getItem('cortexweb_user') || '{}'); user.name = $('#profileName').value.trim(); user.email = $('#profileEmail').value.trim(); user.bio = $('#profileBio').value.trim(); user.avatarColor = $('#profileColor').value; user.role = 'user'; localStorage.setItem('cortexweb_user', JSON.stringify(user)); $('.user-profile strong').textContent = user.name; renderProfile(); showToast('Profile updated successfully.'); });
}
function renderProfile() {
  const user = JSON.parse(localStorage.getItem('cortexweb_user') || '{}');
  const initials = (user.name || 'User').split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
  $('#profileAvatar').textContent = initials; $('#profileAvatar').style.backgroundColor = user.avatarColor || '#d8f36b'; $('#profileNameDisplay').textContent = user.name || 'Website owner'; $('#profileEmailDisplay').textContent = user.email || 'you@example.com'; $('#profileBioDisplay').textContent = user.bio || 'Creator workspace'; $('#profileName').value = user.name || ''; $('#profileEmail').value = user.email || ''; $('#profileBio').value = user.bio || ''; $('#profileColor').value = user.avatarColor || '#d8f36b';
  $('#profileProjectCount').textContent = projects.length; $('#profileLiveCount').textContent = projects.filter((project) => project.status === 'Live').length; $('#profileSectionCount').textContent = projects.reduce((total, project) => total + (project.builderPages || []).reduce((count, page) => count + page.sections.length, 0), 0); $('#profileActivity').innerHTML = activity.slice(0, 5).map((item) => `<div class="profile-activity-row"><span>${item.icon}</span><div><strong>${item.title}</strong><small>${item.detail}</small><time>${item.time}</time></div></div>`).join('');
}
function logoutUser() { localStorage.removeItem('cortexweb_user'); document.body.classList.remove('user-mode'); $('.auth-gate').classList.remove('hidden'); navigate('builder'); showToast('You have been logged out.'); }
function addExportControls() {
  if (!document.body.classList.contains('user-mode') || $('#importTemplate')) return;
  const actions = $('.builder-actions');
  actions.insertAdjacentHTML('afterbegin', '<button class="outline-button" id="importTemplate">⇧ Upload template</button>');
  $('#importTemplate').addEventListener('click', () => $('#importFile').click());
  if (!$('#profileButton')) { actions.insertAdjacentHTML('beforeend', '<button class="outline-button" id="builtinTemplatesButton">▦ Inbuilt templates</button><button class="outline-button" id="profileButton">◯ Profile</button><button class="outline-button logout-button" id="logoutButton">↪ Log out</button>'); $('#builtinTemplatesButton').addEventListener('click', () => { setupTemplateModal(); renderBuilderBlocks(); $('#templateModal').classList.add('open'); }); $('#profileButton').addEventListener('click', () => { renderProfile(); navigate('profile'); $('#profileView').classList.add('active-view'); }); $('#logoutButton').addEventListener('click', logoutUser); }
}
$('#closeHosted').addEventListener('click', () => $('#hostedModal').classList.remove('open'));
$('#copyHostedUrl').addEventListener('click', async () => { const url = $('#hostedUrl').textContent; let copied = false; try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); copied = true; } } catch { copied = false; } if (!copied) { const helper = document.createElement('textarea'); helper.value = url; helper.setAttribute('readonly', ''); helper.style.position = 'fixed'; helper.style.opacity = '0'; document.body.appendChild(helper); helper.select(); copied = document.execCommand('copy'); helper.remove(); } showToast(copied ? 'Thank you for using CortexWeb. Hosted URL copied.' : 'Copy blocked by the browser. Select the URL to copy it.'); });
function applyRole(user) {
  const normalizedUser = { ...user, role: 'user' };
  localStorage.setItem('cortexweb_user', JSON.stringify(normalizedUser));
  document.body.classList.add('user-mode');
  $('.workspace-switcher strong').textContent = normalizedUser?.workspace || 'My workspace';
  $('.user-profile strong').textContent = normalizedUser?.name || 'Website owner';
  let userProject = projects.find((project) => project.client === normalizedUser.name) || projects[0];
  if (!userProject) { const initials = (normalizedUser.name || 'User').split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(); userProject = { id: Date.now(), name: 'My first website', client: normalizedUser.name || 'Website owner', type: 'Marketing website', status: 'In progress', initials, color: 'purple', updated: 'Just now', brief: 'Your starter website is ready to customize.' }; projects = [userProject]; save(); renderAll(); }
  openBuilder(userProject.id);
}
$('#registerForm').addEventListener('submit', (event) => { event.preventDefault(); const data = { ...Object.fromEntries(new FormData(event.target)), role: 'user' }; localStorage.setItem('cortexweb_user', JSON.stringify(data)); const initials = data.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(); const firstProject = { id: Date.now(), name: data.projectName, client: data.name, type: data.projectType, status: 'In progress', initials, color: 'purple', updated: 'Just now', brief: 'Your first CortexWeb project is ready. Add sections, edit the copy, and publish when it feels right.' }; projects = [firstProject]; activity = [{ icon: '✦', title: 'Workspace created', detail: `${data.projectName} · ready to build`, time: 'Just now' }]; save(); renderAll(); $('.auth-gate').classList.add('hidden'); applyRole(data); showToast(`Welcome to CortexWeb, ${data.name.split(' ')[0]}.`); });
function setupAuth() {
  const panel = $('.auth-panel');
  panel.querySelector('.auth-copy').insertAdjacentHTML('afterend', '<div class="auth-tabs"><button type="button" class="auth-tab active" data-auth-view="login">Log in</button><button type="button" class="auth-tab" data-auth-view="register">Create account</button></div><form id="loginForm" class="register-form auth-form"><label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" required placeholder="Enter your password" /></label><button class="primary-button auth-submit" type="submit">Log in <span>→</span></button><p class="auth-note">Use the email from your CortexWeb account.</p></form>');
  const register = $('#registerForm');
  register.classList.add('auth-form');
  const login = $('#loginForm');
  login.classList.add('visible');
  $$('.auth-tab').forEach((tab) => tab.addEventListener('click', () => { const loginView = tab.dataset.authView === 'login'; $$('.auth-tab').forEach((item) => item.classList.toggle('active', item === tab)); login.classList.toggle('visible', loginView); register.classList.toggle('visible', !loginView); }));
  login.addEventListener('submit', (event) => { event.preventDefault(); const savedUser = JSON.parse(localStorage.getItem('cortexweb_user') || 'null'); const data = Object.fromEntries(new FormData(event.target)); if (!savedUser || savedUser.email.toLowerCase() !== data.email.toLowerCase()) { showAuthError('No account found for that email. Create an account first.'); return; } $('.auth-gate').classList.add('hidden'); applyRole(savedUser); showToast(`Welcome back, ${savedUser.name.split(' ')[0]}.`); });
}
function showAuthError(message) { let note = $('.auth-error'); if (!note) { note = document.createElement('p'); note.className = 'auth-error'; $('#loginForm').appendChild(note); } note.textContent = message; }
setupAuth();
const storedUser = JSON.parse(localStorage.getItem('cortexweb_user') || 'null');
const publishedSlug = new URLSearchParams(location.search).get('site');
if (publishedSlug) { const publishedProject = projects.find((project) => project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === publishedSlug); if (publishedProject) { document.body.classList.remove('user-mode'); document.body.classList.add('public-mode'); $('.auth-gate').classList.add('hidden'); openBuilder(publishedProject.id); showHostedSite(); } }
window.addEventListener('storage', (event) => { if (!document.body.classList.contains('public-mode') || event.key !== 'cortexweb_projects') return; projects = JSON.parse(event.newValue || '[]'); const latest = projects.find((project) => project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === publishedSlug); if (latest) { activeProject = latest; activePageIndex = 0; showHostedSite(); } });
