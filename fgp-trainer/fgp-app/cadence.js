/* ═══════════════════════════════════════════════
   FGP CADENCE + FLASH COACH + FARGO TRACKER
   Merged from fgp-app (GitHub Pages) into unified PWA.
═══════════════════════════════════════════════ */

// ── FLASH COACH TAB INIT ─────────────────────────────────
function initCoachTab() {
  if (apiKey) {
    var keyEl = document.getElementById('api-key');
    if (keyEl) keyEl.value = apiKey;
    var notice = document.getElementById('api-notice');
    if (notice) notice.classList.add('hidden');
  }
  var lastUrl = localStorage.getItem('fgp_last_url') || '';
  var ytUrl = document.getElementById('yt-url');
  if (lastUrl && ytUrl && !ytUrl.value) ytUrl.value = lastUrl;
}

// ── CADENCE BEATS ────────────────────────────────────────
var BEATS = [
  {m:1,b:1,l:'CALM',    v:'Calm',    c:'var(--dim)'},
  {m:1,b:2,l:'· · ·',  v:null,      c:'var(--border)'},
  {m:1,b:3,l:'· · ·',  v:null,      c:'var(--border)'},
  {m:1,b:4,l:'READY',  v:'Ready',   c:'var(--dim)'},
  {m:2,b:1,l:'CUE',    v:'Cue',     c:'var(--cyan)'},
  {m:2,b:2,l:'BALL',   v:'Ball',    c:'var(--gold)'},
  {m:2,b:3,l:'CUE',    v:'Cue',     c:'var(--cyan)'},
  {m:2,b:4,l:'BALL',   v:'Ball',    c:'var(--gold)'},
  {m:3,b:1,l:'STEP',   v:'Step',    c:'var(--cyan)'},
  {m:3,b:2,l:'STEP',   v:'Step',    c:'var(--cyan)'},
  {m:3,b:3,l:'DROP',   v:'Drop',    c:'var(--cyan)'},
  {m:3,b:4,l:'· · ·', v:null,      c:'var(--border)'},
  {m:4,b:1,l:'PIN',    v:'Pin',     c:'var(--red)'},
  {m:4,b:2,l:'STILL',  v:'Still',   c:'var(--border)'},
  {m:4,b:3,l:'SLOW',   v:'Slow',    c:'var(--gold)'},
  {m:4,b:4,l:'SMOOTH', v:'Smooth',  c:'var(--gold)'},
  {m:5,b:1,l:'SLOW',   v:'Slow',    c:'var(--gold)'},
  {m:5,b:2,l:'SMOOTH', v:'Smooth',  c:'var(--gold)'},
  {m:5,b:3,l:'SLOW',   v:'Slow',    c:'var(--gold)'},
  {m:5,b:4,l:'· · ·', v:null,      c:'var(--border)'},
  {m:6,b:1,l:'THROUGH',v:'Through', c:'var(--green)'},
  {m:6,b:2,l:'STILL',  v:'Still',   c:'var(--border)'},
  {m:6,b:3,l:'STILL',  v:null,      c:'var(--border)'},
  {m:6,b:4,l:'CHECK',  v:'Check',   c:'var(--cyan)'},
];

var W = [
  'Every shot the same. Every time.',
  'The stroke is a pendulum. Elbow pivots. Nothing else moves.',
  'Settle at the cue ball. Do not rush the backswing.',
  'Eyes on the object ball at contact. Every time.',
  'Follow-through is not optional. Finish through the ball.',
  'Speed control is 60% of position play.',
  'Commit before you get down. No second-guessing.',
  'The slow backswing separates pros from amateurs.',
  'One shot at a time. That is all there is.',
  'Hold your finish. Watch the cue ball.',
  'Your Fargo is built one shot at a time.',
  'The comeback nobody saw coming.',
  'Routine is your armor. Wear it every shot.',
  'Plan two balls ahead. Always.',
];

var cadOn = false, cadIdx = 0, cadTmr = null, cadCyc = 0;
var made = 0, att = 0, run = 0, best = 0, wi = 0, lastWasMade = null;

function _cadGrid() {
  var g = document.getElementById('cad-grid');
  if (!g || g.children.length) return;
  for (var i = 0; i < 24; i++) {
    var d = document.createElement('div');
    d.className = 'cad-cell';
    d.id = 'cc' + i;
    g.appendChild(d);
  }
}

function cadenceToggle() { cadOn ? cadenceStop() : cadenceGo(); }

function cadenceGo() {
  cadOn = true; cadIdx = 0;
  startSession();
  document.getElementById('cad-sbtn').innerHTML = '⏸ STOP';
  document.getElementById('cad-sbtn').className = 'cad-btn-stop';
  document.getElementById('cad-rbtn').style.display = 'none';
  // Only prime TTS when mic is NOT active (voice already unlocked TTS)
  if (window.speechSynthesis && !micOn) {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  }
  setTimeout(function() {
    cadenceFire(0);
    cadTmr = setInterval(function() {
      cadIdx++;
      if (cadIdx >= 24) {
        cadCyc++;
        document.getElementById('cad-cyc').textContent = cadCyc;
        if (currentSession) currentSession.cycles = cadCyc;
        nextW();
        cadenceStop();
        return;
      }
      cadenceFire(cadIdx);
    }, 1000);
  }, 150);
}

function cadenceStop() {
  cadOn = false;
  clearInterval(cadTmr);
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  var sbtn = document.getElementById('cad-sbtn');
  if (sbtn) { sbtn.innerHTML = '▶ START'; sbtn.className = 'cad-btn-start'; }
  if (cadCyc > 0 && document.getElementById('cad-rbtn'))
    document.getElementById('cad-rbtn').style.display = 'block';
  var cue = document.getElementById('cad-cue');
  if (cue) { cue.textContent = 'READY'; cue.style.color = 'var(--dim)'; }
  var binfo = document.getElementById('cad-binfo');
  if (binfo) binfo.textContent = '60 BPM · TAP START';
  for (var i = 0; i < 24; i++) {
    var c = document.getElementById('cc' + i);
    if (c) { c.style.background = 'var(--border)'; c.style.height = '10px'; c.style.opacity = '1'; }
  }
  for (var m = 1; m <= 6; m++) {
    var e = document.getElementById('cadm' + m);
    if (e) { e.style.color = 'var(--dim)'; e.classList.remove('on'); }
  }
}

