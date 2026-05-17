// ── ADMIN ─────────────────────────────────────────────
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
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
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

// ── DATE ──────────────────────────────────────────────
function formatDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
}
function shortDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {day:'numeric',month:'short'});
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

// ── NAV ───────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const link = document.querySelector('.nav-links a[data-page="' + name + '"]');
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
  document.getElementById('hero-emoji').textContent = mech.emoji || '⚗️';

  var catClass = mech.category === 'pharmacology' ? 'tag-pharm' : mech.category === 'chemistry' ? 'tag-chem' : 'tag-biochem';
  var tagHtml = '<span class="tag ' + catClass + '">' + mech.category + '</span>';
  mech.tags.forEach(function(t) { tagHtml += '<span class="tag tag-misc">' + t + '</span>'; });
  document.getElementById('hero-tags').innerHTML = tagHtml;

  var stepsHtml = '';
  mech.steps.forEach(function(s, i) {
    stepsHtml += '<div class="step" id="step-' + i + '"><div class="step-num">' + (i+1) + '</div><p class="step-text">' + s + '</p></div>';
  });
  document.getElementById('steps-container').innerHTML = stepsHtml;

  document.getElementById('summary-box').classList.remove('visible');
  document.getElementById('summary-text').textContent = mech.summary || '';
  document.getElementById('clinical-box').classList.remove('visible');
  document.getElementById('clinical-text').textContent = mech.clinical || '';
  document.getElementById('hook-box').classList.remove('visible');
  document.getElementById('hook-text').textContent = mech.memory_hook || '';
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
  var total = state.currentMech.steps.length;
  var btn = document.getElementById('btn-next-step');
  if (state.stepsRevealed >= total) {
    btn.style.display = 'none';
    document.getElementById('btn-show-all').style.display = 'none';
    document.getElementById('btn-summary').style.display = '';
    document.getElementById('btn-quiz').style.display = '';
    markSeen(state.currentMech.id);
    updateStreak();
    updateSidebar();
  } else {
    btn.textContent = state.stepsRevealed === 0 ? 'Reveal step 1 of ' + total : 'Reveal step ' + (state.stepsRevealed + 1) + ' of ' + total;
  }
}

function revealNextStep() {
  var step = document.getElementById('step-' + state.stepsRevealed);
  if (step) { step.classList.add('visible'); step.scrollIntoView({behavior:'smooth', block:'nearest'}); }
  state.stepsRevealed++;
  updateStepButton();
}

function revealAllSteps() {
  for (var i = state.stepsRevealed; i < state.currentMech.steps.length; i++) {
    var s = document.getElementById('step-' + i);
    if (s) s.classList.add('visible');
  }
  state.stepsRevealed = state.currentMech.steps.length;
  updateStepButton();
}

function toggleSummary() {
  ['summary-box','clinical-box','hook-box'].forEach(function(id) {
    document.getElementById(id).classList.toggle('visible');
  });
  var vis = document.getElementById('summary-box').classList.contains('visible');
  document.getElementById('empty-reveal-msg').style.display = vis ? 'none' : 'block';
  document.getElementById('btn-summary').textContent = vis ? 'Hide key points' : 'Show key points + clinical';
}

function showQuizSection() {
  document.getElementById('quiz-section').style.display = 'block';
  document.getElementById('btn-quiz').style.display = 'none';
  document.getElementById('quiz-section').scrollIntoView({behavior:'smooth'});
}

// ── LEARN QUIZ ────────────────────────────────────────
function renderLearnQuiz(mech) {
  var pool = EASY_MECHANISMS.concat(MEDIUM_MECHANISMS).concat(HARD_MECHANISMS);
  var others = pool.filter(function(m) { return m.id !== mech.id; }).sort(function() { return Math.random()-0.5; }).slice(0,3);
  var correct = mech.summary.split('.')[0] + '.';
  var options = [correct].concat(others.map(function(m) { return m.summary.split('.')[0] + '.'; })).sort(function() { return Math.random()-0.5; });
  var html = '<p class="quiz-question">What best describes the key mechanism?</p><div class="quiz-options">';
  options.forEach(function(o) {
    html += '<button class="quiz-option" data-correct="' + (o === correct) + '" onclick="answerLearnQuiz(this)">' + o + '</button>';
  });
  html += '</div><div id="quiz-result" style="display:none" class="quiz-result"></div>';
  document.getElementById('quiz-inner').innerHTML = html;
}

