// ── ADMIN MODE ────────────────────────────────────────
// Visit your site with ?admin=1 at the end of the URL to unlock admin view
const IS_ADMIN = new URLSearchParams(window.location.search).get('admin') === '1';
const TODAY = new Date().toISOString().split('T')[0];

// ── THEME ─────────────────────────────────────────────
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tdm_theme', next);
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
}
function initTheme() {
  const saved = localStorage.getItem('tdm_theme');
  const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── STATE ─────────────────────────────────────────────
const state = {
  seen: JSON.parse(localStorage.getItem('tdm_seen') || '[]'),
  streak: parseInt(localStorage.getItem('tdm_streak') || '0'),
  lastVisit: localStorage.getItem('tdm_lastVisit') || '',
  quizScore: JSON.parse(localStorage.getItem('tdm_quiz') || '{}'),
  stepsRevealed: 0,
  currentMech: null,
  quizAnswered: false,
  guessMode: 'easy',
};

// ── DATE HELPERS ──────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}
function shortDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
}

// ── STREAK ────────────────────────────────────────────
function updateStreak() {
  if (state.lastVisit === TODAY) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  state.streak = state.lastVisit === yesterday ? state.streak + 1 : 1;
  state.lastVisit = TODAY;
  localStorage.setItem('tdm_streak', state.streak);
  localStorage.setItem('tdm_lastVisit', TODAY);
}
function markSeen(id) {
  if (!state.seen.includes(id)) {
    state.seen.push(id);
    localStorage.setItem('tdm_seen', JSON.stringify(state.seen));
  }
}

// ── NAVIGATION ────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const link = document.querySelector(`.nav-links a[data-page="${name}"]`);
  if (link) link.classList.add('active');
  if (name === 'archive') renderArchive();
  if (name === 'guess') renderGuessPage();
  window.scrollTo(0, 0);
}

// ── LEARN PAGE ────────────────────────────────────────
function renderHome(mech) {
  state.currentMech = mech;
  state.stepsRevealed = 0;
  state.quizAnswered = false;

  document.getElementById('hero-eyebrow').textContent = formatDate(TODAY) + ' · Learn mode';
  document.getElementById('hero-title').textContent = mech.title;
  document.getElementById('hero-emoji').textContent = mech.emoji;
  document.getElementById('hero-tags').innerHTML =
    `<span class="tag tag-${mech.category === 'pharmacology' ? 'pharm' : mech.category === 'chemistry' ? 'chem' : 'biochem'}">${mech.category}</span>` +
    mech.tags.map(t => `<span class="tag tag-misc">${t}</span>`).join('');

  document.getElementById('steps-container').innerHTML = mech.steps.map((s, i) =>
    `<div class="step" id="step-${i}"><div class="step-num">${i+1}</div><p class="step-text">${s}</p></div>`
  ).join('');

  document.getElementById('summary-box').classList.remove('visible');
  document.getElementById('summary-text').textContent = mech.summary;
  document.getElementById('clinical-box').classList.remove('visible');
  document.getElementById('clinical-text').textContent = mech.clinical;
  document.getElementById('hook-box').classList.remove('visible');
  document.getElementById('hook-text').textContent = mech.memory_hook;
  document.getElementById('empty-reveal-msg').style.display = 'block';

  document.getElementById('btn-next-step').style.display = '';
  document.getElementById('btn-show-all').style.display = '';
  document.getElementById('btn-summary').style.display = 'none';
  document.getElementById('btn-quiz').style.display = 'none';
  document.getElementById('quiz-section').style.display = 'none';

  updateStepButton();
  updateSidebar();
  renderLearnQuiz(mech);
}