function cadenceFire(i) {
  var b = BEATS[i];
  // resolve CSS var to actual color for inline styles
  var col = b.c;
  var cue = document.getElementById('cad-cue');
  if (cue) { cue.textContent = b.l; cue.style.color = col; }
  var binfo = document.getElementById('cad-binfo');
  if (binfo) binfo.textContent = b.b + ' · 4';
  for (var m = 1; m <= 6; m++) {
    var e = document.getElementById('cadm' + m);
    if (!e) continue;
    if (b.m === m) { e.style.color = col; e.classList.add('on'); }
    else { e.style.color = 'var(--dim)'; e.classList.remove('on'); }
  }
  for (var j = 0; j < 24; j++) {
    var c = document.getElementById('cc' + j);
    if (!c) continue;
    if (j === i) {
      c.style.background = col; c.style.height = '18px'; c.style.opacity = '1';
    } else if (j < i) {
      c.style.background = BEATS[j].c; c.style.height = '10px'; c.style.opacity = '0.2';
    } else {
      c.style.background = 'var(--border)'; c.style.height = '10px'; c.style.opacity = '1';
    }
  }
  if (b.v && window.speechSynthesis) {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    var u = new SpeechSynthesisUtterance(b.v);
    u.rate = 0.9; u.pitch = 1.1; u.volume = 1;
    window.speechSynthesis.speak(u);
  }
}

function resetCycles() {
  cadCyc = 0;
  document.getElementById('cad-cyc').textContent = '0';
  document.getElementById('cad-rbtn').style.display = 'none';
}

// ── SHOT COUNTER ─────────────────────────────────────────
function shot(m) {
  lastWasMade = m;
  att++;
  if (m) { made++; run++; } else { run = 0; }
  if (run > best) best = run;
  if (currentSession) currentSession.longestRun = best;
  var undobtn = document.getElementById('undobtn');
  if (undobtn) { undobtn.style.opacity = '1'; undobtn.style.pointerEvents = 'auto'; }
  _updateShotDisplay();
}

function undo() {
  if (att === 0) return;
  if (lastWasMade) { made--; run = Math.max(0, run - 1); }
  att--;
  if (att === 0) { run = 0; best = 0; }
  lastWasMade = null;
  var undobtn = document.getElementById('undobtn');
  if (undobtn) { undobtn.style.opacity = '0.4'; undobtn.style.pointerEvents = 'none'; }
  _updateShotDisplay();
}

function resetShots() {
  made = 0; att = 0; run = 0; best = 0; lastWasMade = null;
  var undobtn = document.getElementById('undobtn');
  if (undobtn) { undobtn.style.opacity = '0.4'; undobtn.style.pointerEvents = 'none'; }
  _updateShotDisplay();
}

function _updateShotDisplay() {
  var p = att > 0 ? Math.round(made / att * 100) : 0;
  var smade = document.getElementById('smade');
  var satt = document.getElementById('satt');
  var spct = document.getElementById('spct');
  var pfill = document.getElementById('cad-pfill');
  var srun = document.getElementById('srun');
  var sbest = document.getElementById('sbest');
  if (smade) smade.textContent = made;
  if (satt) satt.textContent = att;
  if (spct) spct.textContent = att > 0 ? p + '%' : '—';
  if (pfill) pfill.style.width = p + '%';
  if (srun) srun.textContent = run;
  if (sbest) sbest.textContent = best;
}

function nextW() {
  var p = wi;
  while (wi === p) wi = Math.floor(Math.random() * W.length);
  var el = document.getElementById('wtxt');
  if (el) el.textContent = W[wi];
}

// ── FLASH COACH (GEMINI AI) ──────────────────────────────
var COACH_MODEL = 'gemini-2.5-flash';
var COACH_PROMPT = 'You are Flash Coach, an elite AI billiards coach for Flash Gordon Pool.\n\nPLAYER: Scott "Flash Gordon" Gordon. Fargo ~640 rising, goal 750+ pro. Orthodox stroke rebuild. 60 BPM cadence routine. McDermott H1752, Defy carbon shaft, Brunswick Gold Crown IV 9ft, Simonis 870.\n\nAnalyze the session video honestly. Connect all feedback to the 3-year pro timeline. Be direct, warm, authoritative.\n\nReturn ONLY valid JSON:\n{"sessionSummary":"string","overallScore":1-100,"overallGrade":"A+/A/A-/B+/B/B-/C+/C/C-/D/F","fargoEstimate":{"rating":0,"range":"string","trend":"Rising/Stable/Declining","confidence":"Low/Medium/High","toNextTier":"string"},"scorecard":{"preShot":1-10,"stance":1-10,"bridge":1-10,"stroke":1-10,"followThrough":1-10,"cueBallControl":1-10,"positionPlay":1-10,"safetyPlay":1-10,"speedControl":1-10,"mentalGame":1-10},"strengths":[{"title":"string","detail":"string"}],"improvements":[{"title":"string","detail":"string","priority":1}],"jerryNarrative":"3-5 paragraphs coaching feedback","practicePrescription":{"focus":"string","drills":[{"name":"string","reps":"string","why":"string"}],"mentalCue":"string"},"proTimelineNote":"string"}';
var LSTEPS = ['Sending video to Flash Coach...','Analyzing stroke mechanics...','Checking pre-shot routine...','Evaluating position play...','Estimating Fargo rating...','Writing coaching report...'];
var SCLABELS = {preShot:'Pre-Shot',stance:'Stance',bridge:'Bridge',stroke:'Stroke',followThrough:'Follow-Through',cueBallControl:'CB Control',positionPlay:'Position Play',safetyPlay:'Safety Play',speedControl:'Speed Control',mentalGame:'Mental Game'};
var coachHistory = JSON.parse(localStorage.getItem('fgp_coach') || '[]');
var apiKey = localStorage.getItem('fgp_key') || '';
var ltmr = null, lidx = 0;

function saveKey() {
  apiKey = document.getElementById('api-key').value.trim();
  localStorage.setItem('fgp_key', apiKey);
  var notice = document.getElementById('api-notice');
  if (notice) notice.classList.toggle('hidden', !!apiKey);
  alert(apiKey ? 'API key saved!' : 'Key cleared.');
}

