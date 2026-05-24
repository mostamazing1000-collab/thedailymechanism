// ── HEATMAP ───────────────────────────────────────────
function buildHeatmap() {
  var container = document.getElementById('heatmap-grid');
  if (!container) return;

  var seen = JSON.parse(localStorage.getItem('tdm_seen') || '[]');
  var guessKeys = Object.keys(localStorage).filter(function(k) { return k.startsWith('tdm_guess_'); });

  // Build a map of dates to activity level
  // level 0 = nothing, 1 = site visited, 2 = learn done, 3 = all modes done
  var activityMap = {};

  // Get all guess results
  guessKeys.forEach(function(key) {
    // key format: tdm_guess_YYYY-MM-DD_mode
    var parts = key.split('_');
    if (parts.length >= 4) {
      var date = parts[2] + '_' + parts[3]; // might be just date
      // actually format is tdm_guess_2026-05-24_easy
      var dateStr = parts[2]; // YYYY-MM-DD
      if (!activityMap[dateStr]) activityMap[dateStr] = 0;
      var data = JSON.parse(localStorage.getItem(key) || '{}');
      if (data.done) activityMap[dateStr] = Math.max(activityMap[dateStr], 2);
    }
  });

  // Mark last visit
  var lastVisit = localStorage.getItem('tdm_lastVisit');
  if (lastVisit) {
    if (!activityMap[lastVisit]) activityMap[lastVisit] = 1;
  }

  // Build 16 weeks of grid (112 days)
  var today = new Date();
  today.setHours(0,0,0,0);
  var start = new Date(today);
  start.setDate(start.getDate() - 111);
  // Align to Sunday
  start.setDate(start.getDate() - start.getDay());

  container.innerHTML = '';

  var col = document.createElement('div');
  col.className = 'heatmap-col';
  var dayOfWeek = 0;

  var d = new Date(start);
  while (d <= today) {
    if (dayOfWeek === 0 && d !== start) {
      container.appendChild(col);
      col = document.createElement('div');
      col.className = 'heatmap-col';
    }

    var cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    var dateStr = d.toISOString().split('T')[0];
    var level = activityMap[dateStr] || 0;
    if (d > today) level = -1;
    if (level > 0) cell.setAttribute('data-level', level);
    cell.setAttribute('data-tip', dateStr);

    col.appendChild(cell);
    dayOfWeek = (dayOfWeek + 1) % 7;
    d.setDate(d.getDate() + 1);
  }
  container.appendChild(col);
}

// ── SHARE CARD ────────────────────────────────────────
function buildShareCard() {
  var wrap = document.getElementById('share-card-wrap');
  if (!wrap) return;

  var today = new Date().toISOString().split('T')[0];
  var easyState  = JSON.parse(localStorage.getItem('tdm_guess_' + today + '_easy')  || '{"done":false}');
  var medState   = JSON.parse(localStorage.getItem('tdm_guess_' + today + '_medium') || '{"done":false}');
  var hardState  = JSON.parse(localStorage.getItem('tdm_guess_' + today + '_hard')  || '{"done":false}');

  function modeSquares(gs, label) {
    if (!gs.done) return '<div class="share-sq skip" title="' + label + ' not yet played">❓</div>';
    return '<div class="share-sq ' + (gs.correct ? 'correct' : 'wrong') + '" title="' + label + '">' + (gs.correct ? '✓' : '✗') + '</div>';
  }

  var anyDone = easyState.done || medState.done || hardState.done;

  if (!anyDone) {
    wrap.innerHTML = '<p style="color:var(--ink-faint);font-size:.875rem;text-align:center;padding:1rem">Play today\'s challenges to generate your share card!</p>';
    return;
  }

  var squaresHtml = modeSquares(easyState, 'Easy') + modeSquares(medState, 'Medium') + modeSquares(hardState, 'Hard');

  var shareText = 'The Daily Mechanism ' + today + '\n' +
    (easyState.done  ? (easyState.correct  ? '🟢✓' : '🟢✗') : '🟢❓') + ' ' +
    (medState.done   ? (medState.correct   ? '🟡✓' : '🟡✗') : '🟡❓') + ' ' +
    (hardState.done  ? (hardState.correct  ? '🔴✓' : '🔴✗') : '🔴❓') + '\n' +
    'thedailymechanism — try it!';

  wrap.innerHTML =
    '<div class="share-result-card">' +
    '<p style="font-size:.75rem;color:var(--ink-faint);font-family:\'DM Mono\',monospace;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.75rem">Your result today</p>' +
    '<div class="share-squares">' + squaresHtml + '</div>' +
    '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:1rem">' +
    '<button class="btn btn-primary" style="font-size:.825rem;padding:.6rem 1.2rem" onclick="copyShareCard(\'' + encodeURIComponent(shareText) + '\')">📋 Copy result</button>' +
    '<button class="btn btn-secondary" style="font-size:.825rem;padding:.6rem 1.2rem" onclick="shareToTwitter(\'' + encodeURIComponent(shareText) + '\')">𝕏 Share</button>' +
    '</div></div>';
}

function copyShareCard(encoded) {
  navigator.clipboard.writeText(decodeURIComponent(encoded)).then(function() { showToast('Result copied!'); });
}

function shareToTwitter(encoded) {
  window.open('https://twitter.com/intent/tweet?text=' + encoded, '_blank');
}

// ── ANIMATED COUNTER ──────────────────────────────────
function animateCounter(el, target, duration) {
  var start = 0;
  var step = target / (duration / 16);
  var timer = setInterval(function() {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

function initCounters() {
  document.querySelectorAll('.stat-block-val[data-target]').forEach(function(el) {
    var target = parseInt(el.dataset.target);
    animateCounter(el, target, 1200);
  });
}

// ── INTERSECTION OBSERVER for animations ──────────────
function initScrollAnimations() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('stat-block-val')) {
          animateCounter(entry.target, parseInt(entry.target.dataset.target), 1000);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.scroll-reveal, .stat-block-val[data-target]').forEach(function(el) {
    observer.observe(el);
  });
}

// ── LANDING INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  buildHeatmap();
  buildShareCard();
  initScrollAnimations();
});