function answerLearnQuiz(btn) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;
  var correct = btn.dataset.correct === 'true';
  document.querySelectorAll('.quiz-option').forEach(function(b) {
    b.classList.add('answered');
    if (b.dataset.correct === 'true') b.classList.add('correct');
    else if (b === btn && !correct) b.classList.add('wrong');
  });
  var r = document.getElementById('quiz-result');
  r.style.display = 'block';
  r.innerHTML = correct
    ? '<strong style="color:var(--teal)">Correct! 🎉</strong> ' + state.currentMech.memory_hook
    : '<strong style="color:var(--coral)">Not quite.</strong> Correct answer highlighted. ' + state.currentMech.memory_hook;
  state.quizScore[state.currentMech.id] = correct;
  localStorage.setItem('tdm_quiz', JSON.stringify(state.quizScore));
}

// ── SIDEBAR ───────────────────────────────────────────
function updateSidebar() {
  var seen = state.seen.length;
  var vals = Object.values(state.quizScore);
  var accuracy = vals.length ? Math.round(vals.filter(Boolean).length / vals.length * 100) : 0;
  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('stat-seen').textContent = seen;
  document.getElementById('stat-accuracy').textContent = accuracy + '%';
  var total = EASY_MECHANISMS.length;
  document.getElementById('progress-fill').style.width = Math.round(seen / total * 100) + '%';
  document.getElementById('progress-label').textContent = seen + ' / ' + total + ' mechanisms';
  document.getElementById('streak-pill-val').textContent = state.streak + ' day streak';

  var cur = state.currentMech;
  var recent = EASY_MECHANISMS.filter(function(m) { return !cur || m.id !== cur.id; }).slice(-5).reverse();
  var html = '';
  recent.forEach(function(m) {
    html += '<div class="arch-item" onclick="loadMechanism(\'' + m.id + '\')">'
      + '<div class="arch-dot ' + (state.seen.includes(m.id) ? 'done' : 'skip') + '"></div>'
      + '<div class="arch-name">' + m.title + '</div>'
      + '</div>';
  });
  document.getElementById('recent-list').innerHTML = html;
}

// ── ARCHIVE ───────────────────────────────────────────
function renderArchive() {
  var all = EASY_MECHANISMS.concat(MEDIUM_MECHANISMS).concat(HARD_MECHANISMS);
  document.getElementById('archive-count').textContent = all.length + ' total mechanisms';
  var html = '';
  all.forEach(function(m) {
    var catClass = m.category === 'pharmacology' ? 'tag-pharm' : m.category === 'chemistry' ? 'tag-chem' : 'tag-biochem';
    var pool = m.id.startsWith('e') ? '🟢 Easy' : m.id.startsWith('m') ? '🟡 Medium' : '🔴 Hard';
    var done = state.seen.includes(m.id) ? ' ✓' : '';
    html += '<div class="arch-card" onclick="loadMechanism(\'' + m.id + '\')">'
      + '<div class="arch-card-num">' + pool + done + '</div>'
      + '<div class="arch-card-title">' + (m.emoji || '⚗️') + ' ' + m.title + '</div>'
      + '<div class="arch-card-tags"><span class="tag ' + catClass + '">' + m.category + '</span></div>'
      + '</div>';
  });
  document.getElementById('archive-grid').innerHTML = html;
}

function loadMechanism(id) {
  var all = EASY_MECHANISMS.concat(MEDIUM_MECHANISMS).concat(HARD_MECHANISMS);
  var m = all.find(function(x) { return x.id === id; });
  if (m) renderHome(m);
  showPage('home');
}

// ── GUESS PAGE ────────────────────────────────────────
var MAX_ATTEMPTS = 3;

function getGuessKey(mode) { return 'tdm_guess_' + TODAY + '_' + mode; }
function loadGuessState(mode) {
  return JSON.parse(localStorage.getItem(getGuessKey(mode)) || '{"done":false,"correct":false,"attempts":0}');
}
function saveGuessState(mode, data) {
  localStorage.setItem(getGuessKey(mode), JSON.stringify(data));
}

function renderGuessPage() {
  document.getElementById('guess-date').textContent = formatDate(TODAY);
  var eS = loadGuessState('easy'), mS = loadGuessState('medium'), hS = loadGuessState('hard');
  function badge(s) { return s.done ? (s.correct ? ' ✓' : ' ✗') : ''; }
  document.getElementById('guess-mode-tabs').innerHTML =
    '<button class="mode-tab ' + (state.guessMode==='easy'?'active':'') + '" onclick="switchGuessMode(\'easy\')">🟢 Easy' + badge(eS) + '</button>' +
    '<button class="mode-tab ' + (state.guessMode==='medium'?'active':'') + '" onclick="switchGuessMode(\'medium\')">🟡 Medium' + badge(mS) + '</button>' +
    '<button class="mode-tab ' + (state.guessMode==='hard'?'active':'') + '" onclick="switchGuessMode(\'hard\')">🔴 Hard' + badge(hS) + '</button>';
  renderGuessChallenge();
}