function gc(g) { return g && g[0]==='A' ? 'var(--green)' : g && g[0]==='B' ? 'var(--cyan)' : g && g[0]==='C' ? 'var(--gold)' : 'var(--red)'; }
function sc(s) { return s >= 8 ? 'var(--green)' : s >= 6 ? 'var(--cyan)' : s >= 5 ? 'var(--gold)' : 'var(--red)'; }

function startLoad() {
  var el = document.getElementById('lsteps');
  if (!el) return;
  el.innerHTML = LSTEPS.map(function(s) { return '<div class="cad-lstep">' + s + '</div>'; }).join('');
  el.children[0].classList.add('on');
  lidx = 0;
  ltmr = setInterval(function() {
    if (lidx < el.children.length - 1) {
      el.children[lidx].classList.remove('on');
      el.children[lidx].classList.add('done');
      lidx++;
      el.children[lidx].classList.add('on');
    }
  }, 3500);
}
function stopLoad() { clearInterval(ltmr); }

function analyze() {
  var url = document.getElementById('yt-url').value.trim();
  var notes = document.getElementById('s-notes').value.trim();
  if (!url) { showErr('Please enter a YouTube URL'); return; }
  if (!apiKey) { showErr('Add your Gemini API key above'); return; }
  hideErr();
  document.getElementById('results').innerHTML = '';
  document.getElementById('coach-recent').style.display = 'none';
  document.getElementById('load-box').classList.add('on');
  document.getElementById('analyze-btn').disabled = true;
  startLoad();

  var trendCtx = '';
  if (coachHistory.length === 0) {
    trendCtx = 'First analyzed session — no previous data.';
  } else {
    trendCtx = 'PREVIOUS SESSIONS (use for trend analysis):\n';
    coachHistory.slice(0, 3).forEach(function(s, i) {
      trendCtx += 'Session ' + (i + 1) + ' (' + new Date(s.date).toLocaleDateString('en-US', {month:'short',day:'numeric'}) + '):\n';
      trendCtx += '  Grade: ' + s.grade + ' (' + s.score + '/100), Fargo ~' + (s.fargo || 'unknown') + '\n';
      if (s.a && s.a.scorecard) {
        var scStr = Object.entries(s.a.scorecard).map(function(kv) {
          var v = kv[1]; return kv[0] + ':' + (typeof v === 'object' ? v.score : v);
        }).join(', ');
        trendCtx += '  Scorecard: ' + scStr + '\n';
      }
      if (s.a && s.a.practicePrescription && s.a.practicePrescription.focus)
        trendCtx += '  Prescription focus was: ' + s.a.practicePrescription.focus + '\n';
      trendCtx += '\n';
    });
  }

  var body = JSON.stringify({
    system_instruction: {parts:[{text:COACH_PROMPT}]},
    contents: [{role:'user',parts:[{text:'Analyze: ' + url + '\n' + (notes ? 'Notes: "' + notes + '"\n\n' : '') + trendCtx + '\nReturn JSON only.'}]}],
    generationConfig: {temperature:0.7,maxOutputTokens:8192,responseMimeType:'application/json'}
  });

  fetch('https://generativelanguage.googleapis.com/v1beta/models/' + COACH_MODEL + ':generateContent?key=' + apiKey, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: body
  })
  .then(function(r) { return r.json().then(function(d) { return {ok:r.ok,d:d}; }); })
  .then(function(res) {
    if (!res.ok) throw new Error((res.d.error && res.d.error.message) || 'API error');
    var raw = (res.d.candidates && res.d.candidates[0] && res.d.candidates[0].content &&
               res.d.candidates[0].content.parts && res.d.candidates[0].content.parts[0] &&
               res.d.candidates[0].content.parts[0].text) || '';
    var a = JSON.parse(raw.replace(/```json|```/g, '').trim());
    stopLoad();
    document.getElementById('load-box').classList.remove('on');
    var vid = (url.match(/(?:v=|youtu\.be\/)([^&\s]+)/) || [])[1] || '';
    var entry = {id:Date.now(),date:new Date().toISOString(),url:url,vid:vid,notes:notes,grade:a.overallGrade,score:a.overallScore,fargo:(a.fargoEstimate&&a.fargoEstimate.rating)||null,summary:a.sessionSummary,a:a};
    coachHistory.unshift(entry);
    coachHistory = coachHistory.slice(0, 20);
    localStorage.setItem('fgp_coach', JSON.stringify(coachHistory));
    renderResults(a);
    document.getElementById('analyze-btn').disabled = false;
    document.getElementById('coach-recent').style.display = 'block';
  })
  .catch(function(e) {
    stopLoad();
    document.getElementById('load-box').classList.remove('on');
    document.getElementById('analyze-btn').disabled = false;
    document.getElementById('coach-recent').style.display = 'block';
    showErr(e.message || 'Analysis failed. Check your API key.');
  });
}