function updateStepButton() {
  const total = state.currentMech.steps.length;
  const btn = document.getElementById('btn-next-step');
  if (state.stepsRevealed >= total) {
    btn.style.display = 'none';
    document.getElementById('btn-show-all').style.display = 'none';
    document.getElementById('btn-summary').style.display = '';
    document.getElementById('btn-quiz').style.display = '';
    markSeen(state.currentMech.id);
    updateStreak();
    updateSidebar();
  } else {
    btn.textContent = state.stepsRevealed === 0
      ? `Reveal step 1 of ${total}`
      : `Reveal step ${state.stepsRevealed + 1} of ${total}`;
  }
}

function revealNextStep() {
  const step = document.getElementById('step-' + state.stepsRevealed);
  if (step) { step.classList.add('visible'); step.scrollIntoView({behavior:'smooth', block:'nearest'}); }
  state.stepsRevealed++;
  updateStepButton();
}

function revealAllSteps() {
  for (let i = state.stepsRevealed; i < state.currentMech.steps.length; i++) {
    const s = document.getElementById('step-' + i);
    if (s) s.classList.add('visible');
  }
  state.stepsRevealed = state.currentMech.steps.length;
  updateStepButton();
}

function toggleSummary() {
  ['summary-box','clinical-box','hook-box'].forEach(id => document.getElementById(id).classList.toggle('visible'));
  const vis = document.getElementById('summary-box').classList.contains('visible');
  document.getElementById('empty-reveal-msg').style.display = vis ? 'none' : 'block';
  document.getElementById('btn-summary').textContent = vis ? 'Hide key points' : 'Show key points + clinical';
}

// ── LEARN QUIZ ────────────────────────────────────────
function renderLearnQuiz(mech) {
  const pool = [...EASY_MECHANISMS, ...MEDIUM_MECHANISMS, ...HARD_MECHANISMS];
  const others = pool.filter(m => m.id !== mech.id).sort(() => Math.random() - 0.5).slice(0, 3);
  const correct = mech.summary.split('.')[0] + '.';
  const options = [correct, ...others.map(m => m.summary.split('.')[0] + '.')].sort(() => Math.random() - 0.5);
  document.getElementById('quiz-inner').innerHTML = `
    <p class="quiz-question">What best describes the key mechanism in today's topic?</p>
    <div class="quiz-options">
      ${options.map(o => `<button class="quiz-option" data-correct="${o===correct}" onclick="answerLearnQuiz(this)">${o}</button>`).join('')}
    </div>
    <div id="quiz-result" style="display:none" class="quiz-result"></div>
  `;
}

function answerLearnQuiz(btn) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;
  const correct = btn.dataset.correct === 'true';
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.classList.add('answered');
    if (b.dataset.correct === 'true') b.classList.add('correct');
    else if (b === btn && !correct) b.classList.add('wrong');
  });
  const r = document.getElementById('quiz-result');
  r.style.display = 'block';
  r.innerHTML = correct
    ? `<strong style="color:var(--teal)">Correct! 🎉</strong> ${state.currentMech.memory_hook}`
    : `<strong style="color:var(--coral)">Not quite.</strong> Correct answer highlighted above. ${state.currentMech.memory_hook}`;
  state.quizScore[state.currentMech.id] = correct;
  localStorage.setItem('tdm_quiz', JSON.stringify(state.quizScore));
}

// ── SIDEBAR ───────────────────────────────────────────
function updateSidebar() {
  const seen = state.seen.length;
  const vals = Object.values(state.quizScore);
  const accuracy = vals.length ? Math.round(vals.filter(Boolean).length / vals.length * 100) : 0;
  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('stat-seen').textContent = seen;
  document.getElementById('stat-accuracy').textContent = accuracy + '%';
  document.getElementById('progress-fill').style.width = Math.round(seen / EASY_MECHANISMS.length * 100) + '%';
  document.getElementById('progress-label').textContent = `${seen} / ${EASY_MECHANISMS.length} mechanisms`;
  document.getElementById('streak-pill-val').textContent = state.streak + ' day streak';

  const cur = state.currentMech;
  const recent = EASY_MECHANISMS.filter(m => m.id !== (cur && cur.id)).slice(-5).reverse();
  document.getElementById('recent-list').innerHTML = recent.map(m => `
    <div class="arch-item" onclick="loadMechanism('${m.id}')">
      <div class="arch-dot ${state.seen.includes(m.id) ? 'done' : 'skip'}"></div>
      <div class="arch-name">${m.title}</div>
    </div>
  `).join('');
}