function switchGuessMode(mode) {
  state.guessMode = mode;
  renderGuessPage();
}

function renderGuessChallenge() {
  var mechs = { easy: getTodaysEasy(), medium: getTodaysMedium(), hard: getTodaysHard() };
  var mech = mechs[state.guessMode];
  var gs = loadGuessState(state.guessMode);
  var container = document.getElementById('guess-challenge');
  if (gs.done) { container.innerHTML = resultHTML(mech, gs.correct, gs.attempts, state.guessMode); return; }
  if (state.guessMode === 'easy') renderEasyChallenge(mech, container, gs);
  else renderTypedChallenge(mech, container, gs, state.guessMode);
}

function renderEasyChallenge(mech, container, gs) {
  var pool = EASY_MECHANISMS.concat(MEDIUM_MECHANISMS).concat(HARD_MECHANISMS);
  var others = pool.filter(function(m) { return m.id !== mech.id; }).sort(function() { return Math.random()-0.5; }).slice(0,3);
  var options = [mech.title].concat(others.map(function(m) { return m.title; })).sort(function() { return Math.random()-0.5; });
  var optHtml = '';
  options.forEach(function(o) {
    optHtml += '<button class="quiz-option guess-opt" data-correct="' + (o===mech.title) + '" onclick="submitEasy(this)">' + o + '</button>';
  });
  container.innerHTML =
    '<div class="guess-clue-label">🔍 Today\'s clue — read this first step:</div>' +
    '<div class="guess-clue">"' + mech.steps[0] + '"</div>' +
    '<p class="guess-instruction">Which mechanism does this describe? <span class="attempts-badge">' + (MAX_ATTEMPTS - gs.attempts) + ' attempts left</span></p>' +
    '<div class="quiz-options">' + optHtml + '</div>' +
    '<div id="guess-feedback" class="hard-feedback"></div>';
}

function submitEasy(btn) {
  var mech = getTodaysEasy();
  var gs = loadGuessState('easy');
  if (gs.done) return;
  var correct = btn.dataset.correct === 'true';
  gs.attempts++;
  if (correct || gs.attempts >= MAX_ATTEMPTS) {
    gs.done = true; gs.correct = correct;
    saveGuessState('easy', gs);
    document.querySelectorAll('.guess-opt').forEach(function(b) {
      b.classList.add('answered');
      if (b.dataset.correct === 'true') b.classList.add('correct');
      else if (b === btn && !correct) b.classList.add('wrong');
    });
    setTimeout(function() {
      document.getElementById('guess-challenge').innerHTML = resultHTML(mech, correct, gs.attempts, 'easy');
      renderGuessPage();
    }, 700);
  } else {
    saveGuessState('easy', gs);
    btn.classList.add('wrong','answered');
    btn.disabled = true;
    document.getElementById('guess-feedback').innerHTML = '<span style="color:var(--coral)">Not that one — ' + (MAX_ATTEMPTS-gs.attempts) + ' attempt(s) left.</span>';
  }
}

function renderTypedChallenge(mech, container, gs, mode) {
  var hints = '';
  if (mode === 'medium') {
    if (gs.attempts >= 1) hints += '<div class="guess-hint">💡 <strong>Hint 1:</strong> ' + mech.steps[0].substring(0,90) + '…</div>';
    if (gs.attempts >= 2) hints += '<div class="guess-hint">💡 <strong>Hint 2:</strong> Category — ' + mech.category + '. Tags: ' + mech.tags.slice(0,2).join(', ') + '.</div>';
  } else {
    if (gs.attempts >= 1) hints += '<div class="guess-hint">💡 <strong>Hint 1:</strong> Category — ' + mech.category + '.</div>';
    if (gs.attempts >= 2) hints += '<div class="guess-hint">💡 <strong>Hint 2:</strong> Tags — ' + mech.tags[0] + (mech.tags[1] ? ', ' + mech.tags[1] : '') + '.</div>';
  }
  var clue = mode === 'medium'
    ? '"' + mech.clue + '"'
    : 'Tags: <strong>' + mech.tags.join(', ') + '</strong>';

  // Show diagram if available
  var diagramHtml = '';
  if (mech.diagram && gs.attempts >= 1) {
    diagramHtml = '<div style="margin:1rem 0">' + mech.diagram + '</div>';
  }

  container.innerHTML =
    '<div class="guess-clue-label">' + (mode==='medium'?'🟡 Medium':'🔴 Hard') + ' — name the mechanism</div>' +
    '<div class="guess-clue" style="' + (mode==='hard'?'font-style:normal;font-size:.9rem':'') + '">' + clue + '</div>' +
    diagramHtml + hints +
    '<p class="guess-instruction">Type the mechanism name. <span class="attempts-badge">' + (MAX_ATTEMPTS-gs.attempts) + ' attempt(s) left</span></p>' +
    '<div class="guess-input-row">' +
    '<input type="text" id="typed-input" class="guess-input" placeholder="Type your answer…" autocomplete="off" onkeydown="if(event.key===\'Enter\')submitTyped(\'' + mode + '\')">' +
    '<button class="btn btn-primary" onclick="submitTyped(\'' + mode + '\')">Submit</button>' +
    '</div>' +
    '<div id="guess-feedback" class="hard-feedback"></div>' +
    '<div style="margin-top:.75rem"><button class="btn btn-secondary" style="font-size:.8rem" onclick="giveUp(\'' + mode + '\')">Give up — show answer</button></div>';

  setTimeout(function() { var i = document.getElementById('typed-input'); if(i) i.focus(); }, 100);
}