function renderResults(a) {
  var f = a.fargoEstimate || {}, p = a.practicePrescription || {};
  var gradeColor = gc(a.overallGrade);
  var h = '<div class="coach-result-card" style="border-color:' + gradeColor + '40">';
  h += '<div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">';
  h += '<div style="font-size:56px;font-weight:bold;color:' + gradeColor + ';line-height:1;font-family:Rajdhani,sans-serif">' + a.overallGrade + '</div>';
  h += '<div><div style="font-size:28px;font-weight:bold;font-family:Rajdhani,sans-serif">' + a.overallScore + '<span style="font-size:13px;color:var(--dim)">/100</span></div>';
  h += '<div style="font-size:11px;color:var(--cyan);letter-spacing:1px">FARGO ~' + (f.rating || '—') + '</div>';
  h += '<div style="font-size:9px;color:var(--dim);letter-spacing:1px">' + (f.trend || '') + ' · ' + (f.confidence || '') + '</div></div></div>';
  h += '<div style="font-size:13px;line-height:1.6;color:var(--text)">' + (a.sessionSummary || '') + '</div></div>';

  if (a.scorecard && Object.keys(a.scorecard).length) {
    h += '<div class="coach-result-card"><div class="coach-clbl">SCORECARD</div>';
    Object.entries(a.scorecard).forEach(function(e) {
      var k = e[0], v = e[1];
      var score = typeof v === 'object' ? (v.score || 0) : (v || 0);
      var label = SCLABELS[k] || k;
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
      h += '<div style="font-size:10px;color:var(--text);flex:1">' + label + '</div>';
      h += '<div style="flex:0 0 80px;height:6px;background:var(--panel2);border-radius:3px;overflow:hidden"><div style="height:100%;border-radius:3px;background:' + sc(score) + ';width:' + (score * 10) + '%"></div></div>';
      h += '<div style="font-size:10px;color:' + sc(score) + ';width:24px;text-align:right">' + score + '</div></div>';
    });
    h += '</div>';
  }

  if (a.strengths && a.strengths.length) {
    h += '<div class="coach-result-card"><div class="coach-clbl">STRENGTHS</div>';
    a.strengths.forEach(function(s) {
      h += '<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)"><div style="font-weight:bold;font-size:14px;color:var(--green);margin-bottom:3px">' + s.title + '</div><div style="font-size:12px;color:var(--dim2)">' + s.detail + '</div></div>';
    });
    h += '</div>';
  }

  if (a.improvements && a.improvements.length) {
    var pc = {1:'var(--red)',2:'var(--gold)',3:'var(--cyan)'}, pl = {1:'URGENT',2:'FOCUS',3:'REFINE'};
    h += '<div class="coach-result-card"><div class="coach-clbl">IMPROVEMENTS</div>';
    a.improvements.slice().sort(function(x, y) { return (x.priority||3)-(y.priority||3); }).forEach(function(imp) {
      var c = pc[imp.priority] || 'var(--dim)', l = pl[imp.priority] || 'NOTE';
      h += '<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)"><div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><span style="font-size:9px;color:' + c + ';border:1px solid ' + c + ';border-radius:3px;padding:1px 5px;letter-spacing:1px">' + l + '</span><span style="font-weight:bold;font-size:14px">' + imp.title + '</span></div><div style="font-size:12px;color:var(--dim2)">' + imp.detail + '</div></div>';
    });
    h += '</div>';
  }

  if (a.jerryNarrative)
    h += '<div class="coach-result-card"><div class="coach-clbl">FLASH COACH SAYS</div><div style="font-size:13px;line-height:1.7;white-space:pre-wrap">' + a.jerryNarrative + '</div></div>';

  if (p.focus || (p.drills && p.drills.length)) {
    h += '<div class="coach-result-card" style="border-color:rgba(201,168,76,.3)"><div class="coach-clbl">PRACTICE PRESCRIPTION</div>';
    if (p.focus) h += '<div style="background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);border-radius:4px;padding:10px;margin-bottom:12px"><div style="font-size:9px;color:var(--gold);letter-spacing:1px;margin-bottom:3px">FOCUS</div><div style="font-size:13px;font-weight:bold">' + p.focus + '</div></div>';
    (p.drills || []).forEach(function(d) {
      h += '<div style="background:var(--panel2);border:1px solid var(--border);border-radius:4px;padding:12px;margin-bottom:8px"><div style="font-weight:bold;font-size:14px;color:var(--gold);margin-bottom:3px">' + d.name + '</div><div style="font-size:10px;color:var(--cyan);letter-spacing:1px;margin-bottom:3px">' + (d.reps||'') + '</div><div style="font-size:12px;color:var(--dim2)">' + (d.why||'') + '</div></div>';
    });
    if (p.mentalCue) h += '<div style="font-size:11px;color:var(--gold);text-align:center;font-style:italic;margin-top:8px">"' + p.mentalCue + '"</div>';
    h += '</div>';
  }

  if (a.proTimelineNote)
    h += '<div class="coach-result-card"><div class="coach-clbl">PRO TIMELINE</div><div style="font-size:13px;line-height:1.6">' + a.proTimelineNote + '</div></div>';

  h += '<button class="btn-reset" style="width:100%;margin-top:4px" onclick="genYTDesc()">📄 GENERATE YOUTUBE DESCRIPTION</button>';
  document.getElementById('results').innerHTML = h;
}

function renderRecent() {
  var list = document.getElementById('recent-list');
  var empty = document.getElementById('recent-empty');
  if (!list) return;
  if (!coachHistory.length) { list.innerHTML = ''; if(empty) empty.style.display = 'block'; return; }
  if(empty) empty.style.display = 'none';
  list.innerHTML = coachHistory.slice(0, 5).map(function(s, i) {
    var gradeColor = gc(s.grade);
    return '<div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:12px">' +
      '<div style="font-size:22px;font-weight:bold;color:' + gradeColor + ';font-family:Rajdhani,sans-serif;width:36px;text-align:center">' + s.grade + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:10px;color:var(--dim);letter-spacing:1px">' + new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + '</div>' +
        '<div style="font-size:13px;font-weight:bold;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px">' + (s.summary || 'Session') + '</div>' +
        '<div style="font-size:10px;color:var(--dim);margin-top:1px">Fargo ~' + (s.fargo||'—') + ' · ' + (s.score||0) + '/100</div>' +
        '<div style="display:flex;gap:8px;margin-top:6px">' +
          '<button onclick="reanalyze(' + i + ')" style="font-size:9px;color:var(--cyan);background:rgba(0,191,255,.08);border:1px solid rgba(0,191,255,.3);border-radius:3px;padding:3px 8px;cursor:pointer;letter-spacing:1px">↻ RE-ANALYZE</button>' +
          '<button onclick="deleteCoachSession(' + i + ')" style="font-size:9px;color:var(--red);background:rgba(255,61,87,.08);border:1px solid rgba(255,61,87,.3);border-radius:3px;padding:3px 8px;cursor:pointer;letter-spacing:1px">× DELETE</button>' +
        '</div>' +
      '</div></div>';
  }).join('');
}

function deleteCoachSession(i) {
  if (!confirm('Delete this session?')) return;
  coachHistory.splice(i, 1);
  localStorage.setItem('fgp_coach', JSON.stringify(coachHistory));
  renderRecent();
}

function reanalyze(i) {
  var s = coachHistory[i];
  if (!s || !s.url) return;
  document.getElementById('yt-url').value = s.url;
  document.getElementById('s-notes').value = s.notes || '';
  localStorage.setItem('fgp_last_url', s.url);
  coachHistory.splice(i, 1);
  coachHistory.push(s);
  localStorage.setItem('fgp_coach', JSON.stringify(coachHistory));
  if (typeof switchTab === 'function') switchTab('coach');
  analyze();
}

function showErr(m) {
  var e = document.getElementById('err-box');
  if (e) { e.textContent = m; e.classList.add('on'); }
}
function hideErr() {
  var e = document.getElementById('err-box');
  if (e) e.classList.remove('on');
}