// ── ARCHIVE ───────────────────────────────────────────
function renderArchive() {
  const all = [...EASY_MECHANISMS, ...MEDIUM_MECHANISMS, ...HARD_MECHANISMS];
  document.getElementById('archive-count').textContent = all.length + ' total mechanisms across all pools' + (IS_ADMIN ? ' (admin view)' : '');
  document.getElementById('archive-grid').innerHTML = all.map(m => `
    <div class="arch-card" onclick="loadMechanism('${m.id}')">
      <div class="arch-card-num">${m.id.startsWith('e') ? '🟢 Easy' : m.id.startsWith('m') ? '🟡 Medium' : '🔴 Hard'} ${state.seen.includes(m.id) ? '✓' : ''}</div>
      <div class="arch-card-title">${m.emoji} ${m.title}</div>
      <div class="arch-card-tags">
        <span class="tag tag-${m.category === 'pharmacology' ? 'pharm' : m.category === 'chemistry' ? 'chem' : 'biochem'}">${m.category}</span>
      </div>
    </div>
  `).join('');
}

function loadMechanism(id) {
  const m = getMechanismById(id);
  if (m) renderHome(m);
  showPage('home');
}

// ── GUESS PAGE ────────────────────────────────────────
const MAX_ATTEMPTS = 3;

function getGuessKey(mode) { return `tdm_guess_${TODAY}_${mode}`; }

function loadGuessState(mode) {
  return JSON.parse(localStorage.getItem(getGuessKey(mode)) || '{"done":false,"correct":false,"attempts":0}');
}
function saveGuessState(mode, data) {
  localStorage.setItem(getGuessKey(mode), JSON.stringify(data));
}

function renderGuessPage() {
  document.getElementById('guess-date').textContent = formatDate(TODAY);
  const easyS  = loadGuessState('easy');
  const medS   = loadGuessState('medium');
  const hardS  = loadGuessState('hard');
  const badge  = s => s.done ? (s.correct ? ' ✓' : ' ✗') : '';

  document.getElementById('guess-mode-tabs').innerHTML = `
    <button class="mode-tab ${state.guessMode==='easy'   ? 'active':''}" onclick="switchGuessMode('easy')">🟢 Easy${badge(easyS)}</button>
    <button class="mode-tab ${state.guessMode==='medium' ? 'active':''}" onclick="switchGuessMode('medium')">🟡 Medium${badge(medS)}</button>
    <button class="mode-tab ${state.guessMode==='hard'   ? 'active':''}" onclick="switchGuessMode('hard')">🔴 Hard${badge(hardS)}</button>
  `;
  renderGuessChallenge();
}

function switchGuessMode(mode) { state.guessMode = mode; renderGuessPage(); }

function renderGuessChallenge() {
  const modeData = { easy: getTodaysEasy(), medium: getTodaysMedium(), hard: getTodaysHard() };
  const mech = modeData[state.guessMode];
  const gs = loadGuessState(state.guessMode);
  const container = document.getElementById('guess-challenge');

  if (gs.done) { container.innerHTML = resultHTML(mech, gs.correct, gs.attempts, state.guessMode); return; }

  if (state.guessMode === 'easy') renderEasy(mech, container, gs);
  else renderTyped(mech, container, gs, state.guessMode);
}