function normalise(s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim(); }

function checkAnswer(input, mech) {
  var inp = normalise(input);
  var title = normalise(mech.title);
  var words = title.split(' ').filter(function(w) { return w.length > 3; });
  var matched = words.filter(function(w) { return inp.includes(w); });
  return matched.length >= Math.ceil(words.length * 0.55);
}

function submitTyped(mode) {
  var mechs = { medium: getTodaysMedium(), hard: getTodaysHard() };
  var mech = mechs[mode];
  var input = document.getElementById('typed-input');
  if (!input || !input.value.trim()) { showToast('Please type an answer first'); return; }
  var gs = loadGuessState(mode);
  if (gs.done) return;
  var correct = checkAnswer(input.value, mech);
  gs.attempts++;
  if (correct || gs.attempts >= MAX_ATTEMPTS) {
    gs.done = true; gs.correct = correct;
    saveGuessState(mode, gs);
    document.getElementById('guess-challenge').innerHTML = resultHTML(mech, correct, gs.attempts, mode);
    renderGuessPage();
  } else {
    saveGuessState(mode, gs);
    renderTypedChallenge(mech, document.getElementById('guess-challenge'), gs, mode);
    var fb = document.getElementById('guess-feedback');
    if (fb) fb.innerHTML = '<span style="color:var(--coral)">Not quite — ' + (MAX_ATTEMPTS-gs.attempts) + ' attempt(s) left.</span>';
    var inp = document.getElementById('typed-input');
    if (inp) inp.focus();
  }
}

function giveUp(mode) {
  var mechs = { easy: getTodaysEasy(), medium: getTodaysMedium(), hard: getTodaysHard() };
  var gs = loadGuessState(mode);
  gs.done = true; gs.correct = false; gs.attempts = MAX_ATTEMPTS;
  saveGuessState(mode, gs);
  document.getElementById('guess-challenge').innerHTML = resultHTML(mechs[mode], false, gs.attempts, mode);
  renderGuessPage();
}

function resultHTML(mech, correct, attempts, mode) {
  var icons = {easy: correct?'🎉':'😅', medium: correct?'🧪':'📚', hard: correct?'🧠':'📖'};
  var titles = {
    easy: correct ? 'Correct!' : 'Not this time!',
    medium: correct ? 'Got it in ' + attempts + ' attempt' + (attempts!==1?'s':'') + '!' : 'Revealed!',
    hard: correct ? 'Impressive — ' + attempts + ' attempt' + (attempts!==1?'s':'') + '!' : 'Unlocked!'
  };
  var diagHtml = mech.diagram ? '<div style="margin:1rem 0">' + mech.diagram + '</div>' : '';
  return '<div class="guess-result ' + (correct?'correct':'wrong') + '">' +
    '<div class="guess-result-icon">' + icons[mode] + '</div>' +
    '<div class="guess-result-title">' + titles[mode] + '</div>' +
    '<div class="guess-result-answer">Answer: <strong>' + mech.title + '</strong></div>' +
    diagHtml +
    '<div class="guess-result-summary">' + mech.summary + '</div>' +
    '<div class="guess-result-solution"><div class="solution-label">Full solution</div>' + mech.solution + '</div>' +
    '<div class="guess-result-btns">' +
    '<button class="btn btn-primary" onclick="loadMechanism(\'' + mech.id + '\')">Learn this mechanism →</button>' +
    '</div></div>';
}

// ── SHARE ─────────────────────────────────────────────
function copyLink() {
  var m = state.currentMech;
  if (!m) return;
  navigator.clipboard.writeText('The Daily Mechanism: "' + m.title + '" 🧬').then(function() { showToast('Copied!'); });
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2200);
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  updateStreak();
  renderHome(getTodaysEasy());
  showPage('home');
  document.getElementById('streak-pill-val').textContent = state.streak + ' day streak';
  if (IS_ADMIN) showToast('Admin mode active');
});