function genYTDesc() {
  var e = coachHistory[0];
  if (!e || !e.a) return;
  var a = e.a, f = a.fargoEstimate || {}, p = a.practicePrescription || {};
  var sc2 = a.scorecard || {};
  var scLines = Object.entries(sc2).map(function(kv) {
    var k = kv[0], v = kv[1];
    var score = typeof v === 'object' ? (v.score || 0) : (v || 0);
    var label = {preShot:'Pre-Shot Routine',stance:'Stance & Alignment',bridge:'Bridge & Grip',stroke:'Stroke Mechanics',followThrough:'Follow-Through',cueBallControl:'CB Control',positionPlay:'Position Play',safetyPlay:'Safety Play',speedControl:'Speed Control',mentalGame:'Mental Game'}[k] || k;
    var bar = ''; for (var i = 0; i < 10; i++) bar += i < score ? '█' : '░';
    return label + ': ' + bar + ' ' + score + '/10';
  }).join('\n');
  var drillLines = (p.drills || []).map(function(d, i) { return (i+1) + '. ' + d.name + ' — ' + d.reps; }).join('\n');
  var date = new Date(e.date).toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'});
  var desc = '⚡ FLASH GORDON POOL | Practice Session Analysis\n' + date + '\n\nThe comeback nobody saw coming.\n\n' +
    '───────────────────────────────\n📋 SESSION SUMMARY\n───────────────────────────────\n' +
    (a.sessionSummary || '') +
    '\n\n───────────────────────────────\n📊 FLASH COACH GRADE: ' + a.overallGrade + ' · ' + a.overallScore + '/100\n' +
    'Fargo Est: ~' + (f.rating || '—') + ' (' + (f.range || '—') + ') · ' + (f.trend || '') +
    '\n\nSCORECARD\n' + scLines +
    '\n\n───────────────────────────────\n🎯 PRACTICE PRESCRIPTION\n───────────────────────────────\n' +
    'Focus: ' + (p.focus || '—') + '\n\n' +
    (drillLines ? 'Drills:\n' + drillLines + '\n\n' : '') +
    (p.mentalCue ? 'Mental cue: "' + p.mentalCue + '"\n\n' : '') +
    '───────────────────────────────\n⚙️ EQUIPMENT\n───────────────────────────────\n' +
    'Cue: McDermott H1752 | Defy Carbon Fiber Shaft\nTable: Brunswick Gold Crown IV 9ft\nCloth: Simonis 870 Tournament Blue\n\n' +
    '───────────────────────────────\n🧠 AI COACHING\n───────────────────────────────\n' +
    'Analyzed by Flash Coach AI\nCadence: 60 BPM · 6 measures · Feel-based cues\n\n' +
    '───────────────────────────────\n📍 FLASH GORDON POOL\n───────────────────────────────\n' +
    'Scott "Flash Gordon" Gordon | Fitchburg, MA\nFargo ~640 rising | Goal: 750+ Pro\nThe orthodox stroke rebuild. The 3-year plan.\n\n' +
    'flashgordonpool.com\n@flashgordonpool\n\n' +
    '#poolbilliards #billiards #9ball #8ball #poolplayer\n' +
    '#flashgordonpool #fargorating #brunswick #mcdermott\n' +
    '#simonis #practicesession #orthodoxstroke #cueball\n' +
    '#poolcoach #billiardstraining #comebacker';

  var existing = document.getElementById('yt-desc-box');
  if (existing) existing.remove();
  var wrap = document.createElement('div');
  wrap.id = 'yt-desc-box';
  wrap.className = 'coach-result-card';
  wrap.style.marginTop = '14px';
  wrap.innerHTML = '<div class="coach-clbl" style="margin-bottom:8px">YOUTUBE DESCRIPTION</div>' +
    '<textarea class="cad-inp" rows="12" style="font-size:11px;line-height:1.5;margin-bottom:10px;resize:none" readonly>' + desc + '</textarea>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
    '<button class="sf-save-btn" onclick="copyYTDesc()" style="font-size:12px">📋 COPY</button>' +
    '<button class="sf-save-btn" onclick="shareYTDesc()" id="share-btn" style="display:none;font-size:12px">↑ SHARE</button>' +
    '</div>';
  document.getElementById('results').appendChild(wrap);
  wrap.scrollIntoView({behavior:'smooth'});
  if (navigator.share) { var sb = wrap.querySelector('#share-btn'); if(sb) sb.style.display = 'block'; }
}

function shareYTDesc() {
  var ta = document.querySelector('#yt-desc-box textarea');
  if (!ta) return;
  if (navigator.share) navigator.share({title:'Flash Gordon Pool — Session Analysis', text:ta.value}).catch(function(){});
}

function copyYTDesc() {
  var ta = document.querySelector('#yt-desc-box textarea');
  if (!ta) return;
  ta.select();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ta.value).then(function() {
      var btn = document.querySelector('#yt-desc-box .sf-save-btn');
      if (btn) { btn.textContent = '✓ COPIED!'; btn.style.background = 'var(--green)'; btn.style.color = '#000'; }
      setTimeout(function() {
        var btn2 = document.querySelector('#yt-desc-box .sf-save-btn');
        if (btn2) { btn2.innerHTML = '📋 COPY'; btn2.style.background = ''; btn2.style.color = ''; }
      }, 2000);
    });
  } else {
    document.execCommand('copy');
    alert('Copied!');
  }
}

// ── FARGO TRACKER ────────────────────────────────────────
var fargoData = JSON.parse(localStorage.getItem('fgp_fargo') || '[]');
var fargoSrc = 'Official';

function selectFargoSrc(s) {
  fargoSrc = s;
  ['Official','AI','Self'].forEach(function(x) {
    var btn = document.getElementById('fsrc-' + x);
    if (btn) btn.classList.toggle('on', x === s);
  });
}