// EASY: multiple choice, clue = first step
function renderEasy(mech, container, gs) {
  const pool = [...EASY_MECHANISMS, ...MEDIUM_MECHANISMS, ...HARD_MECHANISMS];
  const others = pool.filter(m => m.id !== mech.id).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [mech.title, ...others.map(m => m.title)].sort(() => Math.random() - 0.5);
  container.innerHTML = `
    <div class="guess-clue-label">🔍 Today's clue — read this first step:</div>
    <div class="guess-clue">"${mech.steps[0]}"</div>
    <p class="guess-instruction">Which mechanism does this describe? <span class="attempts-badge">${MAX_ATTEMPTS - gs.attempts} attempts left</span></p>
    <div class="quiz-options">
      ${options.map(o => `<button class="quiz-option guess-opt" data-correct="${o===mech.title}" onclick="submitEasy(this)">${o}</button>`).join('')}
    </div>
    <div id="guess-feedback" class="hard-feedback"></div>
  `;
}

function submitEasy(btn) {
  const mech = getTodaysEasy();
  const gs = loadGuessState('easy');
  if (gs.done) return;
  const correct = btn.dataset.correct === 'true';
  gs.attempts++;

  if (correct || gs.attempts >= MAX_ATTEMPTS) {
    gs.done = true; gs.correct = correct;
    saveGuessState('easy', gs);
    document.querySelectorAll('.guess-opt').forEach(b => {
      b.classList.add('answered');
      if (b.dataset.correct === 'true') b.classList.add('correct');
      else if (b === btn && !correct) b.classList.add('wrong');
    });
    setTimeout(() => {
      document.getElementById('guess-challenge').innerHTML = resultHTML(mech, correct, gs.attempts, 'easy');
      renderGuessPage();
    }, 800);
  } else {
    saveGuessState('easy', gs);
    btn.classList.add('wrong', 'answered');
    btn.disabled = true;
    const fb = document.getElementById('guess-feedback');
    fb.innerHTML = `<span style="color:var(--coral)">Not that one — ${MAX_ATTEMPTS - gs.attempts} attempt${MAX_ATTEMPTS - gs.attempts !== 1 ? 's' : ''} left.</span>`;
    renderGuessPage();
  }
}

// MEDIUM & HARD: type the answer
function renderTyped(mech, container, gs, mode) {
  const hints = [];
  if (mode === 'medium') {
    if (gs.attempts >= 1) hints.push(`💡 Hint: ${mech.steps[0].substring(0, 80)}…`);
    if (gs.attempts >= 2) hints.push(`💡 Hint 2: Category — ${mech.category}. Tags: ${mech.tags.slice(0,2).join(', ')}.`);
  } else {
    // hard — stingier hints
    if (gs.attempts >= 1) hints.push(`💡 Hint: Category — ${mech.category}.`);
    if (gs.attempts >= 2) hints.push(`💡 Hint 2: Tags — ${mech.tags[0]}, ${mech.tags[1] || ''}.`);
  }

  const clueText = mode === 'medium'
    ? `"${mech.clue}"`
    : `Tags: <strong>${mech.tags.join(', ')}</strong>`;

  container.innerHTML = `
    <div class="guess-clue-label">${mode === 'medium' ? '🟡 Medium' : '🔴 Hard'} — name the mechanism</div>
    <div class="guess-clue" style="${mode==='hard'?'font-style:normal;font-size:.9rem':''}">${clueText}</div>
    ${hints.map(h => `<div class="guess-hint">${h}</div>`).join('')}
    <p class="guess-instruction">Type the mechanism name below. <span class="attempts-badge">${MAX_ATTEMPTS - gs.attempts} attempt${MAX_ATTEMPTS - gs.attempts !== 1 ? 's' : ''} left</span></p>
    <div class="guess-input-row">
      <input type="text" id="typed-input" class="guess-input" placeholder="Type your answer…" autocomplete="off" onkeydown="if(event.key==='Enter')submitTyped('${mode}')">
      <button class="btn btn-primary" onclick="submitTyped('${mode}')">Submit</button>
    </div>
    <div id="guess-feedback" class="hard-feedback"></div>
    <div style="margin-top:.75rem">
      <button class="btn btn-secondary" style="font-size:.8rem" onclick="giveUp('${mode}')">Give up — show answer</button>
    </div>
  `;
  setTimeout(() => { const i = document.getElementById('typed-input'); if (i) i.focus(); }, 100);
}

function normalise(s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim(); }

function checkAnswer(input, mech) {
  const inp = normalise(input);
  const title = normalise(mech.title);
  const words = title.split(' ').filter(w => w.length > 3);
  const matched = words.filter(w => inp.includes(w));
  return matched.length >= Math.ceil(words.length * 0.55);
}

function submitTyped(mode) {
  const mechMap = { medium: getTodaysMedium(), hard: getTodaysHard() };
  const mech = mechMap[mode];
  const input = document.getElementById('typed-input');
  if (!input || !input.value.trim()) { showToast('Please type an answer first'); return; }
  const gs = loadGuessState(mode);
  if (gs.done) return;
  const correct = checkAnswer(input.value, mech);
  gs.attempts++;

  if (correct || gs.attempts >= MAX_ATTEMPTS) {
    gs.done = true; gs.correct = correct;
    saveGuessState(mode, gs);
    document.getElementById('guess-challenge').innerHTML = resultHTML(mech, correct, gs.attempts, mode);
    renderGuessPage();
  } else {
    saveGuessState(mode, gs);
    renderTyped(mech, document.getElementById('guess-challenge'), gs, mode);
    const fb = document.getElementById('guess-feedback');
    if (fb) fb.innerHTML = `<span style="color:var(--coral)">Not quite — ${MAX_ATTEMPTS - gs.attempts} attempt${MAX_ATTEMPTS - gs.attempts !== 1 ? 's' : ''} left.</span>`;
    const inp = document.getElementById('typed-input');
    if (inp) inp.focus();
  }
}

function giveUp(mode) {
  const mechMap = { easy: getTodaysEasy(), medium: getTodaysMedium(), hard: getTodaysHard() };
  const mech = mechMap[mode];
  const gs = loadGuessState(mode);
  gs.done = true; gs.correct = false; gs.attempts = MAX_ATTEMPTS;
  saveGuessState(mode, gs);
  document.getElementById('guess-challenge').innerHTML = resultHTML(mech, false, gs.attempts, mode);
  renderGuessPage();
}

function resultHTML(mech, correct, attempts, mode) {
  const icons = { easy: correct ? '🎉' : '😅', medium: correct ? '🧪' : '📚', hard: correct ? '🧠' : '📖' };
  const titles = {
    easy:   correct ? 'Correct!' : 'Not this time!',
    medium: correct ? `Got it in ${attempts} attempt${attempts!==1?'s':''}!` : 'Revealed!',
    hard:   correct ? `Impressive — got it in ${attempts}!` : 'Unlocked!',
  };
  return `
    <div class="guess-result ${correct?'correct':'wrong'}">
      <div class="guess-result-icon">${icons[mode]}</div>
      <div class="guess-result-title">${titles[mode]}</div>
      <div class="guess-result-answer">Answer: <strong>${mech.title}</strong></div>
      <div class="guess-result-summary">${mech.summary}</div>
      <div class="guess-result-solution">
        <div class="solution-label">Full solution</div>
        ${mech.solution}
      </div>
      <div class="guess-result-btns">
        <button class="btn btn-primary" onclick="loadMechanism('${mech.id}')">Learn this mechanism →</button>
      </div>
    </div>`;
}

// ── SHARE ─────────────────────────────────────────────
function copyLink() {
  const m = state.currentMech;
  navigator.clipboard.writeText(`The Daily Mechanism: "${m.title}" 🧬`).then(() => showToast('Copied!'));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateStreak();
  renderHome(getTodaysEasy());
  showPage('home');
  document.getElementById('streak-pill-val').textContent = state.streak + ' day streak';
  if (IS_ADMIN) showToast('Admin mode active');
});