function toggleFargoForm() {
  var f = document.getElementById('fargo-form');
  if (!f) return;
  var showing = f.style.display === 'block';
  f.style.display = showing ? 'none' : 'block';
  if (!showing) {
    var last = fargoData.length ? fargoData[0].rating : 640;
    var slider = document.getElementById('f-slider');
    var sliderVal = document.getElementById('f-slider-val');
    if (slider) slider.value = last;
    if (sliderVal) sliderVal.textContent = last;
    selectFargoSrc('Official');
    var noteEl = document.getElementById('f-note');
    if (noteEl) noteEl.value = '';
    f.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

function saveFargo() {
  var slider = document.getElementById('f-slider');
  var noteEl = document.getElementById('f-note');
  var rating = parseInt(slider ? slider.value : 640);
  var note = noteEl ? noteEl.value.trim() : '';
  var entry = {id:Date.now(), date:new Date().toISOString(), rating:rating, source:fargoSrc, note:note};
  fargoData.unshift(entry);
  localStorage.setItem('fgp_fargo', JSON.stringify(fargoData));
  _syncFargoToProfile(rating, fargoSrc);
  if (document.getElementById('fargo-form')) document.getElementById('fargo-form').style.display = 'none';
  renderFargo();
}

// Called automatically from RDS/RDS-100/Flash Coach after session completion
function logFargoEstimate(rating, source, note) {
  var entry = {id:Date.now(), date:new Date().toISOString(), rating:rating, source:source, note:note||''};
  fargoData.unshift(entry);
  localStorage.setItem('fgp_fargo', JSON.stringify(fargoData));
  _syncFargoToProfile(rating, source);
  if (document.getElementById('f-hero')) renderFargo();
}

function _syncFargoToProfile(rating, source) {
  try {
    var settings = JSON.parse(localStorage.getItem('fgp_settings') || '{}');
    var cur = settings.fargo || 0;
    // Official always wins; estimates only update if higher than current
    if (source === 'Official' || rating > cur) {
      settings.fargo = rating;
      localStorage.setItem('fgp_settings', JSON.stringify(settings));
    } else {
      rating = cur; // keep current for display
    }
    // Update all live Fargo displays
    var navFargo = document.getElementById('navFargo');
    if (navFargo) navFargo.textContent = 'FARGO ' + settings.fargo;
    var fargoDisplay = document.getElementById('fargoDisplay');
    if (fargoDisplay) fargoDisplay.textContent = settings.fargo;
    // Sidebar
    var sbCur  = document.getElementById('sbFargoCur');
    var sbGoal = document.getElementById('sbFargoGoal');
    var sbFill = document.getElementById('sbFargoFill');
    var goal = settings.fargoGoal || 750;
    if (sbCur)  sbCur.textContent  = settings.fargo;
    if (sbGoal) sbGoal.textContent = goal;
    if (sbFill) sbFill.style.width = Math.min(100, Math.max(0, (settings.fargo - 400) / (goal - 400) * 100)) + '%';
  } catch(e) {}
}

function _getFargoTrend(data) {
  if (data.length < 2) return 'NO DATA';
  var diff = data[0].rating - data[1].rating;
  if (diff >= 15) return '⬆ SURGING';
  if (diff >= 3)  return '↗ RISING';
  if (diff <= -5) return '↘ DECLINING';
  return '→ STABLE';
}

function _getTrendColor(trend) {
  if (trend.indexOf('SURGING') >= 0) return 'var(--green)';
  if (trend.indexOf('RISING') >= 0)  return 'var(--cyan)';
  if (trend.indexOf('DECLINING') >= 0) return 'var(--red)';
  return 'var(--dim)';
}

function _getFargoSrcColor(src) {
  return src === 'Official' ? 'var(--cyan)'
       : src === 'AI'       ? 'var(--gold)'
       : src === 'RDS'      ? '#4dff91'
       : src === 'RDS-100'  ? '#80ffb0'
       : 'var(--dim)';  // Self
}

function renderFargo() {
  var heroEl    = document.getElementById('f-hero');
  var trendEl   = document.getElementById('f-trend');
  var progEl    = document.getElementById('f-progbar');
  var progLbl   = document.getElementById('f-prog-lbl');
  var offEl     = document.getElementById('f-official');
  var rdsEl     = document.getElementById('f-rds');
  var aiEl      = document.getElementById('f-ai');
  var chartEl   = document.getElementById('f-chart');
  var histEl    = document.getElementById('f-history');
  var emptyEl   = document.getElementById('f-empty');

  if (!heroEl) return;

  if (!fargoData.length) {
    heroEl.innerHTML = '—';
    if (trendEl) { trendEl.textContent = 'NO DATA'; trendEl.style.color = 'var(--dim)'; }
    if (progEl) progEl.style.width = '0%';
    if (progLbl) progLbl.textContent = '';
    if (offEl) offEl.innerHTML = '—';
    if (rdsEl) rdsEl.innerHTML = '—';
    if (aiEl) aiEl.innerHTML = '—';
    if (chartEl) chartEl.innerHTML = '';
    if (histEl) histEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  var latest = fargoData[0];
  var trend = _getFargoTrend(fargoData);
  var trendColor = _getTrendColor(trend);

  heroEl.textContent = latest.rating;
  if (trendEl) { trendEl.textContent = trend; trendEl.style.color = trendColor; }

  var target = 750;
  var pct = Math.min(100, Math.max(0, (latest.rating - 400) / (target - 400) * 100));
  if (progEl) progEl.style.width = pct + '%';
  var toGo = target - latest.rating;
  if (progLbl) progLbl.textContent = toGo > 0 ? (toGo + ' POINTS TO TARGET') : 'TARGET REACHED!';

  var offEntry = fargoData.find(function(e) { return e.source === 'Official'; });
  var rdsEntry = fargoData.find(function(e) { return e.source === 'RDS' || e.source === 'RDS-100'; });
  var aiEntry  = fargoData.find(function(e) { return e.source === 'AI'; });
  if (offEl) offEl.textContent = offEntry ? offEntry.rating : '—';
  if (rdsEl) { rdsEl.textContent = rdsEntry ? rdsEntry.rating : '—'; if (rdsEntry) rdsEl.style.color = _getFargoSrcColor(rdsEntry.source); }
  if (aiEl)  aiEl.textContent  = aiEntry  ? aiEntry.rating  : '—';

  if (chartEl) {
    chartEl.innerHTML = '';
    fargoData.slice(0, 12).reverse().forEach(function(e) {
      var h = Math.round((e.rating - 400) / 400 * 64) + 8;
      var col = document.createElement('div');
      col.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px';
      col.title = e.rating + ' (' + e.source + ') ' + new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric'});
      var bar = document.createElement('div');
      bar.style.cssText = 'width:100%;border-radius:3px 3px 0 0;opacity:0.85;height:' + h + 'px;background:' + _getFargoSrcColor(e.source);
      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:7px;color:var(--dim);text-align:center;line-height:1';
      lbl.textContent = e.rating;
      col.appendChild(bar); col.appendChild(lbl);
      chartEl.appendChild(col);
    });
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (histEl) {
    histEl.innerHTML = fargoData.map(function(e, i) {
      var srcColor = _getFargoSrcColor(e.source);
      var dateStr = new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      return '<div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:10px">' +
        '<div style="font-size:22px;font-weight:bold;color:var(--gold);font-family:Rajdhani,sans-serif;width:44px;text-align:center">' + e.rating + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">' +
            '<span style="font-size:9px;color:' + srcColor + ';border:1px solid ' + srcColor + ';border-radius:3px;padding:1px 5px;letter-spacing:1px">' + e.source.toUpperCase() + '</span>' +
            '<span style="font-size:10px;color:var(--dim);letter-spacing:1px">' + dateStr + '</span>' +
          '</div>' +
          (e.note ? '<div style="font-size:11px;color:var(--dim2);margin-top:2px">' + cadEsc(e.note) + '</div>' : '') +
        '</div>' +
        '<button onclick="deleteFargo(' + i + ')" style="font-size:9px;color:var(--red);background:rgba(255,61,87,.08);border:1px solid rgba(255,61,87,.3);border-radius:3px;padding:4px 7px;cursor:pointer;flex-shrink:0">×</button>' +
      '</div>';
    }).join('');
  }
}

function cadEsc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function deleteFargo(i) {
  if (!confirm('Delete this entry?')) return;
  fargoData.splice(i, 1);
  localStorage.setItem('fgp_fargo', JSON.stringify(fargoData));
  renderFargo();
}

// ── WAKE LOCK ────────────────────────────────────────────
var _cadWakeLock = null;
function acquireWakeLock() {
  if (!('wakeLock' in navigator)) return;
  navigator.wakeLock.request('screen').then(function(lock) {
    _cadWakeLock = lock;
    _cadWakeLock.addEventListener('release', function() {
      if (micOn) acquireWakeLock();
    });
  }).catch(function(){});
}
function releaseWakeLock() {
  if (_cadWakeLock) { _cadWakeLock.release(); _cadWakeLock = null; }
}
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') saveSession();
  if (document.visibilityState === 'visible' && micOn) { acquireWakeLock(); setTimeout(restartRecog, 300); }
});

// ── VOICE ────────────────────────────────────────────────
var speakingConfirm = false;
function speakConfirm(msg) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(msg);
  u.rate = 1.1; u.pitch = 1.0; u.volume = 1.0; u.lang = 'en-US';
  speakingConfirm = true;
  u.onend = function() { speakingConfirm = false; };
  u.onerror = function() { speakingConfirm = false; };
  window.speechSynthesis.speak(u);
}

var recog = null, micOn = false, lastCmd = '', lastCmdTime = 0;

function initSpeech() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micBtn = document.getElementById('mic-btn');
  if (!SR) { if (micBtn) micBtn.style.display = 'none'; return; }
  recog = new SR();
  recog.continuous = true;
  recog.interimResults = false;
  recog.lang = 'en-US';

  function flashStatus(el, msg) {
    if (!el) return;
    el.textContent = msg; el.style.color = 'var(--green)';
    setTimeout(function() { if(el) { el.style.color = 'var(--dim)'; el.textContent = '🎤 Listening...'; } }, 2000);
  }

  recog.onresult = function(e) {
    if (speakingConfirm) return;
    var transcript = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
    var el = document.getElementById('mic-status');
    var now = Date.now();
    if (/\b(made|maid|mate|wade|paid)\b/.test(transcript)) {
      if ('made' === lastCmd && now - lastCmdTime < 2500) return;
      lastCmd = 'made'; lastCmdTime = now;
      shot(true); speakConfirm('Made. ' + made + ' for ' + att); flashStatus(el, '✓ Made');
      return;
    }
    if (/\b(miss|kiss|mrs|mist)\b/.test(transcript)) {
      if ('miss' === lastCmd && now - lastCmdTime < 2500) return;
      lastCmd = 'miss'; lastCmdTime = now;
      shot(false); speakConfirm('Miss. ' + made + ' for ' + att); flashStatus(el, '✗ Miss');
      return;
    }
    if (!/\b(flash|flesh|lash|clash|slash|blast)\b/.test(transcript)) return;
    var action = '';
    if      (/\b(start|started|starting|stark|star|dart|chart|heart|park|mark|art|tart|part|guard)\b/.test(transcript)) action = 'start';
    else if (/\b(stop|stopped|top|cop|drop|prop)\b/.test(transcript))  action = 'stop';
    else if (/\b(reset|restart|set)\b/.test(transcript))               action = 'reset';
    else if (/\b(undo|unto|uno|under)\b/.test(transcript))             action = 'undo';
    else action = cadOn ? 'stop' : 'start'; // "flash" alone toggles
    if (action === lastCmd && now - lastCmdTime < 2500) return;
    lastCmd = action; lastCmdTime = now;
    if (action === 'start')       { if (!cadOn) { cadenceGo();   setTimeout(function(){ speakConfirm('Starting'); }, 300); flashStatus(el, '▶ Starting'); } }
    else if (action === 'stop')   { if (cadOn)  { cadenceStop(); speakConfirm('Stopped');  flashStatus(el, '⏹ Stopped'); } }
    else if (action === 'reset')  { resetShots(); speakConfirm('Counter reset'); flashStatus(el, '↻ Reset'); }
    else if (action === 'undo')   { undo();        speakConfirm('Undone');        flashStatus(el, '↩ Undone'); }
  };

  recog.onerror = function(e) {
    if (e.error === 'no-speech' || e.error === 'audio-capture') { if (micOn) restartRecog(); return; }
    var el = document.getElementById('mic-status');
    if (el) { el.textContent = 'Error: ' + e.error; el.style.color = 'var(--red)'; }
    micOn = false; updateMicBtn();
  };

  recog.onend = function() { if (micOn) setTimeout(restartRecog, 300); };
}

function restartRecog() { try { recog.start(); } catch(e) {} }

function toggleMic() {
  if (!recog) return;
  micOn = !micOn;
  if (micOn) {
    if (window.speechSynthesis) { window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(' '); u.volume = 0; window.speechSynthesis.speak(u); }
    var el = document.getElementById('mic-status');
    if (el) el.textContent = '🎤 Listening...';
    acquireWakeLock();
    var startRecog = function() { try { recog.start(); } catch(e) {} };
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio:true})
        .then(function(stream) { stream.getTracks().forEach(function(t){ t.stop(); }); startRecog(); })
        .catch(startRecog);
    } else {
      startRecog();
    }
  } else {
    try { recog.stop(); } catch(e) {}
    var el2 = document.getElementById('mic-status');
    if (el2) el2.textContent = '';
    releaseWakeLock();
  }
  updateMicBtn();
}

function updateMicBtn() {
  var btn = document.getElementById('mic-btn');
  if (!btn) return;
  if (micOn) {
    btn.className = 'cad-mic-armed';
    btn.textContent = '🎤 LISTENING...';
  } else {
    btn.className = 'btn-reset cad-mic-btn';
    btn.innerHTML = '🎤 ARM VOICE';
  }
}

// ── SESSION TRACKING ────────────────────────────────────
var sessionStart = null, sessionTimer = null, currentSession = null;

function startSession() {
  if (sessionStart) return;
  sessionStart = Date.now();
  currentSession = {id:Date.now(), date:new Date().toISOString(), duration:0, shots:{attempted:0,made:0,pct:0}, longestRun:0, cycles:0};
  sessionTimer = setInterval(function() {
    if (currentSession) currentSession.duration = Math.round((Date.now() - sessionStart) / 60000);
  }, 60000);
}

function saveSession() {
  if (!currentSession || !sessionStart) return;
  currentSession.duration = Math.max(1, Math.round((Date.now() - sessionStart) / 60000));
  currentSession.shots.attempted = att;
  currentSession.shots.made = made;
  currentSession.shots.pct = att > 0 ? Math.round(made / att * 100) : 0;
  currentSession.longestRun = best;
  currentSession.cycles = cadCyc;
  if (currentSession.duration >= 1 || att > 0) {
    var sessions = JSON.parse(localStorage.getItem('fgp_sessions') || '[]');
    sessions.unshift(currentSession);
    sessions = sessions.slice(0, 90);
    localStorage.setItem('fgp_sessions', JSON.stringify(sessions));
    updateAllTime(currentSession);
    renderCadenceStats();
  }
  clearInterval(sessionTimer);
  sessionStart = null; currentSession = null;
}

function updateAllTime(s) {
  var at = JSON.parse(localStorage.getItem('fgp_alltime') || '{}');
  at.totalMinutes = (at.totalMinutes || 0) + s.duration;
  at.totalShots   = (at.totalShots || 0) + s.shots.attempted;
  at.totalMade    = (at.totalMade || 0) + s.shots.made;
  at.allTimeLongestRun = Math.max(at.allTimeLongestRun || 0, s.longestRun);
  at.totalSessions = (at.totalSessions || 0) + 1;
  var today = new Date().toDateString();
  if (at.lastPracticeDate === new Date(Date.now() - 86400000).toDateString()) {
    at.currentStreak = (at.currentStreak || 0) + 1;
  } else if (at.lastPracticeDate !== today) {
    at.currentStreak = 1;
  }
  at.lastPracticeDate = today;
  localStorage.setItem('fgp_alltime', JSON.stringify(at));
}

function renderCadenceStats() {
  var at = JSON.parse(localStorage.getItem('fgp_alltime') || '{}');
  var sessions = JSON.parse(localStorage.getItem('fgp_sessions') || '[]');
  var boxes = [
    {val:at.totalSessions||0, lbl:'SESSIONS',   color:'var(--gold)'},
    {val:at.totalMinutes||0,  lbl:'MINUTES',    color:'var(--cyan)'},
    {val:at.currentStreak||0, lbl:'DAY STREAK', color:'var(--gold)'},
    {val:at.totalMade||0,     lbl:'MADE',       color:'var(--green)'},
    {val:at.totalShots||0,    lbl:'SHOTS',      color:'var(--cyan)'},
    {val:at.allTimeLongestRun||0, lbl:'BEST RUN', color:'var(--green)'},
  ];
  var statsEl = document.getElementById('alltime-stats');
  if (statsEl) {
    statsEl.innerHTML = boxes.map(function(b) {
      return '<div class="stat-card"><div class="stat-num" style="color:' + b.color + '">' + b.val + '</div><div class="stat-lbl">' + b.lbl + '</div></div>';
    }).join('');
  }
  var emptyEl = document.getElementById('session-empty');
  var histEl  = document.getElementById('session-history');
  if (!histEl) return;
  if (!sessions.length) {
    if (emptyEl) emptyEl.style.display = 'block';
    histEl.innerHTML = '';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  histEl.innerHTML = sessions.slice(0, 10).map(function(s) {
    var d = new Date(s.date);
    var dateStr = d.toLocaleDateString('en-US', {month:'short', day:'numeric'});
    var pct = s.shots.attempted > 0 ? Math.round(s.shots.made / s.shots.attempted * 100) + '%' : '—';
    return '<div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:10px">' +
      '<div style="font-size:10px;color:var(--dim);letter-spacing:1px;width:48px">' + dateStr + '</div>' +
      '<div style="flex:1">' +
        '<div style="font-size:12px;font-weight:bold;color:var(--text)">' + s.duration + 'min · ' + s.cycles + ' cycles</div>' +
        '<div style="font-size:10px;color:var(--dim);margin-top:1px">' + s.shots.made + '/' + s.shots.attempted + ' (' + pct + ') · best run: ' + s.longestRun + '</div>' +
      '</div>' +
      '<div style="font-size:16px;font-weight:bold;color:var(--gold);font-family:Rajdhani,sans-serif">' + s.longestRun + '</div>' +
    '</div>';
  }).join('');
}

// ── INIT ─────────────────────────────────────────────────
window.addEventListener('pagehide', saveSession);

document.addEventListener('DOMContentLoaded', function() {
  // Build beat grid cells
  _cadGrid();

  // Wisdom
  wi = Math.floor(Math.random() * W.length);
  var wtxt = document.getElementById('wtxt');
  if (wtxt) wtxt.textContent = W[wi];

  // Init fargo display
  renderFargo();
  renderCadenceStats();

  // Init voice
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function() { window.speechSynthesis.getVoices(); };
  }
  initSpeech();
});
